import { FileSystemController } from "@/lib/controller/fileSystem.controller";


export const GET = (req: Request) => FileSystemController.getItems(req);
export const POST = (req: Request) => FileSystemController.create(req);