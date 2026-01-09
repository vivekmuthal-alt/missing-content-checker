import { useState } from "react";

export default function ContentCheckPanel() {
  const [docText, setDocText] = useState("");
  const [siteText, setSiteText] = useState("");
  const [results, setResults] = useState([]);

  const tokenize = (text) => {
    if (!text) return [];
    return text.match(/\b\w+\b/g) || [];
  };

  const compareContent = () => {
    const docTokens = tokenize(docText);
    const siteTokens = tokenize(siteText);

    const resultsArr = [];
    let i = 0;
    let j = 0;

    while (i < docTokens.length || j < siteTokens.length) {
      const docWord = docTokens[i];
      const siteWord = siteTokens[j];

      if (
        docWord &&
        siteWord &&
        docWord.toLowerCase() === siteWord.toLowerCase()
      ) {
        resultsArr.push({ left: docWord, right: siteWord, status: "matched" });
        i++;
        j++;
      } else {
        if (docWord) {
          resultsArr.push({ left: docWord, right: "", status: "missing" });
          i++;
        }
        if (siteWord) {
          resultsArr.push({ left: "", right: siteWord, status: "extra" });
          j++;
        }
      }
    }

    setResults(resultsArr);
  };

  return (
    <div className="container">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Content Checker Tool</h5>
        </div>

        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Document Content</label>
              <textarea
                className="form-control"
                rows="8"
                placeholder="Paste Doc content"
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Website Content</label>
              <textarea
                className="form-control"
                rows="8"
                placeholder="Paste Website content"
                value={siteText}
                onChange={(e) => setSiteText(e.target.value)}
              />
            </div>
          </div>

          <div className="text-center mb-3">
            <button className="btn btn-primary px-4" onClick={compareContent}>
              Compare Content
            </button>
          </div>

          {results.length > 0 && (
            <div
              className="border rounded p-3"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {results.map((res, idx) => (
                <div
                  key={idx}
                  className={`mb-1 ${
                    res.status === "matched"
                      ? "text-success"
                      : res.status === "missing"
                      ? "text-danger"
                      : "text-warning"
                  }`}
                >
                  <strong>{res.left || "---"}</strong>
                  {"  "}
                  {res.right && <>→ <strong>{res.right}</strong></>}
                  <span className="ms-2">({res.status})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
