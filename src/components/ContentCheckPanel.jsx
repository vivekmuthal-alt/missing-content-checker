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
    <div className="card p-3 mb-4">
      <h4>Content Correction Panel</h4>

      <div className="row">
        <div className="col-md-6">
          <label><strong>Reference Content (Doc)</strong></label>
          <textarea
            className="form-control mb-2"
            rows="5"
            placeholder="Paste Doc Content"
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label><strong>Website Content</strong></label>
          <textarea
            className="form-control mb-2"
            rows="5"
            placeholder="Paste Website Content"
            value={siteText}
            onChange={(e) => setSiteText(e.target.value)}
          />
        </div>
      </div>

      <button className="btn btn-primary mb-3" onClick={handleCheck}>
        Check Content
      </button>

      {matched.length > 0 && (
        <div className="mb-3">
          <label><strong>✅ Matched Content:</strong></label>
          <div className="p-2 bg-light border rounded">
            {matched.map((line, i) => (
              <div key={i} style={{ color: "green", marginBottom: "5px" }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {extra.length > 0 && (
        <div className="mb-3">
          <label><strong>❌ Extra Content (in Website only):</strong></label>
          <div className="p-2 bg-light border rounded border-danger">
            {extra.map((line, i) => (
              <div key={i} style={{ color: "red", marginBottom: "5px" }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div className="mb-3">
          <label><strong>❌ Missing Content (from Website):</strong></label>
          <textarea
            className="form-control"
            rows="4"
            value={missing.join("\n")}
            readOnly
            style={{ color: "red", fontWeight: "bold" }}
          />
        </div>
      )}
    </div>
  );
}
