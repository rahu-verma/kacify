import { decode, sign, verify } from "jsonwebtoken";

export const encodeJwt = (payload: Record<string, any>) => {
  return sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const decodeJwt = (token: string) => {
  if (verify(token, process.env.JWT_SECRET!)) {
    return decode(token);
  }
  return null;
};
