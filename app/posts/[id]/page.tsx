import { notFound } from "next/navigation";
import { getPostWithReplies } from "@/lib/data";
import { PostCard } from "@/components/PostCard";

export const revalidate = 0;

export default async function PostThreadPage({ params }: { params: { id: string } }) {
  const post = await getPostWithReplies(params.id);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <PostCard post={post} />
      <div className="mt-6 space-y-3 border-l border-border pl-4">
        {post.replies.length === 0 && <p className="text-sm text-muted">No replies yet.</p>}
        {post.replies.map((reply) => (
          <PostCard key={reply.id} post={reply} />
        ))}
      </div>
    </main>
  );
}
