import { useState } from "react";

/**
 * Strict normalization:
 * - lowercase only
 * - normalize spaces
 * - DO NOT remove bullets or symbols
 */
const normalizeStrict = (line) => {
  return line
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
};

export default function ContentCheckPanel() {
  const [docText, setDocText] = useState("");
  const [siteText, setSiteText] = useState("");
  const [results, setResults] = useState([]);

  const compareContent = () => {
    // Split lines exactly as user pasted
    const docOriginal = docText
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);

    const siteOriginal = siteText
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);

    // Strict normalized versions (for comparison only)
    const docNormalized = docOriginal.map(normalizeStrict);
    const siteNormalized = siteOriginal.map(normalizeStrict);

    const usedSiteIndexes = new Set();
    const comparison = [];

    // 1️⃣ Check document → website
    docNormalized.forEach((docLine, docIndex) => {
      const siteIndex = siteNormalized.findIndex(
        (siteLine, i) => siteLine === docLine && !usedSiteIndexes.has(i)
      );

      if (siteIndex !== -1) {
        usedSiteIndexes.add(siteIndex);

        comparison.push({
          left: docOriginal[docIndex],
          right: siteOriginal[siteIndex],
          status: "matched"
        });
      } else {
        comparison.push({
          left: docOriginal[docIndex],
          right: "",
          status: "missing"
        });
      }
    });

    // 2️⃣ Extra website content
    siteNormalized.forEach((_, index) => {
      if (!usedSiteIndexes.has(index)) {
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
      <h2>Strict Content Check Panel</h2>

      <textarea
        placeholder="Original Document Content (exact)"
        rows={6}
        value={docText}
        onChange={e => setDocText(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <textarea
        placeholder="Website Content (exact copy)"
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
