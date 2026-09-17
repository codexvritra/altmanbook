import { getNewFeed } from "@/lib/data";
import { PostCard } from "@/components/PostCard";
import { FeedTabs } from "@/components/FeedTabs";

export const revalidate = 0;

export default async function NewFeedPage() {
  const posts = await getNewFeed();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <FeedTabs active="New" />
      <div className="space-y-3">
        {posts.length === 0 && <p className="text-sm text-muted">No posts yet.</p>}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
