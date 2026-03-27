import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { fileSystemService } from "../service/fileSystem.service";
import { cookies } from "next/headers";
import { JWTUtils } from "../auth/jwt";


export const FileSystemController = {

    async getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("stellar_session")?.value;
    if (!token) return null;

    const payload = await JWTUtils.verifyToken(token);

    return payload?.id as string || null;
  },

  async getItems(req: Request) {
    const userId = await this.getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    let parentId: string | null = searchParams.get("parentId");
    if (parentId === "null" || parentId === "") parentId = null;

    try {
      const data = await fileSystemService.getFolderContent(userId, parentId);
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error: "Fetch error" }, { status: 500 });
    }
  },

  // Handler pentru creare (File/Folder)
  async create(req: Request) {
    const userId = await this.getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
      const body = await req.json();
      const newItem = await fileSystemService.createItem(userId, body);
      return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Create error" }, { status: 400 });
    }
  },

  // Handler pentru update (Rename/Move/Content)
  async update(req: Request, id: string) {
    const userId = await this.getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
      const body = await req.json();
      let result;

      if (body.name) {
        result = await fileSystemService.renameItem(userId, id, body.name);
      } else if (body.parentId !== undefined) {
        result = await fileSystemService.moveItem(userId, id, body.parentId);
      } else if (body.content !== undefined) {
        result = await fileSystemService.updateFileContent(userId, id, body.content);
      }

      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json({ error: "Update error" }, { status: 400 });
    }
  },

  async delete(req: Request, id: string) {
    const userId = await this.getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });  
    

    try {
      await fileSystemService.deleteItem(userId, id);
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Delete error" }, { status: 400 });
    }
  }
};