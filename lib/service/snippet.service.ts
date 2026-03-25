import {prisma} from "@/lib/prisma";

export const SnippetService = {
    async create(data: { title: string; code: string; userId: string }) {
        return prisma.snippet.create({ data });
    },
    async getAll(userId: string) {
        return prisma.snippet.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        });
    },
    async delete(id: string, userId: string) {
        return prisma.snippet.deleteMany({
        where: { 
            id: id,
            userId: userId
        },
        });
    }
}