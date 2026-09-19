// Minimal static file server for local preview (no external deps, Node 12+ compatible).
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const port = process.env.PORT || 5500;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".wasm": "application/wasm",
  ".step": "application/octet-stream",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".glb": "model/gltf-binary",
};

// Local-only helper for tools/bake-step.html: lets that page save a baked
// .glb straight into assets/models/ instead of going through a manual
// download-then-move step. Never runs in production — GitHub Pages only
// serves static files and never executes this script.
function handleSave(req, res) {
  const name = new URL(req.url, "http://localhost").searchParams.get("name") || "";
  if (!/^[a-zA-Z0-9_-]+\.glb$/.test(name)) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Invalid filename");
    return;
  }
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const dest = path.join(root, "assets", "models", name);
    fs.writeFile(dest, Buffer.concat(chunks), (err) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(String(err));
        return;
      }
      console.log(`Saved ${dest}`);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("OK");
    });
  });
}

http
  .createServer((req, res) => {
    if (req.method === "POST" && req.url.startsWith("/__save")) {
      handleSave(req, res);
      return;
    }

    let reqPath = decodeURIComponent(req.url.split("?")[0]);
    if (reqPath === "/") reqPath = "/index.html";
    const filePath = path.join(root, reqPath);

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not found: " + reqPath);
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        "Content-Type": MIME[ext] || "application/octet-stream",
      });
      res.end(data);
    });
  })
  .listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`));
