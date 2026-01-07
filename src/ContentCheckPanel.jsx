import { useState } from "react";

export default function ContentCheckPanel() {
  const [docText, setDocText] = useState("");
  const [siteText, setSiteText] = useState("");
  const [results, setResults] = useState([]);

  const compareContent = () => {
    // Split lines, trim, remove empty
    const docLinesOriginal = docText.split("\n").map(l => l.trim()).filter(Boolean);
    const siteLinesOriginal = siteText.split("\n").map(l => l.trim()).filter(Boolean);

    // Lowercase versions for comparison
    const docLines = docLinesOriginal.map(l => l.toLowerCase());
    const siteLines = siteLinesOriginal.map(l => l.toLowerCase());

    const siteSet = new Set(siteLines);
    const docSet = new Set(docLines);

    const comparison = [];

    // Compare document lines
    docLines.forEach((line, index) => {
      if (siteSet.has(line)) {
        comparison.push({
          left: docLinesOriginal[index],   // preserve original text
          right: siteLinesOriginal[siteLines.findIndex(l => l === line)],
          status: "matched"
        });
      } else {
        comparison.push({
          left: docLinesOriginal[index],
          right: "",
          status: "missing"
        });
      }
    });

    // Check for extra lines in website
    siteLines.forEach((line, index) => {
      if (!docSet.has(line)) {
        comparison.push({
          left: "",
          right: siteLinesOriginal[index],
          status: "extra"
        });
      }
    });

    setResults(comparison);
  };

  // Background color based on status
  const getColor = status => {
    if (status === "matched") return "#d4edda";   // green
    if (status === "missing") return "#f8d7da";   // red
    if (status === "extra") return "#fff3cd";     // yellow
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
        placeholder="Website Content (paste for now)"
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
