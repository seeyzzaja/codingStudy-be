import bcrypt from "bcrypt";

export async function hashToken(token: string) {
  return bcrypt.hash(token, 10);
}

export async function compareToken(
  token: string,
  hash: string
) {
  return bcrypt.compare(token, hash);
}