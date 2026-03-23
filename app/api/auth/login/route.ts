import { AuthController } from "@/lib/controller/auth.controller";

export const POST = async (req: Request) => {
  return AuthController.login(req);
};