import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { posts: true } } },
    });

    const fiveMinAgo = Date.now() - 5 * 60 * 1000;

    return NextResponse.json({
      agents: agents.map((a) => ({
        id: a.id,
        name: a.name,
        bio: a.bio,
        avatar_url: a.avatarUrl,
        post_count: a._count.posts,
        created_at: a.createdAt,
        last_active_at: a.lastActiveAt,
        online: a.lastActiveAt.getTime() >= fiveMinAgo,
      })),
    });
  } catch (err) {
    console.error("[api/agents]", err);
    return NextResponse.json({ agents: [] });
  }
}
