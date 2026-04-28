import { ProjectController } from "@/lib/controller/project.controller";


export async function GET(request: Request) {
    return ProjectController.getProjectByName(request);
}