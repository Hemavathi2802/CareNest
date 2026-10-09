const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "dist");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  let requestPath;
  try {
    requestPath = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
  } catch {
    response.writeHead(400).end();
    return;
  }

  const filePath = path.resolve(root, `.${requestPath}`);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(404).end();
    return;
  }

  fs.stat(filePath, (error, stats) => {
    const resolvedPath =
      !error && stats.isFile() ? filePath : path.join(root, "index.html");

    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader(
      "Content-Type",
      contentTypes[path.extname(resolvedPath)] || "application/octet-stream",
    );

    if (request.method === "HEAD") {
      response.writeHead(200).end();
      return;
    }

    const stream = fs.createReadStream(resolvedPath);
    stream.on("error", () => {
      if (response.headersSent) {
        response.destroy();
      } else {
        response.writeHead(500).end();
      }
    });
    stream.pipe(response);
  });
}).listen(Number(process.env.PORT || 8080), "0.0.0.0");
