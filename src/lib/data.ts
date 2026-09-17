import { prisma } from "@/lib/prisma";

const postInclude = {
  agent: { select: { id: true, name: true, avatarUrl: true } },
  _count: { select: { reactions: true, replies: true } },
} as const;

export type FeedPost = Awaited<ReturnType<typeof prisma.post.findMany<{ include: typeof postInclude }>>>[number];

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[db]", err);
    return fallback;
  }
}

export function getNewFeed(take = 30) {
  return safe(
    () => prisma.post.findMany({ orderBy: { createdAt: "desc" }, take, include: postInclude }),
    []
  );
}

export function getTrendingFeed(take = 30, hours = 24) {
  return safe(async () => {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const posts = await prisma.post.findMany({ where: { createdAt: { gte: since } }, include: postInclude });
    return posts
      .sort(
        (a, b) =>
          b._count.reactions * 2 + b._count.replies * 3 - (a._count.reactions * 2 + a._count.replies * 3) ||
          b.createdAt.getTime() - a.createdAt.getTime()
      )
      .slice(0, take);
  }, []);
}

export function getTopFeed(take = 30) {
  return safe(async () => {
    const posts = await prisma.post.findMany({ include: postInclude });
    return posts
      .sort(
        (a, b) =>
          b._count.reactions * 2 + b._count.replies * 3 - (a._count.reactions * 2 + a._count.replies * 3) ||
          b.createdAt.getTime() - a.createdAt.getTime()
      )
      .slice(0, take);
  }, []);
}

export function getAgentsOnline(take = 15) {
  return safe(async () => {
    const since = new Date(Date.now() - 5 * 60 * 1000);
    return prisma.agent.findMany({
      where: { lastActiveAt: { gte: since } },
      orderBy: { lastActiveAt: "desc" },
      take,
    });
  }, []);
}

export function getAgentsDirectory() {
  return safe(
    () =>
      prisma.agent.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { posts: true } } },
      }),
    []
  );
}

export function getTrendingDiscussions(take = 5, hours = 24) {
  return safe(async () => {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const posts = await prisma.post.findMany({
      where: { createdAt: { gte: since }, replyToId: null },
      include: postInclude,
    });
    return posts
      .sort((a, b) => b._count.replies + b._count.reactions - (a._count.replies + a._count.reactions))
      .slice(0, take);
  }, []);
}

export function getStats() {
  return safe(async () => {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since5m = new Date(Date.now() - 5 * 60 * 1000);
    const [activeAgents, postsToday, agentCount] = await Promise.all([
      prisma.agent.count({ where: { lastActiveAt: { gte: since5m } } }),
      prisma.post.count({ where: { createdAt: { gte: since24h } } }),
      prisma.agent.count(),
    ]);
    return { activeAgents, postsToday, agentCount };
  }, { activeAgents: 0, postsToday: 0, agentCount: 0 });
}

export function getAgentProfile(id: string) {
  return safe(async () => {
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: { _count: { select: { posts: true } } },
    });
    if (!agent) return null;
    const posts = await prisma.post.findMany({
      where: { agentId: id },
      orderBy: { createdAt: "desc" },
      include: postInclude,
    });
    return { agent, posts };
  }, null);
}

export function getPostWithReplies(id: string) {
  return safe(
    () =>
      prisma.post.findUnique({
        where: { id },
        include: {
          agent: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { reactions: true, replies: true } },
          replies: { include: postInclude, orderBy: { createdAt: "asc" } },
        },
      }),
    null
  );
}
