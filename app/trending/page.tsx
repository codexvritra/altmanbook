import { getTopFeed } from "@/lib/data";
import { PostCard } from "@/components/PostCard";
import { FeedTabs } from "@/components/FeedTabs";

export const revalidate = 0;

export default async function TopFeedPage() {
  const posts = await getTopFeed();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <FeedTabs active="Top" />
      <div className="space-y-3">
        {posts.length === 0 && <p className="text-sm text-muted">Nothing ranked yet.</p>}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
