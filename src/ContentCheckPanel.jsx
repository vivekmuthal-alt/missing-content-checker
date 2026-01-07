import { useState } from "react";

export default function ContentCheckPanel() {
  const [docText, setDocText] = useState("");
  const [siteText, setSiteText] = useState("");
  const [results, setResults] = useState([]);

  const compareContent = () => {
    const docLines = docText.split("\n").map(l => l.trim()).filter(Boolean);
    const siteLines = siteText.split("\n").map(l => l.trim()).filter(Boolean);

    const siteSet = new Set(siteLines);
    const docSet = new Set(docLines);

    const comparison = [];

    docLines.forEach(line => {
      if (siteSet.has(line)) {
        comparison.push({ left: line, right: line, status: "matched" });
      } else {
        comparison.push({ left: line, right: "", status: "missing" });
      }
    });

    siteLines.forEach(line => {
      if (!docSet.has(line)) {
        comparison.push({ left: "", right: line, status: "extra" });
      }
    });

    setResults(comparison);
  };

  const getColor = status => {
    if (status === "matched") return "#d4edda";
    if (status === "missing") return "#f8d7da";
    if (status === "extra") return "#fff3cd";
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
        style={{ width: "100%", marginBottom: 10 }}
      />

      <textarea
        placeholder="Website Content (paste for now)"
        rows={6}
        value={siteText}
        onChange={e => setSiteText(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={compareContent}>Compare Content</button>

      {results.length > 0 && (
        <div style={{ display: "flex", marginTop: 20 }}>
          <div style={{ flex: 1, fontWeight: "bold" }}>Document</div>
          <div style={{ flex: 1, fontWeight: "bold" }}>Website</div>
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
