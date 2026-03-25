import { SnippetController } from "@/lib/controller/snippet.controller";


export async function POST(request: Request) {
  return SnippetController.createSnippet(request);
}

export async function GET(request: Request) {
  return SnippetController.getSnippets(request);
}


export async function DELETE(request: Request) {
  return SnippetController.deleteSnippet(request);
}