import {jwtVerify } from "jose";


interface UserJwtPayload {
    jti: string
    iat : number
}
export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret || secret.length === 0) {
    throw new Error("The env variable for jwt secret key is not set");
  }
  return secret;
};

export const verifyAuth = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
      );
      return verified.payload as UserJwtPayload
  } catch (e) {
    throw new Error("Your Token Has Expired");
  }
};
