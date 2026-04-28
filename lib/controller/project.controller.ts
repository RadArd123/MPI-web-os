import { NextResponse } from "next/server";
import { ProjectService } from "../service/project.service";
import { getAuthUser } from "../auth/auth-utils";


export const ProjectController = {
    async createProject(request: Request) {
        try{
        const { name, description, link, status,  } = await request.json();
        const user = await getAuthUser();
        const userId = user?.id as string;
       if (!name ) {
                return NextResponse.json(
                    { error: "Missing required fields (name or userId)" },
                    { status: 400 },
                );
            }
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }
       
        const project = await ProjectService.createProject(userId, { name, description, link, status });
        return NextResponse.json(project, { status: 201 });
        }
        catch (error) {
            console.error("Error creating project:", error);
            return NextResponse.json(
                { error: "Failed to create project" },
                { status: 500 },
            );
        }
        },
    async getProjects(request: Request) {
        try{
            const user = await getAuthUser();
            const userId = user?.id as string;
            if (!userId) {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 },
                );
            }
            const projects = await ProjectService.getProjects(userId);
            return NextResponse.json(projects, { status: 200 });
        }
        catch (error) { 
            console.error("Error fetching projects:", error);
            return NextResponse.json(
                { error: "Failed to fetch projects" },
                { status: 500 },
            );
        }
    },
    
    async updateProject(request: Request, pathProjectId?: string) {
        try{
            const { searchParams } = new URL(request.url);
            const projectId = pathProjectId || searchParams.get("projectId");
            const { name, description, link, status } = await request.json();
            const user = await getAuthUser();
            const userId = user?.id as string;
            if (!projectId || !userId) {
                return NextResponse.json(
                    { error: "Missing required fields (projectId or userId)" },
                    { status: 400 },
                );
            }
            const project = await ProjectService.updateProject(userId, projectId, { name, description, link, status });
            return NextResponse.json(project, { status: 200 });
        }catch (error) {
            console.error("Error updating project:", error);
            return NextResponse.json(
                { error: "Failed to update project" },
                { status: 500 },
            );
        }
    },
    async deleteProject(request: Request, pathProjectId?: string) {
        try{
             const { searchParams } = new URL(request.url);
            const projectId = pathProjectId || searchParams.get("projectId");
            const user = await getAuthUser();
            const userId = user?.id as string;
            if (!projectId || !userId) {
                return NextResponse.json(
                    { error: "Missing required fields (projectId or userId)" },
                    { status: 400 },
                );
            }
            const project = await ProjectService.deleteProject(userId, projectId);
            return NextResponse.json(project, { status: 200 });
        }catch (error) {
            console.error("Error deleting project:", error);
            return NextResponse.json(
                { error: "Failed to delete project" },
                { status: 500 },
            );
        }
    },
    async getProjectByName(request: Request) {
        try{
            const { searchParams } = new URL(request.url);
            const name = searchParams.get("name");
            const user = await getAuthUser();
            const userId = user?.id as string;
            if (!name || !userId) {
                return NextResponse.json(
                    { error: "Missing required fields (name or userId)" },
                    { status: 400 },
                );
            }
            const project = await ProjectService.getProjectByName(userId, name);
            return NextResponse.json(project, { status: 200 });
        }catch (error) {
            console.error("Error fetching project by name:", error);
            return NextResponse.json(
                { error: "Failed to fetch project by name" },
                { status: 500 },
            );
        }
    }
}
