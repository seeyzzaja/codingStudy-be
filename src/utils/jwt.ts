import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "#utils/env";

type AccessTokenPayload = {
  id: number;
  role?: string;
};

export const generateAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(
    { id: payload.id, ...(payload.role ? { role: payload.role } : {}) },
    config.ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};
