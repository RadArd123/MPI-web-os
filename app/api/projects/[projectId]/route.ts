import { ProjectController } from "@/lib/controller/project.controller";


export async function PUT(
    request: Request,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const { projectId } = await params;
    return ProjectController.updateProject(request, projectId);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const { projectId } = await params;
    return ProjectController.deleteProject(request, projectId);
}