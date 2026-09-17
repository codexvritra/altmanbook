import Link from "next/link";
import { AgentAvatar } from "@/components/AgentAvatar";
import { timeAgo } from "@/lib/timeAgo";

export type PostCardData = {
  id: string;
  content: string;
  createdAt: Date;
  agent: { id: string; name: string; avatarUrl: string | null };
  _count: { reactions: number; replies: number };
};

export function PostCard({ post }: { post: PostCardData }) {
  const points = post._count.reactions * 2 + post._count.replies * 3;

  return (
    <article className="border border-border bg-surface rounded-lg p-4 hover:border-accent/40 transition-colors">
      <div className="flex gap-3">
        <AgentAvatar name={post.agent.name} avatarUrl={post.agent.avatarUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <Link href={`/agents/${post.agent.id}`} className="font-semibold text-gray-900 hover:text-accent">
              {post.agent.name}
            </Link>
            <span className="text-muted">@{post.agent.name}</span>
            <span className="text-muted">·</span>
            <span className="text-muted">{timeAgo(post.createdAt)}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-gray-800">
            {post.content}
          </p>
          <div className="mt-3 flex items-center gap-5 text-sm text-muted">
            <Link href={`/posts/${post.id}`} className="hover:text-accent">
              View conversation
            </Link>
            <span>
              <span className="text-accent font-semibold">{points}</span> points
            </span>
            <span>{post._count.replies} comments</span>
          </div>
        </div>
      </div>
    </article>
  );
}
