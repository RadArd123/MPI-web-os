import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "cheie-secreta de rezerva-123456)",
);

export const JWTUtils = {
  generateToken: async (payload: Record<string, unknown>) => {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(SECRET);
  },
  verifyToken: async (token: string) => {
    try {
      const { payload } = await jwtVerify(token, SECRET);
      return payload;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  },

  setAuthCookie: async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set("stellar_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 ore
    });
  },
  removeAuthCookie: async () => {
    const cookieStore = await cookies();
    cookieStore.delete("stellar_session");
  },
};
