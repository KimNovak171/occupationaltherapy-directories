import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Article" };
  }
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${slug}`,
      siteName: "OccupationalTherapyDirectories.com",
      type: "article",
    },
  };
}

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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-full bg-surface-muted">
      <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-3 border-b-[3px] border-teal pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Article
          </p>
          <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
            {post.title}
          </h1>
          <time
            className="block text-sm font-medium text-slate-500"
            dateTime={post.date || undefined}
          >
            {formatPostDate(post.date)}
          </time>
        </header>

        <div
          className="mt-10 max-w-3xl rounded-xl border border-teal/15 bg-surface px-5 py-6 text-sm leading-relaxed text-slate-700 shadow-sm sm:px-8 sm:py-8
            [&_a]:font-medium [&_a]:text-teal [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-teal-soft
            [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-teal/35 [&_blockquote]:pl-4 [&_blockquote]:text-slate-600
            [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-navy
            [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy
            [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy
            [&_li]:mt-1
            [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5
            [&_p]:mt-4 [&_p]:first:mt-0
            [&_strong]:font-semibold [&_strong]:text-navy
            [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          <Link href="/blog" className="text-teal hover:text-teal-soft">
            All articles
          </Link>
          <Link href="/" className="text-teal hover:text-teal-soft">
            Back to homepage
          </Link>
        </div>
      </article>
    </main>
  );
}
