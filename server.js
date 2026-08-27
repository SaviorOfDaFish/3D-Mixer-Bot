const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

function safeFilePath(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || "/").split("?")[0]);
  const requested = cleanPath === "/" ? "/index.html" : cleanPath;
  const resolved = path.normalize(path.join(PUBLIC_DIR, requested));

  if (!resolved.startsWith(PUBLIC_DIR)) return null;
  return resolved;
}

const server = http.createServer((req, res) => {
  // Development-only fake profile API. It does NOT read or write Monster Hunt data.
  if (req.url === "/api/test-hunter") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      name: "Activity Test Hunter",
      level: 12,
      points: 245,
      tokens: 18,
      title: "Rift Hunter",
      activePet: {
        name: "Rimebit",
        level: 8,
        icon: "🐲"
      },
      stats: {
        pets: 11,
        petDex: "17/32",
        trophies: 4
      }
    }));
    return;
  }

  const filePath = safeFilePath(req.url);
  if (!filePath) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statErr, stat) => {
    if (statErr || !stat.isFile()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Monster Hunt Activity DEV running on port ${PORT}`);
  console.log("SAFE MODE: fake test data only; live Monster Hunt data is untouched.");
});
