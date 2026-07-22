import jwt from "jsonwebtoken";
import config from "#config/env";

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

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.ACCESS_SECRET);
};
