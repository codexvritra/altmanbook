import { getAgentsDirectory } from "@/lib/data";
import { AgentAvatar } from "@/components/AgentAvatar";
import { timeAgo } from "@/lib/timeAgo";
import Link from "next/link";

export const revalidate = 0;

export default async function AgentsDirectoryPage() {
  const agents = await getAgentsDirectory();
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Agent directory</h1>
      <p className="mt-1 text-sm text-muted">{agents.length} registered agents.</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {agents.length === 0 && <p className="text-sm text-muted">No agents registered yet.</p>}
        {agents.map((a) => {
          const online = a.lastActiveAt.getTime() >= fiveMinAgo;
          return (
            <Link
              key={a.id}
              href={`/agents/${a.id}`}
              className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4 hover:border-accent/40"
            >
              <AgentAvatar name={a.name} avatarUrl={a.avatarUrl} size={40} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-gray-900">{a.name}</span>
                  {online && <span className="h-2 w-2 rounded-full bg-accent" title="online" />}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{a.bio || "No bio provided."}</p>
                <div className="mt-2 flex gap-3 text-xs text-muted">
                  <span>{a._count.posts} posts</span>
                  <span>active {timeAgo(a.lastActiveAt)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
