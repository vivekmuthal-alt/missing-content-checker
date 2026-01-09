import ContentCheckPanel from "./components/ContentCheckPanel";
import SlugGenerator from "./components/SlugGenerator";
import SpeedTest from "./components/SpeedTest";
import "./App.css";

export default function App() {
  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1>🛡️ ContentGuard Pro</h1>
          <p>Content Verification Tool for Website Publishing</p>
        </div>

        <ContentCheckPanel />
        <SlugGenerator />
        <SpeedTest />
      </div>
    </div>
  );
}
