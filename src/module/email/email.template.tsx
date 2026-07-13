// import React from "react";
import { render } from "@react-email/render";
import RegisterOtpEmail from "./templates/register-otp";

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