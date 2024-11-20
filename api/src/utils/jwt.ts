import { decode, sign, verify } from "jsonwebtoken";
import env from "./env";

export const encodeJwt = (payload: Record<string, string | number>) => {
  return sign(payload, env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const decodeJwt = (token: string) => {
  if (verify(token, env.JWT_SECRET!)) {
    return decode(token);
  }
  return null;
};
