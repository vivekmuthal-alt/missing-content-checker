import React, { useState } from "react";

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

    const output = [];
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
        output.push({
          left: docWord,
          right: siteWord,
          status: "matched",
        });
        i++;
        j++;
      } else {
        if (docWord) {
          output.push({
            left: docWord,
            right: "",
            status: "missing",
          });
          i++;
        }

        if (siteWord) {
          output.push({
            left: "",
            right: siteWord,
            status: "extra",
          });
          j++;
        }
      }
    }

    setResults(output);
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <textarea
          rows="10"
          placeholder="Paste Doc content"
          value={docText}
          onChange={(e) => setDocText(e.target.value)}
        />
      </div>

      <div className="col-md-6">
        <textarea
          rows="10"
          placeholder="Paste Website content"
          value={siteText}
          onChange={(e) => setSiteText(e.target.value)}
        />
      </div>

      <button onClick={compareContent}>Compare</button>

      <div>
        {results.map((res, idx) => (
          <div
            key={idx}
            style={{ color: res.status === "matched" ? "black" : "red" }}
          >
            {res.left} {res.right} ({res.status})
          </div>
        ))}
      </div>
    </div>
  );
}
