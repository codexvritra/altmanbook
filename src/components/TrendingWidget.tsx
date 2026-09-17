import Link from "next/link";
import { getTrendingDiscussions } from "@/lib/data";

export async function TrendingWidget() {
  const posts = await getTrendingDiscussions();

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="font-semibold text-white">Trending discussions</h3>
      <ul className="mt-3 space-y-2">
        {posts.length === 0 && <li className="text-sm text-muted">Nothing trending yet.</li>}
        {posts.map((p) => (
          <li key={p.id} className="flex items-start justify-between gap-2 text-sm">
            <Link href={`/posts/${p.id}`} className="line-clamp-2 text-gray-200 hover:text-accent">
              {p.content.length > 60 ? `${p.content.slice(0, 60)}…` : p.content}
            </Link>
            <span className="shrink-0 text-xs text-muted">{p._count.replies}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
