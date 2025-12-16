import { useEffect, useState } from "react";
import { sanitizeLog, SanitizeMatch } from "./engine/sanitize";

type RuleStat = {
  rule: string;
  count: number;
};

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [strict, setStrict] = useState(false);
  const [showHighlight, setShowHighlight] = useState(true);
  const [matches, setMatches] = useState<SanitizeMatch[]>([]);
  const [stats, setStats] = useState<RuleStat[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        const result = sanitizeLog(input, { strict });
        setOutput(result.output);
        setMatches(result.matches);

        const map = new Map<string, number>();
        for (const m of result.matches) {
          map.set(m.rule, (map.get(m.rule) ?? 0) + 1);
        }

        setStats(
          Array.from(map.entries()).map(([rule, count]) => ({
            rule,
            count,
          }))
        );
      } catch (e: any) {
        setOutput(e.message);
        setMatches([]);
        setStats([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [input, strict]);

  function renderOutput() {
    if (!showHighlight || matches.length === 0) return output;

    let highlighted = output;

    [...matches]
      .sort((a, b) => b.index - a.index)
      .forEach((m) => {
        highlighted =
          highlighted.slice(0, m.index) +
          `<mark class="ls-highlight">${highlighted.slice(
            m.index,
            m.index + m.length
          )}</mark>` +
          highlighted.slice(m.index + m.length);
      });

    return highlighted;
  }

  return (
    <div className="ls-root">
      <header className="ls-header">
        <h1>LogShield</h1>
        <p>Paste your logs. Ship without leaking secrets.</p>
      </header>

      <div className="ls-controls">
        <label>
          <input
            type="checkbox"
            checked={strict}
            onChange={(e) => setStrict(e.target.checked)}
          />
          <strong> Strict mode</strong>
          <span className="ls-hint">
            &nbsp;(redacts all credentials)
          </span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={showHighlight}
            onChange={(e) => setShowHighlight(e.target.checked)}
          />
          Show highlights
        </label>

        <button
          onClick={() => navigator.clipboard.writeText(output)}
          disabled={!output}
        >
          Copy output
        </button>
      </div>

      {stats.length > 0 && (
        <section className="ls-stats">
          <strong>Redacted:</strong>
          <ul>
            {stats.map((s) => (
              <li key={s.rule}>
                {s.rule} ? {s.count}
              </li>
            ))}
          </ul>
        </section>
      )}

      <main className="ls-main">
        <textarea
          className="ls-input"
          placeholder="Paste raw logs here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div
          className="ls-output"
          dangerouslySetInnerHTML={{ __html: renderOutput() }}
        />
      </main>

      <footer className="ls-footer">
        <small>
          Runs 100% in your browser. No data leaves your machine.
        </small>
      </footer>
    </div>
  );
}
