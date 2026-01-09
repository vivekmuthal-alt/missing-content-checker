import { useState } from "react";

export default function TreatmentForm() {
  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);
  const [codeOutput, setCodeOutput] = useState("");
  const [outputFormat, setOutputFormat] = useState("html");
  const [showView, setShowView] = useState("code");

  const tagOptions = [
    { value: "p", label: "Paragraph (p)" },
    { value: "h1", label: "Heading 1 (h1)" },
    { value: "h2", label: "Heading 2 (h2)" },
    { value: "h3", label: "Heading 3 (h3)" },
    { value: "h4", label: "Heading 4 (h4)" },
    { value: "h5", label: "Heading 5 (h5)" },
    { value: "ul", label: "Bullet List (ul)" },
    { value: "ol", label: "Numbered List (ol)" },
    { value: "blockquote", label: "Blockquote" },
  ];

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
    if (!metaTitle) setMetaTitle(newTitle);
  };

  const addContentBlock = () => {
    setContentBlocks([
      ...contentBlocks,
      { id: Date.now(), tag: "p", content: "" }
    ]);
  };

  const updateBlock = (id, field, value) => {
    setContentBlocks(
      contentBlocks.map((block) =>
        block.id === id ? { ...block, [field]: value } : block
      )
    );
  };

  const deleteBlock = (id) => {
    setContentBlocks(contentBlocks.filter((block) => block.id !== id));
  };

  const renderContent = (tag, content) => {
    if (tag === "ul") {
      const items = content
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item);
      return (
        <ul style={{ marginLeft: "20px", marginBottom: "15px" }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: "8px", color: "#666" }}>
              {item}
            </li>
          ))}
        </ul>
      );
    } else if (tag === "ol") {
      const items = content
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item);
      return (
        <ol style={{ marginLeft: "20px", marginBottom: "15px" }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: "8px", color: "#666" }}>
              {item}
            </li>
          ))}
        </ol>
      );
    }

    const props = {
      style: {
        marginBottom: "15px",
        color: tag === "blockquote" ? "#666" : "#333",
        fontStyle: tag === "blockquote" ? "italic" : "normal",
        borderLeft: tag === "blockquote" ? "4px solid #007bff" : "none",
        paddingLeft: tag === "blockquote" ? "15px" : "0",
      },
    };

    const TagName = tag;
    return <TagName {...props}>{content}</TagName>;
  };

  const renderPreview = () => {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "30px 20px", backgroundColor: "#fff" }}>
        {title && (
          <h1 style={{ fontSize: "32px", color: "#333", marginBottom: "30px", borderBottom: "2px solid #007bff", paddingBottom: "15px" }}>
            {title}
          </h1>
        )}
        {contentBlocks.map((block) => (
          <div key={block.id}>
            {renderContent(block.tag, block.content)}
          </div>
        ))}
      </div>
    );
  };

  const generateHTMLCode = () => {
    const canonical = `https://yourwebsite.com/${slug}`;
    
    const contentHTML = contentBlocks
      .map((block) => {
        if (block.tag === "ul") {
          const items = block.content
            .split("\n")
            .map((item) => item.trim())
            .filter((item) => item);
          return `<ul>\n${items.map((item) => `            <li>${item}</li>`).join("\n")}\n        </ul>`;
        } else if (block.tag === "ol") {
          const items = block.content
            .split("\n")
            .map((item) => item.trim())
            .filter((item) => item);
          return `<ol>\n${items.map((item) => `            <li>${item}</li>`).join("\n")}\n        </ol>`;
        } else if (block.tag === "blockquote") {
          return `<blockquote style="border-left: 4px solid #007bff; padding-left: 15px; font-style: italic;">${block.content}</blockquote>`;
        }
        return `<${block.tag}>${block.content}</${block.tag}>`;
      })
      .join("\n        ");

    const code = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metaTitle}</title>
    <meta name="description" content="${metaDescription}">
    <link rel="canonical" href="${canonical}" />
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3, h4, h5 {
            color: #333;
            margin-bottom: 15px;
            margin-top: 20px;
        }
        h1 { font-size: 32px; border-bottom: 2px solid #007bff; padding-bottom: 15px; }
        h2 { font-size: 28px; }
        h3 { font-size: 24px; }
        h4 { font-size: 20px; }
        h5 { font-size: 18px; }
        p {
            font-size: 16px;
            color: #666;
            margin-bottom: 15px;
            line-height: 1.8;
        }
        ul, ol {
            margin-left: 20px;
            margin-bottom: 15px;
        }
        li {
            margin-bottom: 8px;
            color: #666;
            font-size: 16px;
        }
        blockquote {
            border-left: 4px solid #007bff;
            padding-left: 15px;
            font-style: italic;
            color: #666;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        ${contentHTML}
    </div>
</body>
</html>`;

    setCodeOutput(code);
  };

  const generateReactCode = () => {
    const canonical = `https://yourwebsite.com/${slug}`;
    
    const contentJSX = contentBlocks
      .map((block, idx) => {
        if (block.tag === "ul") {
          const items = block.content
            .split("\n")
            .map((item) => item.trim())
            .filter((item) => item);
          return `<ul key="${idx}">
          {${JSON.stringify(items)}.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>`;
        } else if (block.tag === "ol") {
          const items = block.content
            .split("\n")
            .map((item) => item.trim())
            .filter((item) => item);
          return `<ol key="${idx}">
          {${JSON.stringify(items)}.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>`;
        } else if (block.tag === "blockquote") {
          return `<blockquote key="${idx}" style={{ borderLeft: "4px solid #007bff", paddingLeft: "15px", fontStyle: "italic" }}>${block.content}</blockquote>`;
        }
        const TagName = block.tag;
        return `<${TagName} key="${idx}">${block.content}</${TagName}>`;
      })
      .join("\n        ");

    const code = `import React from 'react';

export default function ${title.replace(/\s+/g, "")}() {
  return (
    <>
      <head>
        <title>${metaTitle}</title>
        <meta name="description" content="${metaDescription}" />
        <link rel="canonical" href="${canonical}" />
      </head>
      
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ fontSize: "32px", color: "#333", marginBottom: "20px", borderBottom: "2px solid #007bff", paddingBottom: "15px" }}>${title}</h1>
        
        ${contentJSX}
      </div>
    </>
  );
}`;

    setCodeOutput(code);
  };

  const handleGenerate = () => {
    if (outputFormat === "html") {
      generateHTMLCode();
    } else {
      generateReactCode();
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Page Builder with Tag Control</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Form */}
        <div style={{ flex: 1 }}>
          <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", backgroundColor: "#fff" }}>
            <h2 style={{ marginBottom: "20px" }}>Page Details</h2>

            {/* Title */}
            <div style={{ marginBottom: "15px" }}>
              <label><strong>Page Title:</strong></label>
              <input
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "16px", boxSizing: "border-box", marginTop: "5px" }}
                placeholder="e.g., Root Canal Treatment"
                value={title}
                onChange={handleTitleChange}
              />
            </div>

            {/* Slug */}
            <div style={{ marginBottom: "15px" }}>
              <label><strong>Slug (Auto-generated):</strong></label>
              <input
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box", marginTop: "5px", backgroundColor: "#f5f5f5" }}
                placeholder="auto-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            {/* Meta Title */}
            <div style={{ marginBottom: "15px" }}>
              <label><strong>Meta Title (SEO):</strong></label>
              <input
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box", marginTop: "5px" }}
                placeholder="e.g., Root Canal Treatment - Best Dental Care"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>

            {/* Meta Description */}
            <div style={{ marginBottom: "20px" }}>
              <label><strong>Meta Description (SEO):</strong></label>
              <textarea
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box", marginTop: "5px" }}
                rows="2"
                placeholder="e.g., Expert root canal treatment. Fast, painless procedures."
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>

            <hr style={{ marginBottom: "20px" }} />
            <h3 style={{ marginBottom: "15px" }}>Content Blocks</h3>

            {/* Content Blocks */}
            <div style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "15px" }}>
              {contentBlocks.length === 0 ? (
                <p style={{ color: "#999" }}>No content blocks yet. Click "Add Content Block" to start.</p>
              ) : (
                contentBlocks.map((block) => (
                  <div key={block.id} style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "15px", borderRadius: "6px", backgroundColor: "#f9f9f9" }}>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <select
                        value={block.tag}
                        onChange={(e) => updateBlock(block.id, "tag", e.target.value)}
                        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "14px", flex: 1 }}
                      >
                        {tagOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => deleteBlock(block.id)}
                        style={{ padding: "8px 15px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                      placeholder={block.tag === "ul" || block.tag === "ol" ? "Enter each item on a new line" : "Enter content here"}
                      style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box", fontFamily: "Arial" }}
                      rows="3"
                    />
                  </div>
                ))
              )}
            </div>

            <button
              onClick={addContentBlock}
              style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginBottom: "15px", width: "100%" }}
            >
              + Add Content Block
            </button>

            <button
              style={{ padding: "12px 24px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", width: "100%" }}
              onClick={handleGenerate}
            >
              Generate Code & Preview
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div style={{ flex: 1 }}>
          {codeOutput ? (
            <div style={{ border: "1px solid #ccc", padding: "0", borderRadius: "8px", backgroundColor: "#f9f9f9", height: "fit-content", position: "sticky", top: "20px" }}>
              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "2px solid #ddd" }}>
                <button
                  onClick={() => setShowView("preview")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: showView === "preview" ? "#007bff" : "#e0e0e0",
                    color: showView === "preview" ? "white" : "black",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Preview
                </button>
                <button
                  onClick={() => setShowView("code")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: showView === "code" ? "#007bff" : "#e0e0e0",
                    color: showView === "code" ? "white" : "black",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Code
                </button>
              </div>

              {showView === "preview" ? (
                <div style={{ maxHeight: "600px", overflowY: "auto", backgroundColor: "#f5f5f5" }}>
                  {renderPreview()}
                </div>
              ) : (
                <div style={{ padding: "20px", position: "relative" }}>
                  <div style={{ marginBottom: "15px", display: "flex", gap: "10px", alignItems: "center" }}>
                    <label><strong>Format:</strong></label>
                    <select 
                      value={outputFormat} 
                      onChange={(e) => {
                        setOutputFormat(e.target.value);
                        setTimeout(handleGenerate, 0);
                      }}
                      style={{ padding: "5px 10px", borderRadius: "4px", border: "1px solid #ddd" }}
                    >
                      <option value="html">HTML Standalone</option>
                      <option value="react">React Component</option>
                    </select>
                  </div>

                  <textarea
                    readOnly
                    value={codeOutput}
                    style={{
                      width: "100%",
                      height: "500px",
                      padding: "15px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      backgroundColor: "#fff",
                      overflow: "auto",
                    }}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(codeOutput);
                      alert("Code copied to clipboard!");
                    }}
                    style={{
                      position: "absolute",
                      top: "60px",
                      right: "20px",
                      padding: "8px 16px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Copy Code
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "#999", textAlign: "center", marginTop: "50px" }}>Generated preview and code will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
}
