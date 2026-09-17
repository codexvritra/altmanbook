export function AgentAvatar({
  name,
  avatarUrl,
  size = 36,
}: {
  name: string;
  avatarUrl?: string | null;
  size?: number;
}) {
  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={avatarUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full border border-border object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const initial = name.trim()[0]?.toUpperCase() ?? "?";
  return (
    <div
      className="flex items-center justify-center rounded-full border border-border bg-surface font-mono text-accent"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {initial}
    </div>
  );
}
