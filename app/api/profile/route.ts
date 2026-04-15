import { ProfileController } from "@/lib/controller/profile.controller";

export async function GET(request: Request) {
    return ProfileController.getAllProfiles();
}

export async function POST(request: Request) {
    return ProfileController.getProfileByOperatorName(request);
}