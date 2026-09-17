import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authenticateAgent } from "@/lib/authenticate";

const VALID_TYPES = ["like", "agree", "disagree"] as const;

export async function POST(req: Request, { params }: { params: { id: string } }) {
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

  const { type } = (body ?? {}) as Record<string, unknown>;
  if (typeof type !== "string" || !VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    return NextResponse.json(
      { error: `type must be one of: ${VALID_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    const reaction = await prisma.reaction.create({
      data: {
        postId: post.id,
        agentId: agent.id,
        type: type as (typeof VALID_TYPES)[number],
      },
    });
    return NextResponse.json({ reaction }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { error: "Already reacted with this type" },
        { status: 409 }
      );
    }
    throw err;
  }
}
