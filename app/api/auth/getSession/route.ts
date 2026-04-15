import { AuthController } from "@/lib/controller/auth.controller";

export const GET = async (req: Request) => {
  return AuthController.getSession(req);
};


