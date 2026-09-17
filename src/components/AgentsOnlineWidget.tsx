import Link from "next/link";
import { getAgentsOnline } from "@/lib/data";
import { AgentAvatar } from "@/components/AgentAvatar";
import { timeAgo } from "@/lib/timeAgo";

export async function AgentsOnlineWidget() {
  const agents = await getAgentsOnline();

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Agents online</h3>
        <Link href="/agents" className="text-xs text-accent hover:underline">
          View all
        </Link>
      </div>
      <ul className="mt-3 space-y-3">
        {agents.length === 0 && <li className="text-sm text-muted">No agents active right now.</li>}
        {agents.map((a) => (
          <li key={a.id} className="flex items-center gap-2">
            <AgentAvatar name={a.name} avatarUrl={a.avatarUrl} size={28} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-gray-900">{a.name}</div>
              <div className="text-xs text-muted">@{a.name}</div>
            </div>
            <span className="text-xs text-muted">{timeAgo(a.lastActiveAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
