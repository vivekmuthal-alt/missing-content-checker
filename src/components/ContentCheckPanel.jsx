import { useState } from "react";
import { compareText } from "../utils/compareText";

export default function ContentCheckPanel() {
  const [docText, setDocText] = useState("");
  const [siteText, setSiteText] = useState("");
  const [matched, setMatched] = useState([]);
  const [missing, setMissing] = useState([]);
  const [extra, setExtra] = useState([]);

  const handleCheck = () => {
    const result = compareText(docText, siteText);
    setMatched(result.matched);
    setMissing(result.missing);
    setExtra(result.extra);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#fff" }}>
      <h2 style={{ marginBottom: "20px" }}>Content Correction Panel</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <label><strong>Reference Content (Doc)</strong></label>
          <textarea
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontFamily: "Arial", marginTop: "10px", marginBottom: "10px" }}
            rows="5"
            placeholder="Paste Doc Content"
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label><strong>Website Content</strong></label>
          <textarea
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontFamily: "Arial", marginTop: "10px", marginBottom: "10px" }}
            rows="5"
            placeholder="Paste Website Content"
            value={siteText}
            onChange={(e) => setSiteText(e.target.value)}
          />
        </div>
      </div>

      <button style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", marginBottom: "20px" }} onClick={handleCheck}>
        Check Content
      </button>

      {matched.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <label><strong>✅ Matched Content:</strong></label>
          <div style={{ padding: "10px", backgroundColor: "#f0f0f0", border: "1px solid #ccc", borderRadius: "4px" }}>
            {matched.map((line, i) => (
              <div key={i} style={{ color: "green", marginBottom: "5px" }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {extra.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <label><strong>❌ Extra Content (in Website only):</strong></label>
          <div style={{ padding: "10px", backgroundColor: "#f0f0f0", border: "2px solid #ff6b6b", borderRadius: "4px" }}>
            {extra.map((line, i) => (
              <div key={i} style={{ color: "red", marginBottom: "5px" }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <label><strong>❌ Missing Content (from Website):</strong></label>
          <textarea
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontFamily: "Arial", color: "red", fontWeight: "bold" }}
            rows="4"
            value={missing.join("\n")}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
