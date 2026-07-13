import  RegisterOtpEmail  from "../src/module/email/templates/register-otp";

export default function Preview() {
  return (
    <RegisterOtpEmail
      name="Muhammad Naufal"
      otp="123456"
    />
  );
}