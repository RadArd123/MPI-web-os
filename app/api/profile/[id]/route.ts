import { ProfileController } from "@/lib/controller/profile.controller";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return ProfileController.getProfile(req, id);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return ProfileController.updateProfile(req, id);
}