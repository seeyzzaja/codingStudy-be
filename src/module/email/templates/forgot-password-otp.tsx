import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type ForgotPasswordOtpEmailProps = {
  name: string;
  otp: string;
};

const logoUrl =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22128%22%20height%3D%22128%22%20viewBox%3D%220%200%20128%20128%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%233b82f6%22/%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%231d4ed8%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle%20cx%3D%2264%22%20cy%3D%2264%22%20r%3D%2260%22%20fill%3D%22url(%23bg)%22/%3E%3Ctext%20x%3D%2264%22%20y%3D%2276%22%20text-anchor%3D%22middle%22%20font-size%3D%2246%22%20font-family%3D%22Arial%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ECS%3C/text%3E%3C/svg%3E";

export default function ForgotPasswordOtpEmail({
  name,
  otp,
}: ForgotPasswordOtpEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>Reset password Coding Study</Preview>

      <Body
        style={{
          margin: 0,
          padding: "40px 20px",
          backgroundColor: "#edf3ff",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: "620px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "18px",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          <Section
            style={{
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
              textAlign: "center",
              padding: "50px 30px",
            }}
          >
            <Img
              src={logoUrl}
              alt="Coding Study"
              width="90"
              height="90"
              style={{
                display: "block",
                margin: "0 auto",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <Heading
              style={{
                color: "#ffffff",
                marginTop: "25px",
                marginBottom: "8px",
                fontSize: "36px",
              }}
            >
              Coding Study
            </Heading>

            <Text
              style={{
                color: "#dbeafe",
                fontSize: "16px",
              }}
            >
              Learn - Build - Grow
            </Text>
          </Section>

          <Section
            style={{
              padding: "45px",
            }}
          >
            <Heading
              style={{
                color: "#111827",
                fontSize: "28px",
              }}
            >
              Halo {name}
            </Heading>

            <Text
              style={{
                fontSize: "17px",
                color: "#4b5563",
                lineHeight: "30px",
              }}
            >
              Kami menerima permintaan untuk mereset password akun
              <b> Coding Study</b>.
            </Text>

            <Text
              style={{
                fontSize: "17px",
                color: "#4b5563",
                lineHeight: "30px",
              }}
            >
              Gunakan kode OTP berikut untuk melanjutkan proses reset password.
            </Text>

            <Section
              style={{
                textAlign: "center",
                margin: "45px 0",
              }}
            >
              <Text
                style={{
                  display: "inline-block",
                  padding: "22px 50px",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: "42px",
                  letterSpacing: "14px",
                  borderRadius: "14px",
                }}
              >
                {otp}
              </Text>
            </Section>

            <Section
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                padding: "25px",
                border: "1px solid #e5e7eb",
              }}
            >
              <Text
                style={{
                  margin: "8px 0",
                  fontSize: "16px",
                }}
              >
                OTP berlaku selama <b>10 menit.</b>
              </Text>

              <Text
                style={{
                  margin: "8px 0",
                  color: "#dc2626",
                  fontSize: "16px",
                }}
              >
                Jangan pernah membagikan kode OTP kepada siapa pun.
              </Text>

              <Text
                style={{
                  margin: "8px 0",
                  color: "#6b7280",
                  fontSize: "15px",
                }}
              >
                Jika kamu tidak meminta reset password, abaikan email ini.
              </Text>
            </Section>

            <Section
              style={{
                textAlign: "center",
                marginTop: "40px",
              }}
            >
              <Button
                href="https://codingstudy.com"
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  padding: "16px 32px",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Buka Website
              </Button>
            </Section>

            <Hr
              style={{
                marginTop: "45px",
              }}
            />

            <Text
              style={{
                fontSize: "15px",
                color: "#6b7280",
              }}
            >
              Butuh bantuan?
            </Text>

            <Text
              style={{
                color: "#2563eb",
                fontWeight: "bold",
              }}
            >
              support@codingstudy.com
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#f9fafb",
              textAlign: "center",
              padding: "30px",
            }}
          >
            <Text
              style={{
                color: "#111827",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Coding Study
            </Text>

            <Text
              style={{
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Learn Programming With Confidence
            </Text>

            <Text
              style={{
                color: "#9ca3af",
                fontSize: "13px",
              }}
            >
              (c) 2026 Coding Study.
              <br />
              All Rights Reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
