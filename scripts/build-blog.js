#!/usr/bin/env node

/**
 * LogShield Blog Builder
 * 
 * Usage: node scripts/build-blog.js
 * 
 * This script:
 * 1. Reads all .md files from docs/blog/posts/
 * 2. Converts them to HTML using the template
 * 3. Generates docs/blog/index.html with all posts
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../docs/blog/posts');
const BLOG_DIR = path.join(__dirname, '../docs/blog');
const TEMPLATE_PATH = path.join(BLOG_DIR, 'template.html');
const INDEX_TEMPLATE_PATH = path.join(BLOG_DIR, 'index-template.html');

// Normalize line endings (Windows -> Unix)
function normalizeLineEndings(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown;
  
  // Store code blocks temporarily to protect them from other processing
  const codeBlocks = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `<<<CODEBLOCK${codeBlocks.length}>>>`;
    codeBlocks.push(`<pre><code>${escapeHtml(code.trim())}</code></pre>`);
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
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  
  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  
  // Unordered lists - collect consecutive list items (but not inside placeholders)
  html = html.replace(/(^[\*\-] .+$\n?)+/gm, (match) => {
    // Skip if this looks like a placeholder
    if (match.includes('<<<CODEBLOCK') || match.includes('<<<INLINECODE')) {
      return match;
    }
    const items = match.trim().split('\n').map(line => {
      return '<li>' + line.replace(/^[\*\-] /, '') + '</li>';
    }).join('\n');
    return '<ul>\n' + items + '\n</ul>';
  });
  
  // Paragraphs - wrap text blocks that aren't already HTML
  const blocks = html.split('\n\n');
  html = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    
    // If block contains HTML tag at start, check if there's trailing text
    if (/^<(ul|ol|pre|blockquote)/.test(block)) {
      // Check if there's text after closing tag that needs wrapping
      block = block.replace(/(<\/(ul|ol)>)\n?(.+)$/s, (match, closeTag, tagName, text) => {
        text = text.trim();
        if (text) {
          // Don't wrap if it's already a block element
          if (/^<(h[1-6]|p|div|ul|ol|pre)/.test(text)) {
            return closeTag + '\n\n' + text;
          }
          return closeTag + '\n\n<p>' + text + '</p>';
        }
        return match;
      });
      return block;
    }
    
    // Check for placeholder blocks
    if (/^<<<CODEBLOCK\d+>>>$/.test(block) || /^<<<INLINECODE\d+>>>$/.test(block)) {
      return block;
    }
    
    // Already a block element
    if (/^<(h[1-6]|p|div|ul|ol|pre|blockquote)/.test(block)) return block;
    
    // Wrap in paragraph
    return `<p>${block.replace(/\n/g, ' ')}</p>`;
  }).join('\n\n');
  
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

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Parse frontmatter from markdown
function parseFrontmatter(content) {
  // Normalize line endings first
  content = normalizeLineEndings(content);
  
  // Match frontmatter between --- markers
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n*([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    console.log('  Warning: No frontmatter found');
    return { metadata: {}, content: content };
  }
  
  const frontmatterText = match[1];
  const body = match[2].trim();
  
  const metadata = {};
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
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
  if (isNaN(date.getTime())) {
    return dateStr; // Return as-is if invalid
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Build a single post
function buildPost(filename) {
  const filepath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filepath, 'utf-8');
  const { metadata, content } = parseFrontmatter(raw);
  
  if (!metadata.title) {
    console.log(`  Warning: No title in ${filename}`);
  }
  
  const slug = filename.replace('.md', '');
  const htmlContent = markdownToHtml(content);
  const readingTime = calculateReadingTime(content);
  
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  
  const html = template
    .replace(/\{\{title\}\}/g, metadata.title || 'Untitled')
    .replace(/\{\{description\}\}/g, metadata.description || '')
    .replace(/\{\{slug\}\}/g, slug)
    .replace(/\{\{date\}\}/g, formatDate(metadata.date || new Date().toISOString().split('T')[0]))
    .replace(/\{\{readingTime\}\}/g, readingTime)
    .replace(/\{\{content\}\}/g, htmlContent);
  
  const outputPath = path.join(BLOG_DIR, `${slug}.html`);
  fs.writeFileSync(outputPath, html, 'utf-8');
  
  console.log(`  OK ${filename} -> ${slug}.html`);
  
  return {
    slug,
    title: metadata.title || 'Untitled',
    description: metadata.description || '',
    date: metadata.date || new Date().toISOString().split('T')[0],
    readingTime
  };
}

// Build blog index
function buildIndex(posts) {
  const template = fs.readFileSync(INDEX_TEMPLATE_PATH, 'utf-8');
  
  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let postsHtml = '';
  
  if (posts.length === 0) {
    postsHtml = `
    <div class="empty-state">
      <p>No posts yet. Check back soon!</p>
    </div>`;
  } else {
    postsHtml = posts.map(post => `
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
    </a>`).join('\n');
  }
  
  const html = template.replace('{{posts}}', postsHtml);
  
  const outputPath = path.join(BLOG_DIR, 'index.html');
  fs.writeFileSync(outputPath, html, 'utf-8');
  
  console.log(`  OK index.html (${posts.length} posts)`);
}

// Main
function main() {
  console.log('\nBuilding LogShield Blog...\n');
  
  // Check if directories exist
  if (!fs.existsSync(BLOG_DIR)) {
    console.log('  Error: docs/blog/ directory not found');
    process.exit(1);
  }
  
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.log('  Error: template.html not found');
    process.exit(1);
  }
  
  if (!fs.existsSync(INDEX_TEMPLATE_PATH)) {
    console.log('  Error: index-template.html not found');
    process.exit(1);
  }
  
  // Create posts directory if needed
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    console.log('  Created docs/blog/posts/ directory');
  }
  
  // Get all markdown files
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  
  if (files.length === 0) {
    console.log('  No posts found in docs/blog/posts/');
    console.log('  Create a .md file to get started.\n');
    // Still build empty index
    buildIndex([]);
    return;
  }
  
  // Build each post
  const posts = [];
  for (const file of files) {
    try {
      const post = buildPost(file);
      posts.push(post);
    } catch (err) {
      console.log(`  Error building ${file}: ${err.message}`);
    }
  }
  
  // Build index
  buildIndex(posts);
  
  console.log('\nBlog built successfully!\n');
}

main();