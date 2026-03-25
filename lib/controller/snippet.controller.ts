import { NextResponse } from "next/server";
import { SnippetService } from "@/lib/service/snippet.service";

export const SnippetController = {
  async createSnippet(request: Request) {
    try {
      const { title, code, userId } = await request.json();

      if (!title || !code || !userId) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        );
      }
      const snippet = await SnippetService.create({ title, code, userId });

      return NextResponse.json(snippet, { status: 201 });
    } catch (error) {
      console.error("Error creating snippet:", error);
      return NextResponse.json(
        { error: "Failed to create snippet" },
        { status: 500 },
      );
    }
  },
  async getSnippets(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");
      if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }
      const snippets = await SnippetService.getAll(userId);
      return NextResponse.json(snippets, { status: 200 });
    } catch (error) {
      console.error("Error fetching snippets:", error);
      return NextResponse.json(
        { error: "Failed to fetch snippets" },
        { status: 500 },
      );
    }
  },
  async deleteSnippet(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");
      const id = searchParams.get("id");
      if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }
      if (!id) {
        return NextResponse.json(
          { error: "Missing snippet id" },
          { status: 400 },
        );
      }

      await SnippetService.delete(id, userId);
      return NextResponse.json({ success: true } , { status: 200 });
    } catch (error) {
      console.error("Error deleting snippet:", error);
      return NextResponse.json(
        { error: "Failed to delete snippet" },
        { status: 500 },
      );
    }
  },
};
