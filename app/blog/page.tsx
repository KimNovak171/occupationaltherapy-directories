import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Occupational Therapy Resources & Articles",
  description:
    "Articles and resources about occupational therapy — conditions, what to expect, costs, telehealth, and how to choose a therapist.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Occupational Therapy Resources & Articles",
    url: "/blog",
    siteName: "OccupationalTherapyDirectories.com",
    type: "website",
  },
};

function formatPostDate(isoDate: string): string {
  if (!isoDate) return "";
  const t = Date.parse(isoDate);
  if (Number.isNaN(t)) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(t));
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-full bg-surface-muted">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-3 border-b-[3px] border-teal pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Blog
          </p>
          <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
            Occupational Therapy Resources &amp; Articles
          </h1>
          <p className="max-w-3xl text-sm text-slate-600">
            Practical guides on occupational therapy topics — for families,
            caregivers, and anyone exploring care options.
          </p>
        </header>

        <ul className="mt-10 space-y-4" aria-label="Blog articles">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="rounded-xl border border-teal/15 bg-surface p-5 shadow-sm transition hover:border-teal/30 sm:p-6">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted rounded-lg -m-1 p-1"
                >
                  <h2 className="text-lg font-semibold text-navy group-hover:text-teal transition-colors sm:text-xl">
                    {post.title}
                  </h2>
                  <time
                    className="mt-2 block text-xs font-medium text-slate-500"
                    dateTime={post.date || undefined}
                  >
                    {formatPostDate(post.date)}
                  </time>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {post.description}
                  </p>
                  <span className="mt-3 inline-flex text-xs font-semibold text-teal group-hover:text-teal-soft">
                    Read article →
                  </span>
                </Link>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-sm text-slate-600">
          <Link href="/" className="text-teal hover:text-teal-soft">
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
