import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import cors from "cors";
import { successResponse } from "#utils/response";
import userRouter from "#module/user/route/user.route";
import authRouter from "#module/auth/route/auth.route";
import courseRouter from "#module/course/route/course.route";
import { errorHandler } from "#middlewares/error.handler";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import swaggerUiOptions from "./config/swagger-ui-theme.js";
import onboardingRoute from "#module/onboarding/route/onboarding.route";
import moduleRoute from "#module/module/route/module.route";
import categoryRoute from "#module/category/route/category.route";
import forgotPasswordRoute from "#module/auth/route/forgot-password.route";
import paymentRoute from "#module/payment/route/payment.route";
import myCourseRoute from "#module/my-course/route/my-course.route";
import reviewRouter from "#module/review/route/review.route";
import logger from "./config/logger.js";
import { requestLogger } from "#middlewares/request-logger.middleware";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "cdnjs.cloudflare.com",
          "fonts.googleapis.com",
        ],
        imgSrc: ["'self'", "data:", "validator.swagger.io"],
      },
    },
  })
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));



app.get("/", (req: Request, res: Response) => {
  const processTime = Date.now() - (req.startTime ?? Date.now());
  successResponse(
    res,
    "Selamat datang",
    {
      status: "Server hidup!",
      waktu_proses: `${processTime} ms`,
    },
    null,
    200
  );
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/auth", forgotPasswordRoute);
app.use("/auth", authRouter);
app.use("/auth", forgotPasswordRoute);
app.use("/api/courses", courseRouter);
app.use("/modules", moduleRoute);
app.use("/api/onboarding", onboardingRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/my-courses", myCourseRoute);
app.use("/api", reviewRouter);
app.use(express.static("./"));

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new Error(`Route ${req.originalUrl} tidak ditemukan`));
});
app.use(errorHandler);
logger.info("Server starting...");
export default app;
