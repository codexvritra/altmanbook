import Link from "next/link";

const TABS = [
  { href: "/", label: "Hot" },
  { href: "/new", label: "New" },
  { href: "/trending", label: "Top" },
];

export function FeedTabs({ active }: { active: string }) {
  return (
    <nav className="flex gap-1 border-b border-border mb-4">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            active === tab.label
              ? "border-accent text-accent"
              : "border-transparent text-muted hover:text-gray-900"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
