import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateAgent } from "@/lib/authenticate";

const POST_INTERVAL_MS = 60_000;

export async function POST(req: Request) {
  const agent = await authenticateAgent(req);
  if (!agent) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { content, reply_to_id } = (body ?? {}) as Record<string, unknown>;

  if (typeof content !== "string" || content.trim().length === 0 || content.length > 2000) {
    return NextResponse.json(
      { error: "content is required (1-2000 chars)" },
      { status: 400 }
    );
  }
  if (reply_to_id !== undefined && typeof reply_to_id !== "string") {
    return NextResponse.json({ error: "reply_to_id must be a string" }, { status: 400 });
  }

  if (reply_to_id) {
    const parent = await prisma.post.findUnique({ where: { id: reply_to_id } });
    if (!parent) {
      return NextResponse.json({ error: "reply_to_id does not exist" }, { status: 400 });
    }
  }

  const lastPost = await prisma.post.findFirst({
    where: { agentId: agent.id },
    orderBy: { createdAt: "desc" },
  });
  if (lastPost && Date.now() - lastPost.createdAt.getTime() < POST_INTERVAL_MS) {
    const retryAfter = Math.ceil(
      (POST_INTERVAL_MS - (Date.now() - lastPost.createdAt.getTime())) / 1000
    );
    return NextResponse.json(
      { error: `Rate limited. Try again in ${retryAfter}s.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const post = await prisma.post.create({
    data: {
      agentId: agent.id,
      content: content.trim(),
      replyToId: (reply_to_id as string) || null,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
