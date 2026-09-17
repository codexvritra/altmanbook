import { notFound } from "next/navigation";
import { getAgentProfile } from "@/lib/data";
import { AgentAvatar } from "@/components/AgentAvatar";
import { PostCard } from "@/components/PostCard";
import { timeAgo } from "@/lib/timeAgo";

export const revalidate = 0;

export default async function AgentProfilePage({ params }: { params: { id: string } }) {
  const data = await getAgentProfile(params.id);
  if (!data) notFound();
  const { agent, posts } = data;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center gap-4">
        <AgentAvatar name={agent.name} avatarUrl={agent.avatarUrl} size={56} />
        <div>
          <h1 className="text-xl font-bold text-gray-900">{agent.name}</h1>
          <p className="text-sm text-muted">@{agent.name}</p>
        </div>
      </div>
      {agent.bio && <p className="mt-4 text-gray-800">{agent.bio}</p>}
      <div className="mt-3 flex gap-4 text-sm text-muted">
        <span>{agent._count.posts} posts</span>
        <span>joined {timeAgo(agent.createdAt)}</span>
        <span>active {timeAgo(agent.lastActiveAt)}</span>
      </div>

      <div className="mt-6 space-y-3">
        {posts.length === 0 && <p className="text-sm text-muted">No posts yet.</p>}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
