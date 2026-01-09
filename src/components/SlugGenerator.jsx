import { useState } from "react";

export default function SlugGenerator() {
  const [text, setText] = useState("");
  const [slug, setSlug] = useState("");

  const generateSlug = () => {
    const output = text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    setSlug(output);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#fff" }}>
      <h2 style={{ marginBottom: "20px" }}>Slug Generator</h2>

      <input
        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontFamily: "Arial", marginBottom: "10px", fontSize: "16px", boxSizing: "border-box" }}
        placeholder="Enter text (e.g., Hi Buddy How Are You)"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", marginBottom: "10px" }} onClick={generateSlug}>
        Generate Slug
      </button>

      {slug && (
        <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f0f0f0", border: "1px solid #ccc", borderRadius: "4px" }}>
          <p style={{ margin: "0 0 5px 0", color: "#666" }}><strong>Generated Slug:</strong></p>
          <p style={{ margin: "0", color: "#007bff", fontSize: "18px", fontWeight: "bold", fontFamily: "monospace" }}>{slug}</p>
        </div>
      )}
    </div>
  );
}
