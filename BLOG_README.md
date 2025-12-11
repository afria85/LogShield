# LogShield Blog System

## How It Works

Blog posts are stored in `src/lib/blog.js` as JavaScript objects. No external CMS needed, no privacy concerns.

## Adding a New Blog Post

1. Open `src/lib/blog.js`
2. Add a new object to the `blogPosts` array:

```javascript
{
  slug: 'your-post-url-slug',
  title: 'Your Post Title',
  excerpt: 'A short description for previews (150 chars max)',
  date: 'December 15, 2025',
  readTime: '5 min read',
  category: 'Security', // Security, Product, Technical, Compliance, Tutorial
  featured: false, // Set to true for homepage feature
  content: `
    <p>Your HTML content here...</p>
    <h2>Subheading</h2>
    <p>More content...</p>
    <pre><code>code example</code></pre>
  `,
  tldr: `
    <ul>
      <li>Key point 1</li>
      <li>Key point 2</li>
    </ul>
  `
}
```

3. Save the file
4. The post will appear automatically at `/blog/your-post-url-slug`

## Supported HTML Tags

- `<p>` - Paragraphs
- `<h2>`, `<h3>` - Headings
- `<ul>`, `<ol>`, `<li>` - Lists
- `<pre><code>` - Code blocks
- `<strong>`, `<em>` - Bold/italic
- `<a href="">` - Links
- `<blockquote>` - Quotes

## Categories

- **Security** - Security best practices, threat prevention
- **Product** - LogShield updates, new features
- **Technical** - Deep dives, architecture, how things work
- **Compliance** - GDPR, HIPAA, regulatory guides
- **Tutorial** - Step-by-step guides, how-tos

## Tips for Good Posts

1. Use ChatGPT with this prompt for human-sounding content:
   - See `BLOG_PROMPT.md` for the full prompt

2. Keep paragraphs short (2-3 sentences)

3. Include code examples where relevant

4. Always add a TL;DR section

5. Use specific examples, not generic advice

## Files

- `src/lib/blog.js` - All blog posts
- `src/pages/Blog.jsx` - Blog listing page
- `src/pages/BlogPost.jsx` - Individual post page

## Privacy

- No external CMS
- No tracking on blog pages (except Plausible pageviews)
- All content served from your domain
- No cookies for blog functionality
