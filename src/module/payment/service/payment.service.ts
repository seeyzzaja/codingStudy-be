import prisma from "#prisma";
import { snap } from "#config/payment";
import { AppError } from "#utils/app-error";
import crypto from "crypto";
import env from "#config/env";
import { PaymentStatus } from "@prisma/client";
type AuthUser = {
  id: number;
};

type CheckoutResult = {
  paymentId: string;
  orderId: string;
  snapToken: string;
  redirectUrl: string;
};

const paymentService = {
  async getPaymentDetail(paymentId: string, authUser: AuthUser) {
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId: authUser.id,
      },
      include: {
        class: {
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            price: true,
          },
        },
      },
    });

    if (!payment) {
      throw new AppError("Payment tidak ditemukan", 404);
    }

    return payment;
  },
  async paymentHistory(
    authUser: AuthUser,
    status?: PaymentStatus,
    page = 1,
    limit = 10
  ) {
    const [payments, total] = await prisma.$transaction([
      prisma.payment.findMany({
        where: {
          userId: authUser.id,

          ...(status && {
            status,
          }),
        },

        include: {
          class: {
            select: {
              id: true,
              title: true,
              thumbnailUrl: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.payment.count({
        where: {
          userId: authUser.id,

          ...(status && {
            status,
          }),
        },
      }),
    ]);

    return {
      data: payments,

      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
  async checkout(classId: string, authUser: AuthUser): Promise<CheckoutResult> {
    // ================================
    // Cari user
    // ================================
    const user = await prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
    });

    if (!user) {
      throw new AppError("User tidak ditemukan", 404);
    }

    // ================================
    // Cari course
    // ================================
    const course = await prisma.class.findFirst({
      where: {
        id: classId,
        deletedAt: null,
        status: "PUBLISHED",
      },
    });

    if (!course) {
      throw new AppError("Course tidak ditemukan", 404);
    }

    // ================================
    // Sudah memiliki course?
    // ================================
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_classId: {
          userId: authUser.id,
          classId,
        },
      },
    });

    if (enrollment) {
      throw new AppError("Kamu sudah memiliki course ini", 400);
    }

    // ================================
    // Cek apakah masih ada payment pending
    // ================================
    const pendingPayment = await prisma.payment.findFirst({
      where: {
        userId: authUser.id,
        classId,
        status: "PENDING",
      },
    });

    if (pendingPayment) {
      return {
        paymentId: pendingPayment.id,
        orderId: pendingPayment.orderId,
        snapToken: pendingPayment.snapToken ?? "",
        redirectUrl: pendingPayment.redirectUrl ?? "",
      };
    }

    // ================================
    // Generate Order ID
    // ================================
    const orderId = `COURSE-${Date.now()}`;

    // ================================
    // Simpan Payment
    // ================================
    const payment = await prisma.payment.create({
      data: {
        userId: authUser.id,
        classId,
        orderId,
        amount: course.price,
        status: "PENDING",
      },
    });

    // ================================
    // Request Midtrans
    // ================================
    let transaction;

    try {
      transaction = await snap.createTransaction({
        transaction_details: {
          order_id: orderId,
          gross_amount: Number(course.price),
        },
      });
    } catch (error) {
      console.error("Midtrans Error:", error);

      await prisma.payment.delete({
        where: {
          id: payment.id,
        },
      });

      throw new AppError("Gagal membuat transaksi pembayaran", 500);
    }
    // ================================
    // Simpan Snap Token
    // ================================
    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        snapToken: transaction.token,
        redirectUrl: transaction.redirect_url,
      },
    });

    return {
      paymentId: payment.id,
      orderId,
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url,
    };
  },

  async findByOrderId(orderId: string) {
    const payment = await prisma.payment.findUnique({
      where: {
        orderId,
      },
      include: {
        user: true,
        class: true,
      },
    });

    if (!payment) {
      throw new AppError("Payment tidak ditemukan", 404);
    }

    return payment;
  },

  async handleWebhook(payload: {
    order_id: string;
    status_code: string;
    gross_amount: string;
    signature_key: string;
    transaction_status: string;
    transaction_id?: string;
    merchant_id: string;
  }) {
    const expectedSignature = crypto
      .createHash("sha512")
      .update(
        payload.order_id +
          payload.status_code +
          payload.gross_amount +
          env.MIDTRANS_SERVER_KEY
      )
      .digest("hex");

    if (expectedSignature !== payload.signature_key) {
      throw new AppError("Signature Midtrans tidak valid", 401);
    }
    const payment = await prisma.payment.findUnique({
      where: {
        orderId: payload.order_id,
      },
    });

    if (!payment) {
      console.log("Webhook test atau order tidak dikenal:", payload.order_id);
      return;
    }
    if (Number(payment.amount) !== Number(payload.gross_amount)) {
      throw new AppError("Nominal pembayaran tidak sesuai", 400);
    }

    if (payload.merchant_id !== env.MIDTRANS_MERCHANT_ID) {
      throw new AppError("Merchant Midtrans tidak valid", 401);
    }
    // =====================================
    // Validasi Signature Key Midtrans
    // =====================================

    let status = payment.status;

    switch (payload.transaction_status) {
      case "capture":
      case "settlement":
        status = "PAID";
        break;

      case "pending":
        status = "PENDING";
        break;

      case "expire":
        status = "EXPIRED";
        break;

      case "cancel":
      case "deny":
        status = "FAILED";
        break;

      case "refund":
      case "partial_refund":
        status = "REFUNDED";
        break;
      default:
        return;
    }

    if (payment.status === status) {
      console.log(
        `Webhook diabaikan karena status sudah ${status} (${payment.orderId})`
      );

      return payment;
    }

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status,
        ...(payload.transaction_id
          ? { transactionId: payload.transaction_id }
          : {}),
      },
    });
    // Jika pembayaran berhasil, buat enrollment
    if (status === "REFUNDED") {
      await prisma.enrollment.deleteMany({
        where: {
          paymentId: payment.id,
        },
      });
    }
    if (status === "PAID") {
      const exists = await prisma.enrollment.findUnique({
        where: {
          userId_classId: {
            userId: payment.userId,
            classId: payment.classId,
          },
        },
      });

      if (!exists) {
        await prisma.enrollment.create({
          data: {
            userId: payment.userId,
            classId: payment.classId,
            paymentId: payment.id,
          },
        });
      }
    }

    return payment;
  },
};

export default paymentService;
