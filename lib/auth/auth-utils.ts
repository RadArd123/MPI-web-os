import { cookies } from "next/headers";
import { JWTUtils } from "@/lib/auth/jwt";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("stellar_session")?.value;

  if (!token) return null;

  const payload = await JWTUtils.verifyToken(token);
  if (!payload) return null;

  return {
    id: payload.id as string,
    email: payload.email as string,
    role: (payload.role as string) || "user",
  };
}