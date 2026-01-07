#!/usr/bin/env node

/**
 * LogShield Blog Builder
 *
 * This script:
 * 1. Reads all .md files from content/blog/posts/
 * 2. Converts them to HTML using the template
 * 3. Generates docs/blog/index.html with all posts
 * 4. Updates docs/sitemap.xml with all blog posts (and core pages)
 *
 * Important:
 * - Source .md must NOT live under docs/ (docs is production output).
 */

const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "../content/blog/posts");
const BLOG_DIR = path.join(__dirname, "../docs/blog");
const DOCS_DIR = path.join(__dirname, "../docs");
const TEMPLATE_PATH = path.join(__dirname, "blog-templates", "template.html");
const INDEX_TEMPLATE_PATH = path.join(
  __dirname,
  "blog-templates",
  "index-template.html"
);

const SITE_BASE = "https://logshield.dev";

// Normalize line endings (Windows -> Unix)
function normalizeLineEndings(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Syntax highlighting for code blocks
function highlightCode(code, lang) {
  let escaped = escapeHtml(code);

  if (lang === "bash" || lang === "sh" || lang === "shell") {
    const lines = escaped.split("\n");
    escaped = lines
      .map((line) => {
        if (/^\s*#/.test(line)) {
          return line.replace(
            /^(\s*)(#.*)$/,
            '$1<span class="code-comment">$2</span>'
          );
        }

        line = line.replace(
          /\b(cat|npm|node|docker|logshield|git|curl|wget|echo|cd|ls|mkdir|rm|cp|mv|chmod|chown|sudo|apt|brew|pip|yarn|npx|kill|sleep|tee)\b/g,
          '<span class="code-cmd">$1</span>'
        );
        line = line.replace(
          /([ \t])(--?[\w-]+)/g,
          '$1<span class="code-flag">$2</span>'
        );
        line = line.replace(
          /([\w-]+\.(log|txt|json|yaml|yml|js|ts|sh|env))\b/g,
          '<span class="code-file">$1</span>'
        );
        line = line.replace(/(\|)/g, '<span class="code-pipe">$1</span>');
        line = line.replace(/(&gt;|&lt;)/g, '<span class="code-pipe">$1</span>');
        line = line.replace(
          /(2&gt;&amp;1)/g,
          '<span class="code-pipe">$1</span>'
        );

        return line;
      })
      .join("\n");
  } else if (lang === "yaml" || lang === "yml") {
    const lines = escaped.split("\n");
    escaped = lines
      .map((line) => {
        if (/^\s*#/.test(line)) {
          return line.replace(
            /^(\s*)(#.*)$/,
            '$1<span class="code-comment">$2</span>'
          );
        }

        line = line.replace(
          /^(\s*-?\s*)(name|uses|run|with|on|jobs|steps|if|env|needs|outputs|inputs|runs-on|strategy|matrix)(:)/gm,
          '$1<span class="code-keyword">$2</span>$3'
        );

        line = line.replace(
          /^(\s*)([\w-]+)(:)(?![^<]*<\/span>)/gm,
          '$1<span class="code-key">$2</span>$3'
        );

        line = line.replace(/:\s*(true|false)\s*$/g, ': <span class="code-bool">$1</span>');

        return line;
      })
      .join("\n");
  }

  return escaped;
}

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown;

  // Store code blocks temporarily to protect them from other processing
  const codeBlocks = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `<<<CODEBLOCK${codeBlocks.length}>>>`;
    const highlighted = highlightCode(code.trim(), lang);
    codeBlocks.push(`<pre><code>${highlighted}</code></pre>`);
    return placeholder;
  });

  // Inline code - also protect
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `<<<INLINECODE${inlineCodes.length}>>>`;
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
    return placeholder;
  });

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Links [text](url) - add rel for target=_blank
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  // Unordered lists - collect consecutive list items (but not inside placeholders)
  html = html.replace(/(^[\*\-] .+$\n?)+/gm, (match) => {
    if (match.includes("<<<CODEBLOCK") || match.includes("<<<INLINECODE")) {
      return match;
    }
    const items = match
      .trim()
      .split("\n")
      .map((line) => {
        return "<li>" + line.replace(/^[\*\-] /, "") + "</li>";
      })
      .join("\n");
    return "<ul>\n" + items + "\n</ul>";
  });

  // Paragraphs - wrap text blocks that aren't already HTML
  const blocks = html.split("\n\n");
  html = blocks
    .map((block) => {
      block = block.trim();
      if (!block) return "";

      if (/^<(ul|ol|pre|blockquote)/.test(block)) {
        block = block.replace(
          /(<\/(ul|ol)>)\n?(.+)$/s,
          (m, closeTag, _tagName, text) => {
            text = text.trim();
            if (text) {
              if (/^<(h[1-6]|p|div|ul|ol|pre)/.test(text)) {
                return closeTag + "\n\n" + text;
              }
              return closeTag + "\n\n<p>" + text + "</p>";
            }
            return m;
          }
        );
        return block;
      }

      if (
        /^<<<CODEBLOCK\d+>>>$/.test(block) ||
        /^<<<INLINECODE\d+>>>$/.test(block)
      ) {
        return block;
      }

      if (/^<(h[1-6]|p|div|ul|ol|pre|blockquote)/.test(block)) return block;

      return `<p>${block.replace(/\n/g, " ")}</p>`;
    })
    .join("\n\n");

  // Restore code blocks
  codeBlocks.forEach((code, i) => {
    html = html.replace(`<<<CODEBLOCK${i}>>>`, code);
  });

  // Restore inline codes
  inlineCodes.forEach((code, i) => {
    html = html.replace(`<<<INLINECODE${i}>>>`, code);
  });

  return html;
}

// Parse frontmatter from markdown
function parseFrontmatter(content) {
  content = normalizeLineEndings(content);

  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n*([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    console.log("  Warning: No frontmatter found");
    return { metadata: {}, content: content };
  }

  const frontmatterText = match[1];
  const body = match[2].trim();

  const metadata = {};
  frontmatterText.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line
        .substring(colonIndex + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      metadata[key] = value;
    }
  });

  return { metadata, content: body };
}

// Calculate reading time
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Format date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function toIsoDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return new Date().toISOString().split("T")[0];
  return date.toISOString().split("T")[0];
}

// Build a single post
function buildPost(filename) {
  const filepath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filepath, "utf-8");
  const { metadata, content } = parseFrontmatter(raw);

  if (!metadata.title) {
    throw new Error("Missing frontmatter: title");
  }

  const slug = metadata.slug || filename.replace(/\.md$/, "");
  const htmlContent = markdownToHtml(content);
  const readingTime = calculateReadingTime(content);

  const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

  const html = template
    .replace(/\{\{title\}\}/g, metadata.title || "Untitled")
    .replace(/\{\{description\}\}/g, metadata.description || "")
    .replace(/\{\{slug\}\}/g, slug)
    .replace(
      /\{\{date\}\}/g,
      formatDate(metadata.date || new Date().toISOString().split("T")[0])
    )
    .replace(/\{\{readingTime\}\}/g, readingTime)
    .replace(/\{\{content\}\}/g, htmlContent);

  const outputPath = path.join(BLOG_DIR, `${slug}.html`);
  fs.writeFileSync(outputPath, html, "utf-8");

  console.log(`  OK ${filename} -> ${slug}.html`);

  return {
    slug,
    title: metadata.title || "Untitled",
    description: metadata.description || "",
    date: toIsoDate(metadata.date || new Date().toISOString().split("T")[0]),
    readingTime,
  };
}

// Build blog index
function buildIndex(posts) {
  const template = fs.readFileSync(INDEX_TEMPLATE_PATH, "utf-8");

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  let postsHtml = "";

  if (posts.length === 0) {
    postsHtml = `
    <div class="empty-state">
      <p>No posts yet. Check back soon!</p>
    </div>`;
  } else {
    postsHtml = posts
      .map(
        (post) => `
    <a href="${post.slug}.html" class="post-card">
      <h2 class="post-title">${post.title}</h2>
      <p class="post-excerpt">${post.description}</p>
      <div class="post-meta">
        <span class="post-date">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          ${formatDate(post.date)}
        </span>
        <span class="post-reading-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${post.readingTime} min read
        </span>
      </div>
    </a>`
      )
      .join("\n");
  }

  const html = template.replace("{{posts}}", postsHtml);

  const outputPath = path.join(BLOG_DIR, "index.html");
  fs.writeFileSync(outputPath, html, "utf-8");

  console.log(`  OK index.html (${posts.length} posts)`);
}

// Update docs/sitemap.xml with core pages + posts
function buildSitemap(posts) {
  const today = new Date().toISOString().split("T")[0];

  const urls = [
    { loc: `${SITE_BASE}/`, lastmod: today },
    { loc: `${SITE_BASE}/docs.html`, lastmod: today },
    { loc: `${SITE_BASE}/blog/`, lastmod: today },
  ];

  for (const post of posts) {
    urls.push({
      loc: `${SITE_BASE}/blog/${post.slug}.html`,
      lastmod: post.date || today,
    });
  }

  // Deduplicate by loc
  const seen = new Set();
  const finalUrls = [];
  for (const u of urls) {
    if (seen.has(u.loc)) continue;
    seen.add(u.loc);
    finalUrls.push(u);
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    finalUrls
      .map((u) => {
        return (
          `  <url>\n` +
          `    <loc>${u.loc}</loc>\n` +
          `    <lastmod>${u.lastmod}</lastmod>\n` +
          `  </url>\n`
        );
      })
      .join("") +
    `</urlset>\n`;

  const out = path.join(DOCS_DIR, "sitemap.xml");
  fs.writeFileSync(out, xml, "utf-8");
  console.log(`  OK sitemap.xml (${finalUrls.length} urls)`);
}

// Main
function main() {
  console.log("\nBuilding LogShield Blog...\n");

  if (!fs.existsSync(BLOG_DIR)) {
    console.log("  Error: docs/blog/ directory not found");
    process.exit(1);
  }

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.log("  Error: template.html not found");
    process.exit(1);
  }

  if (!fs.existsSync(INDEX_TEMPLATE_PATH)) {
    console.log("  Error: index-template.html not found");
    process.exit(1);
  }

  // Ensure source dir exists (outside docs/)
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    console.log("  Created content/blog/posts/ directory");
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  if (files.length === 0) {
    console.log("  No posts found in content/blog/posts/");
    console.log("  Create a .md file to get started.\n");
    buildIndex([]);
    buildSitemap([]);
    return;
  }

  const posts = [];
  for (const file of files) {
    try {
      const post = buildPost(file);
      posts.push(post);
    } catch (err) {
      console.log(`  Error building ${file}: ${err.message}`);
    }
  }

  buildIndex(posts);
  buildSitemap(posts);

  console.log("\nBlog built successfully!\n");
}

main();
