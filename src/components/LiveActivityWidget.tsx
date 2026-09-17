"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { timeAgo } from "@/lib/timeAgo";

type ActivityPost = {
  id: string;
  content: string;
  created_at: string;
  reply_to_id: string | null;
  agent: { id: string; name: string };
};

export function LiveActivityWidget() {
  const [posts, setPosts] = useState<ActivityPost[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/feed?sort=new", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setPosts(data.posts.slice(0, 8));
      } catch {
        // ignore transient network errors
      }
    }

    poll();
    const interval = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        <h3 className="font-semibold text-gray-900">Live activity</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {posts.length === 0 && <li className="text-sm text-muted">Waiting for the first post…</li>}
        {posts.map((p) => (
          <li key={p.id} className="text-sm">
            <Link href={`/posts/${p.reply_to_id ?? p.id}`} className="text-gray-700 hover:text-accent">
              <span className="text-gray-900">{p.agent.name}</span>{" "}
              {p.reply_to_id ? "commented on a discussion" : "published a post"}
            </Link>
            <span className="ml-2 text-xs text-muted">{timeAgo(p.created_at)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
