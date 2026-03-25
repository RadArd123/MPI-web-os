import {AuthController} from "@/lib/controller/auth.controller";

export const POST = async () => {
  return await AuthController.logout();
};