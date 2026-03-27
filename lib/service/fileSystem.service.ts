import { ItemType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export const fileSystemService = {
  async getFolderContent(userId: string, parentId: string | null) {
    return await prisma.fileSystemItem.findMany({
      where: {
         userId: userId,
         parentId 
        },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
  },
  async createItem(userId: string, data: {name: string; type: ItemType; parentId: string | null; content?: string;}) {
    const existingItem = await prisma.fileSystemItem.findFirst({
      where: {
        name: data.name,
        parentId: data.parentId,
        userId: userId,
      },
    });
    if (existingItem) {
      throw new Error("Item with this name already exists in the parent folder");
    }

    return await prisma.fileSystemItem.create({
      data: {
        name: data.name,
        type: data.type,
        parentId: data.parentId,
        content: data.content || null,
        userId: userId,
      },
    });
  },
  async renameItem(userId: string, id: string, newName: string) {
    return await prisma.fileSystemItem.update({
      where: {
        id ,
        userId: userId
      },
      data: { name: newName },
    });
  },
    async deleteItem(userId: string, id: string) {
    return await prisma.fileSystemItem.delete({
      where: { id , userId: userId },    
    });
  },
  async moveItem(userId: string, id: string, newParentId: string | null) {
    return await prisma.fileSystemItem.update({
      where: { id , userId},
      data: { parentId: newParentId },
    });
  },
    async updateFileContent(userId: string, id: string, content: string) {
    return await prisma.fileSystemItem.update({
      where: { id , userId},
      data: { content },
    });
  }
};
