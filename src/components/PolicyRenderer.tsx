import React from "react";
import Link from "next/link";

export function renderPolicyBody(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  const renderInline = (str: string) => {
    // Replace markdown inline tokens: [link](url), **bold**, `code`, *italic*
    const parts = str.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
        const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (match) {
          return (
            <Link
              key={idx}
              href={match[2]}
              className="text-cobalt-600 dark:text-cyan-400 font-medium underline hover:opacity-80"
            >
              {match[1]}
            </Link>
          );
        }
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={idx}
            className="rounded bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 font-mono text-xs text-cobalt-600 dark:text-cyan-300"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={idx} className="italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  while (i < lines.length) {
    const line = lines[i].trim();

    // Table detection: starts and ends with |
    if (line.startsWith("|") && line.endsWith("|")) {
      const tableRows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableRows.push(lines[i].trim());
        i++;
      }

      if (tableRows.length >= 2) {
        const headerCols = tableRows[0]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        const bodyRows = tableRows.slice(2); // skip separator row | :--- | :--- |

        elements.push(
          <div key={`table-${i}`} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 font-bold text-slate-900 dark:text-white">
                <tr>
                  {headerCols.map((col, cIdx) => (
                    <th key={cIdx} className="px-4 py-3">
                      {renderInline(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                {bodyRows.map((r, rIdx) => {
                  const cells = r
                    .split("|")
                    .slice(1, -1)
                    .map((c) => c.trim());
                  return (
                    <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                      {cells.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-3">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="mt-8 mb-3 text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="mt-10 mb-4 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white pb-2 border-b border-slate-200/80 dark:border-white/10">
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="mt-12 mb-6 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {renderInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-4 list-disc pl-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={i}
          className="my-4 border-l-4 border-cobalt-500 bg-slate-50 dark:bg-white/5 p-4 rounded-r-xl text-sm italic text-slate-700 dark:text-slate-300"
        >
          {renderInline(line.slice(2))}
        </blockquote>
      );
      i++;
      continue;
    }

    if (!line) {
      i++;
      continue;
    }

    elements.push(
      <p key={i} className="my-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return elements;
}

