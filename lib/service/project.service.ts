import type { ProjectStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export const ProjectService = {

    createProject: async (userId: string, data: { name: string; description?: string; link?: string; status?:ProjectStatus }) => {
    return await prisma.project.create({
            data: {
                name: data.name,
                description: data.description || "",
                link: data.link || "",
                status: data.status || "FINISHED", 
                userId: userId,
            }
        });
    },
    getProjects: async (userId: string) => {
        return await prisma.project.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    },

    getProjectByName: async (userId: string, name: string) => {
        return await prisma.project.findFirst({
            where: { 
                name: name, 
                userId: userId
             },
        });
    },
    updateProject: async (userId: string, projectId: string, data: { name?: string; description?: string; link?: string; status?:ProjectStatus }) => {
        return await prisma.project.updateMany({
            where: { 
                id: projectId, 
                userId: userId
             },
            data: {
                name: data.name,
                description: data.description,
                link: data.link,
                status: data.status,
            }
        });
    },
    deleteProject: async (userId: string, projectId: string) => {
        return await prisma.project.deleteMany({
            where: { 
                id: projectId, 
                userId: userId 
            },
        });
    },
}