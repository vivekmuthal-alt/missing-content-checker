import { useState } from "react";

/**
 * Normalize a line for comparison:
 * - lowercase
 * - remove bullets (-, *, •)
 * - normalize spaces
 */
const normalizeLine = (line) => {
  return line
    .toLowerCase()
    .replace(/^[\s•\-*]+/, "") // remove bullet symbols at start
    .replace(/\s+/g, " ")
    .trim();
};

export default function ContentCheckPanel() {
  const [docText, setDocText] = useState("");
  const [siteText, setSiteText] = useState("");
  const [results, setResults] = useState([]);

  const compareContent = () => {
    // Original lines (for display)
    const docOriginal = docText
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);

    const siteOriginal = siteText
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);

    // Normalized lines (for comparison)
    const docNormalized = docOriginal.map(normalizeLine);
    const siteNormalized = siteOriginal.map(normalizeLine);

    const siteSet = new Set(siteNormalized);
    const docSet = new Set(docNormalized);

    const comparison = [];

    // Compare document → website
    docNormalized.forEach((line, index) => {
      if (siteSet.has(line)) {
        const siteIndex = siteNormalized.indexOf(line);

        comparison.push({
          left: docOriginal[index],
          right: siteOriginal[siteIndex],
          status: "matched"
        });
      } else {
        comparison.push({
          left: docOriginal[index],
          right: "",
          status: "missing"
        });
      }
    });

    // Extra website content
    siteNormalized.forEach((line, index) => {
      if (!docSet.has(line)) {
        comparison.push({
          left: "",
          right: siteOriginal[index],
          status: "extra"
        });
      }
    });

    setResults(comparison);
  };

  const getColor = (status) => {
    if (status === "matched") return "#d4edda"; // green
    if (status === "missing") return "#f8d7da"; // red
    if (status === "extra") return "#fff3cd";   // yellow
    return "#fff";
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Content Check Panel</h2>

      <textarea
        placeholder="Original Document Content"
        rows={6}
        value={docText}
        onChange={e => setDocText(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <textarea
        placeholder="Website Content (paste from page)"
        rows={6}
        value={siteText}
        onChange={e => setSiteText(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <button onClick={compareContent} style={{ padding: "8px 16px" }}>
        Compare Content
      </button>

      {results.length > 0 && (
        <div style={{ display: "flex", marginTop: 20, fontWeight: "bold" }}>
          <div style={{ flex: 1 }}>Document</div>
          <div style={{ flex: 1 }}>Website</div>
        </div>
      )}

      {results.map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            background: getColor(row.status),
            padding: "6px",
            borderBottom: "1px solid #ccc"
          }}
        >
          <div style={{ flex: 1 }}>{row.left}</div>
          <div style={{ flex: 1 }}>{row.right}</div>
        </div>
      ))}
    </div>
  );
}
