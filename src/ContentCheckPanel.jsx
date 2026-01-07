import { useState } from "react";

export default function ContentCheckPanel() {
  const [docText, setDocText] = useState("");
  const [siteText, setSiteText] = useState("");
  const [results, setResults] = useState([]);

  const normalizeLines = (text) =>
    text
      .replace(/\r/g, "")
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);

  const compareContent = () => {
    const docOriginal = normalizeLines(docText);
    const siteOriginal = normalizeLines(siteText);

    const docLower = docOriginal.map(l => l.toLowerCase());
    const siteLower = siteOriginal.map(l => l.toLowerCase());

    const usedSiteIndexes = new Set();
    const comparison = [];

    // Check document lines
    docLower.forEach((line, i) => {
      const matchIndex = siteLower.findIndex(
        (s, idx) => s === line && !usedSiteIndexes.has(idx)
      );

      if (matchIndex !== -1) {
        usedSiteIndexes.add(matchIndex);
        comparison.push({
          left: docOriginal[i],
          right: siteOriginal[matchIndex],
          status: "matched"
        });
      } else {
        comparison.push({
          left: docOriginal[i],
          right: "",
          status: "missing"
        });
      }
    });

    // Extra website lines
    siteLower.forEach((line, i) => {
      if (!usedSiteIndexes.has(i)) {
        comparison.push({
          left: "",
          right: siteOriginal[i],
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
    <div style={{ padding: 20, maxWidth: 1100, margin: "auto" }}>
      <h2>Content Check Panel (Strict Mode)</h2>

      <textarea
        placeholder="Original Document Content"
        rows={8}
        value={docText}
        onChange={(e) => setDocText(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <textarea
        placeholder="Website Content (paste exact extracted text)"
        rows={8}
        value={siteText}
        onChange={(e) => setSiteText(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <button onClick={compareContent} style={{ padding: "10px 18px" }}>
        Compare Content
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", fontWeight: "bold" }}>
            <div style={{ flex: 1 }}>Document</div>
            <div style={{ flex: 1 }}>Website</div>
          </div>

          {results.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                background: getColor(row.status),
                padding: 8,
                borderBottom: "1px solid #ccc"
              }}
            >
              <div style={{ flex: 1 }}>{row.left}</div>
              <div style={{ flex: 1 }}>{row.right}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
