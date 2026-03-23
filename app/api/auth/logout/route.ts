import {AuthController} from "@/lib/controller/auth.controller";

export const POST = async (req: Request) => {
  return await AuthController.logout();
};