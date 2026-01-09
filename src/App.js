import { useState } from "react";
import ContentCheckPanel from "./components/ContentCheckPanel";
import SlugGenerator from "./components/SlugGenerator";
import SitemapGenerator from "./components/SitemapGenerator";
import TreatmentForm from "./components/TreatmentForm";

export default function App() {
  const [activeTab, setActiveTab] = useState("treatment");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "20px", borderBottom: "2px solid #ddd" }}>
        <h1 style={{ margin: "0 0 15px 0" }}>ContentGuard Pro</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setActiveTab("treatment")}
            style={{
              padding: "10px 20px",
              backgroundColor: activeTab === "treatment" ? "#007bff" : "#e0e0e0",
              color: activeTab === "treatment" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Treatment Page Creator
          </button>
          <button
            onClick={() => setActiveTab("content")}
            style={{
              padding: "10px 20px",
              backgroundColor: activeTab === "content" ? "#007bff" : "#e0e0e0",
              color: activeTab === "content" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Content Checker
          </button>
          <button
            onClick={() => setActiveTab("slug")}
            style={{
              padding: "10px 20px",
              backgroundColor: activeTab === "slug" ? "#007bff" : "#e0e0e0",
              color: activeTab === "slug" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Slug Generator
          </button>
          <button
            onClick={() => setActiveTab("sitemap")}
            style={{
              padding: "10px 20px",
              backgroundColor: activeTab === "sitemap" ? "#007bff" : "#e0e0e0",
              color: activeTab === "sitemap" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sitemap Generator
          </button>
        </div>
      </div>

      {activeTab === "treatment" && <TreatmentForm />}
      {activeTab === "content" && <ContentCheckPanel />}
      {activeTab === "slug" && <SlugGenerator />}
      {activeTab === "sitemap" && <SitemapGenerator />}
    </div>
  );
}
