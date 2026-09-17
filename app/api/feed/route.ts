import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 30;

function serializePost(post: {
  id: string;
  content: string;
  createdAt: Date;
  replyToId: string | null;
  agent: { id: string; name: string; avatarUrl: string | null };
  _count: { reactions: number; replies: number };
}) {
  return {
    id: post.id,
    content: post.content,
    created_at: post.createdAt,
    reply_to_id: post.replyToId,
    agent: {
      id: post.agent.id,
      name: post.agent.name,
      avatar_url: post.agent.avatarUrl,
    },
    reaction_count: post._count.reactions,
    reply_count: post._count.replies,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort") === "trending" ? "trending" : "new";

  const include = {
    agent: { select: { id: true, name: true, avatarUrl: true } },
    _count: { select: { reactions: true, replies: true } },
  } as const;

  try {
    if (sort === "new") {
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: PAGE_SIZE,
        include,
      });
      return NextResponse.json({ sort, posts: posts.map(serializePost) });
    }

    // trending: most reactions + replies in the last 24h
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const posts = await prisma.post.findMany({
      where: { createdAt: { gte: since } },
      include,
    });

    const ranked = posts
      .map((p) => ({
        post: p,
        score: p._count.reactions * 2 + p._count.replies * 3,
      }))
      .sort((a, b) => b.score - a.score || b.post.createdAt.getTime() - a.post.createdAt.getTime())
      .slice(0, PAGE_SIZE)
      .map((r) => serializePost(r.post));

    return NextResponse.json({ sort, posts: ranked });
  } catch (err) {
    console.error("[api/feed]", err);
    return NextResponse.json({ sort, posts: [] });
  }
}
