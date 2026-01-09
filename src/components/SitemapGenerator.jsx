import { useState } from "react";

export default function SitemapGenerator() {
  const [baseUrl, setBaseUrl] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [urls, setUrls] = useState([]);
  const [sitemap, setSitemap] = useState("");
  const [message, setMessage] = useState("");

  const buildSitemapXml = (base, list) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    list.forEach((slug) => {
      const trimmed = slug.replace(/^\/+|\/+$/g, "");
      const fullUrl = base.endsWith("/") ? base + trimmed : base + "/" + trimmed;
      xml += "  <url>\n";
      xml += `    <loc>${fullUrl}</loc>\n`;
      xml += "  </url>\n";
    });

    xml += "</urlset>";
    return xml;
  };

  const downloadSitemapFromXml = (xml) => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/xml;charset=utf-8," + encodeURIComponent(xml));
    element.setAttribute("download", "sitemap.xml");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const addSlug = () => {
    const s = slugInput.trim();
    if (!s) return;
    if (!baseUrl.trim()) {
      alert("Please enter base URL first");
      return;
    }

    const newUrls = [...urls, s];
    setUrls(newUrls);
    setSlugInput("");

    const xml = buildSitemapXml(baseUrl.trim(), newUrls);
    setSitemap(xml);

    // Auto-download the sitemap after adding
    downloadSitemapFromXml(xml);
  };

  const removeUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
    const xml = buildSitemapXml(baseUrl.trim(), newUrls);
    setSitemap(xml);
  };

  const copySitemap = () => {
    if (!sitemap) return;
    navigator.clipboard.writeText(sitemap);
    alert("Sitemap copied to clipboard!");
  };

  // Try to fetch existing sitemap(s) from the given site
  const fetchRemoteSitemap = async () => {
    setMessage('Searching for sitemap...');
    setSitemap('');
    const base = baseUrl.trim().replace(/\/$/, '');
    if (!base) { setMessage('Enter a site URL'); return; }

    const candidates = [
      `${base}/sitemap.xml`,
      `${base}/sitemap_index.xml`,
      `${base}/sitemap-index.xml`
    ];

    for (const u of candidates) {
      try {
        const res = await fetch(u);
        if (res.ok) {
          const text = await res.text();
          setSitemap(text);
          setMessage(`Loaded sitemap from ${u}`);
          // trigger download
          const a = document.createElement('a');
          a.href = 'data:text/xml;charset=utf-8,' + encodeURIComponent(text);
          a.download = 'sitemap.xml';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          return;
        }
      } catch (e) {
        // ignore
      }
    }

    // try robots.txt for Sitemap entries
    try {
      const rres = await fetch(`${base}/robots.txt`);
      if (rres.ok) {
        const robots = await rres.text();
        const lines = robots.split(/\r?\n/);
        const sitemapLines = lines.map(l => l.trim()).filter(l => /^sitemap:/i.test(l));
        for (const l of sitemapLines) {
          const parts = l.split(':');
          const url = parts.slice(1).join(':').trim();
          try {
            const sres = await fetch(url);
            if (sres.ok) {
              const text = await sres.text();
              setSitemap(text);
              setMessage(`Loaded sitemap from ${url}`);
              const a = document.createElement('a');
              a.href = 'data:text/xml;charset=utf-8,' + encodeURIComponent(text);
              a.download = 'sitemap.xml';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              return;
            }
          } catch (e) {}
        }
      }
    } catch (e) {}

    setMessage('No sitemap found. For full generation (crawl JS/SPAs), run the local crawler: npm run crawl:puppeteer -- <site>');
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#fff" }}>
      <h2 style={{ marginBottom: "20px" }}>Sitemap Generator</h2>

      <div style={{ marginBottom: "15px" }}>
        <label><strong>Base URL:</strong></label>
        <input
          style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontFamily: "Arial", marginTop: "5px", fontSize: "16px", boxSizing: "border-box" }}
          placeholder="https://example.com"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label><strong>Add Slug (single):</strong></label>
        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
          <input
            style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontFamily: "Arial", fontSize: "16px", boxSizing: "border-box" }}
            placeholder="about or blog/post-1"
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSlug()}
          />
          <button
            style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }}
            onClick={addSlug}
          >
            Add Slug & Download
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label><strong>Bulk Import Slugs (one per line):</strong></label>
        <textarea
          style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontFamily: "monospace", marginTop: "5px", fontSize: "14px", boxSizing: "border-box", minHeight: "100px" }}
          placeholder={"about\nservices\ncontact\nblog/post-1"}
          value={undefined}
          onChange={() => {}}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
            }
          }}
        />
        <div style={{ marginTop: "8px" }}>
          <button
            style={{ padding: "8px 16px", backgroundColor: "#6a1b9a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px" }}
            onClick={() => {
              const ta = document.querySelector('textarea[placeholder="about\\nservices\\ncontact\\nblog/post-1"]');
              if (!ta) return;
              const text = ta.value || '';
              const items = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
              if (!baseUrl.trim()) { alert('Please enter base URL first'); return; }
              if (items.length === 0) { alert('Please paste at least one slug'); return; }
              setUrls(items);
              const xml = buildSitemapXml(baseUrl.trim(), items);
              setSitemap(xml);
              downloadSitemapFromXml(xml);
            }}
          >
            Import Slugs & Download
          </button>
        </div>
      </div>

      {urls.length > 0 && (
        <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "4px", border: "1px solid #ddd" }}>
          <label><strong>Slugs to include ({urls.length}):</strong></label>
          <div style={{ marginTop: "10px" }}>
            {urls.map((url, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", backgroundColor: "#fff", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ddd" }}>
                <span style={{ fontFamily: "monospace", fontSize: "14px" }}>{url}</span>
                <button
                  style={{ padding: "4px 12px", backgroundColor: "#ff6b6b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                  onClick={() => removeUrl(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {sitemap && (
        <div style={{ marginTop: "20px" }}>
          <label><strong>Generated Sitemap XML:</strong></label>
          <textarea
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontFamily: "monospace", marginTop: "10px", fontSize: "12px", boxSizing: "border-box", backgroundColor: "#f5f5f5" }}
            rows="8"
            value={sitemap}
            readOnly
          />

          <div style={{ marginTop: "10px" }}>
            <button
              style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", marginRight: "10px" }}
              onClick={copySitemap}
            >
              Copy to Clipboard
            </button>
            <button
              style={{ padding: "8px 16px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px" }}
              onClick={() => downloadSitemapFromXml(sitemap)}
            >
              Download sitemap.xml
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
