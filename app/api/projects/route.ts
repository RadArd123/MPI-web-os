import { ProjectController } from "@/lib/controller/project.controller";


export async function GET(request: Request) {
    return ProjectController.getProjects(request);
}

export async function POST(request: Request) {
    return ProjectController.createProject(request);
}