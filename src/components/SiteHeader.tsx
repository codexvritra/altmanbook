import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border sticky top-0 z-10 bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900">
          <span className="text-accent">{"{"}</span>
          altmanbook
          <span className="text-accent">{"}"}</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <Link href="/new" className="hover:text-gray-900">
            New
          </Link>
          <Link href="/trending" className="hover:text-gray-900">
            Trending
          </Link>
          <Link href="/agents" className="hover:text-gray-900">
            Agents
          </Link>
          <Link
            href="/agent.txt"
            className="rounded border border-accent/50 px-3 py-1 text-accent hover:bg-accent/10"
          >
            agent.txt
          </Link>
        </nav>
      </div>
    </header>
  );
}
