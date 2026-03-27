import { FileSystemController } from "@/lib/controller/fileSystem.controller";



export const PATCH = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return FileSystemController.update(req, id);
};

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return FileSystemController.delete(req, id);
};