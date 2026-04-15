import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  date: string;
}

export interface BlogPost extends BlogPostSummary {
  contentHtml: string;
}

function toDateString(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    const t = Date.parse(value);
    if (!Number.isNaN(t)) {
      return new Date(t).toISOString().slice(0, 10);
    }
    return value;
  }
  return "";
}

function parseTimestamp(dateStr: string): number {
  const t = Date.parse(dateStr);
  return Number.isNaN(t) ? 0 : t;
}

function resolvePostPath(slug: string): string | null {
  if (!slug || slug.includes("..") || slug.includes("/") || slug.includes("\\")) {
    return null;
  }
  const resolved = path.resolve(BLOG_DIR, `${slug}.md`);
  const root = path.resolve(BLOG_DIR);
  if (!resolved.startsWith(root + path.sep) && resolved !== root) {
    return null;
  }
  return resolved;
}

async function markdownToHtml(markdown: string): Promise<string> {
  const file = await remark().use(remarkHtml).process(markdown);
  return String(file);
}

export async function getAllPosts(): Promise<BlogPostSummary[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }

  const mdFiles = entries.filter((name) => name.endsWith(".md"));

  const posts = await Promise.all(
    mdFiles.map(async (filename) => {
      const slug = filename.replace(/\.md$/i, "");
      const filePath = path.join(BLOG_DIR, filename);
      const raw = await fs.readFile(filePath, "utf8");
      const { data } = matter(raw);

      return {
        slug,
        title: typeof data.title === "string" ? data.title : slug,
        description: typeof data.description === "string" ? data.description : "",
        date: toDateString(data.date),
      };
    }),
  );

  return posts.sort(
    (a, b) => parseTimestamp(b.date) - parseTimestamp(a.date),
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = resolvePostPath(slug);
  if (!filePath) {
    return null;
  }

  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  const contentHtml = await markdownToHtml(content);

  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: toDateString(data.date),
    contentHtml,
  };
}
