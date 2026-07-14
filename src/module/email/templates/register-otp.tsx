import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type RegisterOtpEmailProps = {
  name: string;
  otp: string;
};

export default function RegisterOtpEmail({
  name,
  otp,
}: RegisterOtpEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>
        Verifikasi akun Coding Study
      </Preview>

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
          {/* Header */}

          <Section
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#1d4ed8)",
              textAlign: "center",
              padding: "50px 30px",
            }}
          >
            {/* Logo */}

            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                color: "#2563eb",
                fontWeight: "bold",
                fontSize: "36px",
                lineHeight: "90px",
                margin: "0 auto",
              }}
            >
              CS
            </div>

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
              Learn • Build • Grow
            </Text>
          </Section>

          {/* Body */}

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
              Halo {name} 👋
            </Heading>

            <Text
              style={{
                fontSize: "17px",
                color: "#4b5563",
                lineHeight: "30px",
              }}
            >
              Terima kasih telah membuat akun di
              <b> Coding Study</b>.
            </Text>

            <Text
              style={{
                fontSize: "17px",
                color: "#4b5563",
                lineHeight: "30px",
              }}
            >
              Gunakan kode OTP berikut untuk
              menyelesaikan proses verifikasi akun.
            </Text>

            {/* OTP */}

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

            {/* Security */}

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
                🔐 OTP berlaku selama
                <b> 10 menit.</b>
              </Text>

              <Text
                style={{
                  margin: "8px 0",
                  color: "#dc2626",
                  fontSize: "16px",
                }}
              >
                ⚠ Jangan pernah membagikan kode OTP
                kepada siapa pun.
              </Text>

              <Text
                style={{
                  margin: "8px 0",
                  color: "#6b7280",
                  fontSize: "15px",
                }}
              >
                Jika kamu tidak melakukan
                pendaftaran, abaikan email ini.
              </Text>
            </Section>

            {/* Button */}

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

          {/* Footer */}

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
              © 2026 Coding Study.
              <br />
              All Rights Reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}