import { AuthController } from "@/lib/controller/auth.controller";


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    return await AuthController.deleteAccount(id);
}