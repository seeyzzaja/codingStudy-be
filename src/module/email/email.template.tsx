// import React from "react";
import { render } from "@react-email/render";
import RegisterOtpEmail from "./templates/register-otp.js";
import ForgotPasswordOtpEmail from "./templates/forgot-password-otp.js";

export const renderRegisterOtpEmail = async (
  name: string,
  otp: string
) => {
  return render(
    <RegisterOtpEmail
      name={name}
      otp={otp}
    />
  );
};
export const renderForgotPasswordOtpEmail = async (
  name: string,
  otp: string
) => {
  return await render(
    <ForgotPasswordOtpEmail
      name={name}
      otp={otp}
    />
  );
};
