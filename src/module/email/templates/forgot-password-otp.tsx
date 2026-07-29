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
import { logoCsDataUri } from "../logo-cs.js";

type ForgotPasswordOtpEmailProps = {
  name: string;
  otp: string;
};

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
              src={logoCsDataUri}
              alt="Coding Study"
              width="300"
              height="100"
              style={{
                display: "block",
                margin: "0 auto",
                width: "300px",
                height: "100px",
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
