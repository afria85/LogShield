// src/lib/blog.js
// Blog posts database - add new posts here
// Privacy-first: No external CMS, all content stored locally

export const blogPosts = [
  {
    slug: 'secrets-leak-in-production-logs',
    title: '10 Common Ways Secrets Leak in Production Logs',
    excerpt: 'Developers accidentally leak secrets in logs more often than you think. Here are 10 real-world ways it happens — and how to prevent every single one.',
    date: 'December 10, 2025',
    readTime: '8 min read',
    category: 'Security',
    featured: true,
    content: `
      <p><em>By the LogShield Team (a.k.a. a bunch of developers who've leaked secrets enough times to learn better)</em></p>
      
      <p>If you've been a developer for more than… let's say <strong>14 minutes</strong>, you've probably leaked a secret somewhere. Maybe a stray API key in a debug log. Maybe an OAuth token printed because you forgot to redact it. Maybe (like me, once) you accidentally logged an entire request body containing a user's password because you were in a rush and thought, "It's fine, I'll remove this later."</p>
      
      <p>Spoiler: I did not remove it later.</p>
      
      <p>Secrets leaking into logs is one of those problems everyone thinks <em>they</em> would never cause — until they do. And the scary part? Logs quietly accumulate this stuff for months or even years. They live in AWS CloudWatch, Datadog, Kubernetes nodes, log-shipping pipelines, random S3 buckets… and sooner or later someone stumbles on something they really shouldn't.</p>
      
      <p>So let's talk about the <strong>10 most common ways secrets slip into production logs</strong>, and more importantly, how to stop them.</p>

      <h2>1. Logging Entire Request Bodies</h2>
      
      <p>I get it. You're debugging something weird, response isn't matching the payload, and in a moment of desperation you throw in:</p>
      
      <pre><code>console.log("Incoming request:", req.body);</code></pre>
      
      <p>It works! You fix the bug and forget about the log line.</p>
      
      <p>Three months later your logs contain:</p>
      <ul>
        <li>plaintext passwords</li>
        <li>OAuth tokens</li>
        <li>credit card fragments</li>
        <li>refresh tokens</li>
        <li>session cookies from mobile apps</li>
      </ul>
      
      <p>Basically: everything that will ruin your day.</p>
      
      <h3>Prevention</h3>
      
      <p>Redact inputs <em>before</em> logging them. Better yet — log only the fields you need.</p>
      
      <pre><code>console.log({
  email: req.body.email,
  action: "password_reset",
});</code></pre>
      
      <p>And if you must log the whole body while debugging locally, wrap it:</p>
      
      <pre><code>if (process.env.NODE_ENV !== "production") {
  console.log(req.body);
}</code></pre>
      
      <p>Trust me, future-you will be grateful.</p>

      <h2>2. Frameworks Logging Too Much by Default</h2>
      
      <p>Some frameworks — especially older ones — <em>love</em> being verbose. I once used a Python library (I won't name names but it rhymes with "Fla–sk") that logged <strong>Authorization headers</strong> in DEBUG mode.</p>
      
      <p>Another one logged the full request URL including <strong>query parameters</strong>, which often contain secrets like:</p>
      
      <pre><code>?api_key=12345
?token=abcdef
?redirect_uri=https://myapp.com/callback?code=secret</code></pre>
      
      <h3>Prevention</h3>
      
      <p>Turn off verbose logging in production:</p>
      
      <pre><code>app.logger.setLevel(logging.INFO)</code></pre>
      
      <p>Or use middleware to redact headers automatically.</p>

      <h2>3. Misconfigured Reverse Proxies</h2>
      
      <p>Ever seen a reverse proxy (like Nginx or Traefik) capture full request details out of the box?</p>
      
      <p>A surprising number of teams run proxies with logs like:</p>
      
      <pre><code>GET /login?username=john&password=hunter2</code></pre>
      
      <p>I once saw a production Nginx log that had Amazon-style URLs with <strong>temporary security tokens</strong> printed right into the access logs.</p>
      
      <h3>Prevention</h3>
      
      <p>Strip query parameters:</p>
      
      <pre><code>log_format main '$remote_addr - $request_method $uri $status';</code></pre>
      
      <p>Or disable query param logging entirely.</p>

      <h2>4. JWTs Everywhere</h2>
      
      <p>JWTs are like that one coworker everyone <em>likes</em> until they accidentally expose all your stuff.</p>
      
      <p>A typical JWT is ~1KB of base64-encoded user data containing:</p>
      <ul>
        <li>session identifiers</li>
        <li>email</li>
        <li>roles</li>
        <li>refresh token IDs</li>
        <li>sometimes full user profile data</li>
      </ul>
      
      <p>I've seen developers log JWTs because "I just wanted to check the expiration."</p>
      
      <h3>Prevention</h3>
      
      <p>If you absolutely must log tokens, log only the header:</p>
      
      <pre><code>const [header] = token.split(".");
console.log("JWT header:", header);</code></pre>
      
      <p>Never the payload. Definitely never the signature.</p>

      <h2>5. Unhandled Errors Printing Sensitive Data</h2>
      
      <p>This one is sneaky.</p>
      
      <p>Imagine your app fails while handling a login. The error handler logs:</p>
      
      <pre><code>console.error("Login error:", err);</code></pre>
      
      <p>If <code>err</code> contains the request payload or headers, congratulations — you've logged a password again.</p>
      
      <p>Even worse: some libraries throw errors that contain API keys inside the stack trace. (Looking at you, legacy AWS SDK.)</p>
      
      <h3>Prevention</h3>
      
      <p>Use structured error logging:</p>
      
      <pre><code>console.error({
  message: err.message,
  code: err.code,
});</code></pre>

      <h2>6. 3rd-Party SDKs Logging Keys in Debug Mode</h2>
      
      <p>Some SDKs behave like toddlers with crayons — they will draw everywhere unless explicitly told not to.</p>
      
      <p>I've seen:</p>
      <ul>
        <li>Stripe SDK printing full bearer tokens</li>
        <li>AWS SDK logging credentials with <code>AWS_ACCESS_KEY_ID=xxx</code></li>
        <li>Firebase SDK logging refresh tokens</li>
      </ul>
      
      <p>To be fair, they all warn you in the docs… which we all totally read, right?</p>
      
      <h3>Prevention</h3>
      
      <p>Disable debug logging:</p>
      
      <pre><code>export DEBUG=""</code></pre>
      
      <p>Or configure SDK log level:</p>
      
      <pre><code>firebase.auth().setLogLevel("silent");</code></pre>

      <h2>7. Accidentally Logging Environment Variables</h2>
      
      <p>I wish this one wasn't real, but I've seen it too many times.</p>
      
      <p>Someone tries to debug a deployment:</p>
      
      <pre><code>echo $ENV_VARS</code></pre>
      
      <p>And that includes:</p>
      <ul>
        <li>DB passwords</li>
        <li>JWT signing keys</li>
        <li>API secrets</li>
        <li>S3 credentials</li>
      </ul>
      
      <p>These get captured in CI/CD logs, container logs, and Slack bots automatically streaming build logs.</p>
      
      <h3>Prevention</h3>
      
      <p>Never dump all env vars. If you must inspect something:</p>
      
      <pre><code>echo $NODE_ENV
echo $APP_VERSION</code></pre>

      <h2>8. User Input Being Logged as-is</h2>
      
      <p>Here's a fun thought: If your logs contain user input, your users can <em>inject secrets into them</em>.</p>
      
      <p>Imagine:</p>
      
      <pre><code>User submitted password: mysecret123</code></pre>
      
      <p>If your logging system stores this forever, that's a problem.</p>
      
      <h3>Prevention</h3>
      
      <p>Apply sanitization before logging any user-controlled fields.</p>

      <h2>9. Verbose SQL Logs Showing Parameters</h2>
      
      <p>ORMs can log SQL queries including the parameters:</p>
      
      <pre><code>INSERT INTO users (email, password)
VALUES ('john@example.com', 'plaintextpassword123')</code></pre>
      
      <p>Yep. That's a real thing some ORMs do if debugging is enabled.</p>
      
      <h3>Prevention</h3>
      
      <p>Disable SQL logging in production:</p>
      
      <pre><code>sequelize.logging = false</code></pre>
      
      <p>Or use parameter redaction.</p>

      <h2>10. Mobile Apps Sending Debug Logs to Your Server</h2>
      
      <p>This one surprised me the first time I saw it.</p>
      
      <p>Mobile devs often add a "Send crash logs" feature. Users click it. Suddenly you receive logs from their device that may include:</p>
      <ul>
        <li>tokens</li>
        <li>emails</li>
        <li>addresses</li>
        <li>full API responses</li>
      </ul>
      
      <p>And because it's user-initiated, you can't predict what ends up in your backend.</p>
      
      <h3>Prevention</h3>
      
      <p>Run all incoming user-submitted logs through sanitizers (like LogShield 😌).</p>

      <h2>So… What Do We Do About All This?</h2>
      
      <p>Developers already have too many things to worry about. Relying on memory ("I'll remember to redact that later") is not a real strategy.</p>
      
      <p>Here's what actually works:</p>
      
      <p><strong>✔️ Treat logs as hostile input</strong><br/>Assume they contain secrets unless proven otherwise.</p>
      
      <p><strong>✔️ Use a sanitizer before storage</strong><br/>Something client-side, deterministic, zero-trust (yes, that's why we built LogShield).</p>
      
      <p><strong>✔️ Redact aggressively</strong><br/>It's better to remove too much than too little.</p>
      
      <p><strong>✔️ Make secure logging the default</strong><br/>Not an afterthought.</p>
      
      <p>And for the love of your future self… <strong>don't log the entire request body</strong>.</p>
    `,
    tldr: `
      <ul>
        <li>Logs leak secrets in sneaky ways: request bodies, JWTs, query params, error stacks, SQL logs, proxies, mobile apps, you name it.</li>
        <li>Most leaks come from small debugging choices developers forget about.</li>
        <li>Use structured logs, sanitize inputs, disable debug logging in production, and redact tokens everywhere.</li>
        <li>Treat logs like they're public. Because someday… they might be.</li>
      </ul>
    `
  },
  {
    slug: 'introducing-logshield-3',
    title: 'LogShield 3.0: AI-Powered Entropy Detection',
    excerpt: "We're excited to announce LogShield 3.0 with AI-powered entropy detection that catches secrets regex can't find.",
    date: 'December 8, 2025',
    readTime: '4 min read',
    category: 'Product',
    featured: false,
    content: `
      <p>Today we're releasing LogShield 3.0, and it's our biggest update yet.</p>
      
      <p>The headline feature: <strong>AI-powered entropy detection</strong>. It sounds fancy, but here's what it actually means for you — LogShield can now catch secrets that don't match any known pattern.</p>
      
      <h2>The Problem with Pattern Matching</h2>
      
      <p>Traditional secret scanners (including LogShield 2.x) work by matching known patterns. AWS keys start with <code>AKIA</code>. GitHub tokens start with <code>ghp_</code>. Stripe keys start with <code>sk_live_</code>.</p>
      
      <p>But what about:</p>
      <ul>
        <li>Custom API keys your company generates?</li>
        <li>Internal tokens with no standard format?</li>
        <li>Random strings that are actually secrets?</li>
      </ul>
      
      <p>Pattern matching can't catch these. But entropy detection can.</p>
      
      <h2>What is Entropy Detection?</h2>
      
      <p>In information theory, <strong>entropy</strong> measures randomness. A string like <code>password123</code> has low entropy — it's predictable. A string like <code>a8Kj2mX9pL4qR7nT</code> has high entropy — it looks random.</p>
      
      <p>Secrets are almost always high-entropy strings. They're designed to be hard to guess.</p>
      
      <p>LogShield 3.0 scans your logs for strings that:</p>
      <ul>
        <li>Are 16+ characters long</li>
        <li>Have high entropy (randomness)</li>
        <li>Look like they could be secrets</li>
      </ul>
      
      <p>And it flags them for review — even if they don't match any known pattern.</p>
      
      <h2>How It Works (Technically)</h2>
      
      <p>We calculate Shannon entropy for each candidate string:</p>
      
      <pre><code>H = -Σ p(x) * log2(p(x))</code></pre>
      
      <p>Where <code>p(x)</code> is the probability of each character. Higher entropy = more random = more likely to be a secret.</p>
      
      <p>We also check:</p>
      <ul>
        <li>Character distribution (mix of letters, numbers, symbols)</li>
        <li>Length (most secrets are 16-64 chars)</li>
        <li>Context (is it in a config? A URL? A JSON key?)</li>
      </ul>
      
      <p>All of this runs <strong>100% client-side</strong>. Your logs never leave your browser.</p>
      
      <h2>Real-World Example</h2>
      
      <p>Here's a log line from a real (anonymized) incident:</p>
      
      <pre><code>Config loaded: db_token=f7Gk2mPq9xL4nR8tY5vW3jH6</code></pre>
      
      <p>This doesn't match any known pattern. But LogShield 3.0 flags it because:</p>
      <ul>
        <li>It's 24 characters</li>
        <li>Entropy score: 4.7 (high)</li>
        <li>Context: appears after <code>token=</code></li>
      </ul>
      
      <p>Result: <code>[HIGH_ENTROPY_REDACTED]</code></p>
      
      <h2>Available Now</h2>
      
      <p>Entropy detection is available on Pro and Team plans. Free users still get our 10 basic patterns — which catch the most common secrets.</p>
      
      <p><a href="/app">Try it now →</a></p>
    `,
    tldr: `
      <ul>
        <li>LogShield 3.0 adds AI-powered entropy detection</li>
        <li>Catches secrets that don't match any known pattern</li>
        <li>100% client-side, privacy preserved</li>
        <li>Available on Pro and Team plans</li>
      </ul>
    `
  },
  {
    slug: 'client-side-architecture',
    title: 'Building a Zero-Trust Log Sanitizer',
    excerpt: "Technical deep-dive into how we process sensitive data entirely in your browser without any server communication.",
    date: 'November 28, 2025',
    readTime: '12 min read',
    category: 'Technical',
    featured: false,
    content: `
      <p>When we started building LogShield, we had one non-negotiable requirement: <strong>user logs must never touch our servers</strong>.</p>
      
      <p>This isn't just a privacy feature — it's the foundation of our entire architecture. Here's how we built a zero-trust log sanitizer that processes everything client-side.</p>
      
      <h2>Why Client-Side?</h2>
      
      <p>Most log sanitizers work by sending your logs to a server, processing them, and returning the result. This creates several problems:</p>
      
      <ul>
        <li><strong>Trust:</strong> You're trusting a third party with your most sensitive data</li>
        <li><strong>Compliance:</strong> Data leaving your environment may violate GDPR, HIPAA, etc.</li>
        <li><strong>Latency:</strong> Network round-trips slow everything down</li>
        <li><strong>Cost:</strong> Server processing at scale is expensive</li>
      </ul>
      
      <p>Client-side processing eliminates all of these. Your browser does the work. We never see your data.</p>
      
      <h2>The Architecture</h2>
      
      <p>LogShield's core is a JavaScript engine that runs entirely in your browser:</p>
      
      <pre><code>┌─────────────────────────────────────┐
│           Your Browser              │
│  ┌─────────────────────────────┐   │
│  │      LogShield Engine       │   │
│  │  ┌─────────────────────┐   │   │
│  │  │   Pattern Matcher   │   │   │
│  │  │   Entropy Detector  │   │   │
│  │  │   Output Generator  │   │   │
│  │  └─────────────────────┘   │   │
│  └─────────────────────────────┘   │
│              ↓                      │
│     Sanitized Output (local)        │
└─────────────────────────────────────┘
          ✗ No server communication</code></pre>
      
      <h2>Pattern Matching Engine</h2>
      
      <p>Our pattern matcher uses optimized regular expressions. But regex can be slow — especially with 70+ patterns and large files.</p>
      
      <p>We optimize by:</p>
      <ul>
        <li><strong>Pre-compiling patterns</strong> — regex objects are created once, reused many times</li>
        <li><strong>Early termination</strong> — stop checking a pattern after N matches</li>
        <li><strong>Chunked processing</strong> — split large files into smaller pieces</li>
      </ul>
      
      <pre><code>// Pre-compile for performance
const compiledPatterns = patterns.map(p => ({
  ...p,
  regex: new RegExp(p.pattern.source, p.pattern.flags)
}));</code></pre>
      
      <h2>Entropy Detection</h2>
      
      <p>For AI-powered detection, we calculate Shannon entropy:</p>
      
      <pre><code>function calculateEntropy(str) {
  const len = str.length;
  const frequencies = {};
  
  for (let char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  
  let entropy = 0;
  for (let char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  
  return entropy;
}</code></pre>
      
      <p>Strings with entropy above ~4.5 are flagged as potential secrets.</p>
      
      <h2>Performance</h2>
      
      <p>Processing 10KB of logs takes ~20ms on modern browsers. For larger files, we use <code>requestAnimationFrame</code> to keep the UI responsive:</p>
      
      <pre><code>function processInChunks(text, chunkSize = 50000) {
  const chunks = splitIntoChunks(text, chunkSize);
  let result = '';
  
  function processNext(index) {
    if (index >= chunks.length) {
      onComplete(result);
      return;
    }
    
    result += sanitize(chunks[index]);
    requestAnimationFrame(() => processNext(index + 1));
  }
  
  processNext(0);
}</code></pre>
      
      <h2>Security Considerations</h2>
      
      <p>Even though we're client-side, we still think about security:</p>
      
      <ul>
        <li><strong>No eval()</strong> — we never execute user input as code</li>
        <li><strong>Regex DoS protection</strong> — patterns are tested for catastrophic backtracking</li>
        <li><strong>Memory limits</strong> — we cap input size to prevent browser crashes</li>
        <li><strong>CSP headers</strong> — strict Content Security Policy on our domain</li>
      </ul>
      
      <h2>The Result</h2>
      
      <p>A sanitizer that:</p>
      <ul>
        <li>Processes everything locally</li>
        <li>Never sends data anywhere</li>
        <li>Works offline</li>
        <li>Is verifiable (open source)</li>
      </ul>
      
      <p>This is what zero-trust actually means. Not just "we promise not to look" — but "we literally can't look."</p>
    `,
    tldr: `
      <ul>
        <li>LogShield processes everything in your browser — no server communication</li>
        <li>Pattern matching uses pre-compiled regex with optimizations</li>
        <li>Entropy detection calculates Shannon entropy client-side</li>
        <li>Zero-trust means we literally cannot see your data</li>
      </ul>
    `
  },
  {
    slug: 'gdpr-log-compliance',
    title: 'GDPR Compliance for Application Logs',
    excerpt: 'A practical guide to ensuring your logging practices comply with GDPR and other privacy regulations.',
    date: 'November 20, 2025',
    readTime: '10 min read',
    category: 'Compliance',
    featured: false,
    content: `
      <p>GDPR has been in effect since 2018, but many teams still aren't sure how it applies to application logs.</p>
      
      <p>Here's the thing: <strong>logs often contain personal data</strong>. IP addresses, email addresses, user IDs, session tokens — all of this falls under GDPR's definition of "personal data."</p>
      
      <p>Let's break down what you actually need to do.</p>
      
      <h2>What GDPR Says About Logs</h2>
      
      <p>GDPR doesn't mention "logs" specifically, but several articles apply:</p>
      
      <ul>
        <li><strong>Article 5</strong> — Data minimization: only collect what you need</li>
        <li><strong>Article 17</strong> — Right to erasure: users can request deletion</li>
        <li><strong>Article 25</strong> — Privacy by design: build privacy into systems</li>
        <li><strong>Article 32</strong> — Security: protect personal data appropriately</li>
      </ul>
      
      <h2>The Problem with Traditional Logging</h2>
      
      <p>Most logging practices violate at least one of these:</p>
      
      <pre><code>// Violates data minimization
logger.info("User login", { user: fullUserObject });

// Makes right-to-erasure impossible
logger.debug("Request:", req);

// No privacy by design
app.use(morgan('combined')); // logs IP + user agent</code></pre>
      
      <h2>Practical Steps for Compliance</h2>
      
      <h3>1. Audit Your Current Logs</h3>
      
      <p>Before fixing anything, understand what you're logging. Search for:</p>
      <ul>
        <li>Email patterns</li>
        <li>IP addresses</li>
        <li>User IDs</li>
        <li>Session tokens</li>
        <li>Request bodies</li>
      </ul>
      
      <h3>2. Implement Log Sanitization</h3>
      
      <p>Redact personal data before it reaches storage:</p>
      
      <pre><code>function sanitizeForLogging(data) {
  return {
    ...data,
    email: data.email ? '[REDACTED]' : undefined,
    ip: data.ip ? hashIP(data.ip) : undefined,
    // Keep non-personal fields
    action: data.action,
    timestamp: data.timestamp,
  };
}</code></pre>
      
      <h3>3. Set Retention Policies</h3>
      
      <p>Logs shouldn't live forever. Set retention based on purpose:</p>
      <ul>
        <li>Security logs: 90 days (or as required by law)</li>
        <li>Debug logs: 7-30 days</li>
        <li>Analytics: aggregate only, no personal data</li>
      </ul>
      
      <h3>4. Document Your Practices</h3>
      
      <p>GDPR requires documentation. Create a logging policy that covers:</p>
      <ul>
        <li>What you log and why</li>
        <li>How long you keep it</li>
        <li>Who has access</li>
        <li>How you handle deletion requests</li>
      </ul>
      
      <h2>Tools That Help</h2>
      
      <p>You don't have to do this manually:</p>
      <ul>
        <li><strong>LogShield</strong> — Sanitize logs before sharing or storage</li>
        <li><strong>Vector</strong> — Log pipeline with transformation support</li>
        <li><strong>Fluentd</strong> — Can filter/redact during ingestion</li>
      </ul>
      
      <h2>Common Misconceptions</h2>
      
      <p><strong>"IP addresses aren't personal data"</strong> — Wrong. The GDPR explicitly includes IP addresses.</p>
      
      <p><strong>"We need logs for security"</strong> — True, but you can hash/pseudonymize. You don't need plaintext emails for security monitoring.</p>
      
      <p><strong>"Our logs are internal only"</strong> — Doesn't matter. GDPR applies to how you process data, not just how you share it.</p>
      
      <h2>Quick Checklist</h2>
      
      <p>✅ Audit existing logs for personal data<br/>
      ✅ Implement sanitization at log creation<br/>
      ✅ Set retention policies<br/>
      ✅ Document your logging practices<br/>
      ✅ Train your team on compliant logging<br/>
      ✅ Test your right-to-erasure process</p>
    `,
    tldr: `
      <ul>
        <li>Logs often contain personal data (IPs, emails, tokens)</li>
        <li>GDPR requires data minimization, retention limits, and erasure capability</li>
        <li>Sanitize personal data before logging, not after</li>
        <li>Document your practices and set clear retention policies</li>
      </ul>
    `
  },
  {
    slug: 'aws-credentials-guide',
    title: 'Complete Guide to AWS Credentials in Logs',
    excerpt: 'How to identify, prevent, and remediate AWS credential exposure in your application logs.',
    date: 'November 15, 2025',
    readTime: '7 min read',
    category: 'Tutorial',
    featured: false,
    content: `
      <p>AWS credentials are among the most commonly leaked secrets. Here's everything you need to know about keeping them out of your logs.</p>
      
      <h2>Types of AWS Credentials</h2>
      
      <h3>Access Keys</h3>
      <p>Format: <code>AKIA</code> + 16 alphanumeric characters</p>
      <pre><code>AKIAIOSFODNN7EXAMPLE</code></pre>
      
      <h3>Secret Keys</h3>
      <p>Format: 40 characters, base64-ish</p>
      <pre><code>wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY</code></pre>
      
      <h3>Session Tokens</h3>
      <p>Format: Long base64 string (hundreds of characters)</p>
      <pre><code>IQoJb3JpZ2luX2VjEO...very long...</code></pre>
      
      <h2>How They End Up in Logs</h2>
      
      <h3>1. SDK Debug Mode</h3>
      <pre><code>AWS_SDK_LOAD_CONFIG=1 DEBUG=aws* node app.js
// Logs: AccessKeyId=AKIA...</code></pre>
      
      <h3>2. Error Stack Traces</h3>
      <pre><code>Error: Access Denied for AKIAIOSFODNN7EXAMPLE
    at Request.send...</code></pre>
      
      <h3>3. Environment Variable Dumps</h3>
      <pre><code>console.log(process.env);
// Logs everything including AWS_SECRET_ACCESS_KEY</code></pre>
      
      <h3>4. Request Signing Debug</h3>
      <pre><code>// AWS SDK v2 with debug logging
AWS.config.logger = console;</code></pre>
      
      <h2>Detection Patterns</h2>
      
      <p>LogShield detects AWS credentials with these patterns:</p>
      
      <pre><code>// Access Key
/AKIA[0-9A-Z]{16}/

// Secret Key (harder - looks for 40-char base64)
/(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/</code></pre>
      
      <h2>Prevention Best Practices</h2>
      
      <h3>1. Use IAM Roles, Not Keys</h3>
      <p>On EC2/ECS/Lambda, use IAM roles. No keys to leak.</p>
      
      <h3>2. Never Log the SDK Config</h3>
      <pre><code>// BAD
console.log(AWS.config);

// GOOD
console.log({ region: AWS.config.region });</code></pre>
      
      <h3>3. Disable SDK Debug Logging</h3>
      <pre><code>// AWS SDK v3
const client = new S3Client({
  logger: undefined, // Explicitly disable
});</code></pre>
      
      <h3>4. Use Secrets Manager</h3>
      <p>Don't put credentials in environment variables. Fetch from Secrets Manager at runtime.</p>
      
      <h2>If You've Already Leaked</h2>
      
      <ol>
        <li><strong>Rotate immediately</strong> — Go to IAM console, deactivate the key, create new one</li>
        <li><strong>Check CloudTrail</strong> — See if the key was used</li>
        <li><strong>Purge logs</strong> — Delete logs containing the credential</li>
        <li><strong>Scan for exposure</strong> — Check if it reached GitHub, S3, etc.</li>
      </ol>
      
      <p>AWS also has automated detection — they'll email you if they find your keys on GitHub.</p>
    `,
    tldr: `
      <ul>
        <li>AWS credentials come in three types: access keys, secret keys, session tokens</li>
        <li>They leak through SDK debug mode, error stacks, and env dumps</li>
        <li>Use IAM roles instead of keys when possible</li>
        <li>If leaked: rotate immediately, check CloudTrail, purge logs</li>
      </ul>
    `
  }
];

// Get all posts (for listing)
export function getAllPosts() {
  return blogPosts.map(post => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    readTime: post.readTime,
    category: post.category,
    featured: post.featured
  }));
}

// Get single post by slug
export function getBlogPost(slug) {
  return blogPosts.find(post => post.slug === slug) || null;
}

// Get featured posts
export function getFeaturedPosts() {
  return blogPosts.filter(post => post.featured);
}

// Get posts by category
export function getPostsByCategory(category) {
  if (category === 'All') return getAllPosts();
  return blogPosts.filter(post => post.category === category);
}

// Get all categories
export function getCategories() {
  const categories = [...new Set(blogPosts.map(post => post.category))];
  return ['All', ...categories];
}
