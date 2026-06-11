import http from "node:http";
import { Readable } from "node:stream";
import serverModule from "./dist/server/server.js";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

function toWebRequest(req) {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      value.forEach((v) => headers.append(key, v));
    } else if (typeof value === "string") {
      headers.set(key, value);
    }
  }

  const body = req.method === "GET" || req.method === "HEAD" ? null : Readable.toWeb(req);

  return new Request(url.toString(), {
    method: req.method,
    headers,
    body,
  });
}

async function sendResponse(res, response) {
  res.writeHead(response.status, Object.fromEntries(response.headers));

  if (response.body) {
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        res.write(Buffer.from(value));
      }
    }
  }

  res.end();
}

const server = http.createServer(async (req, res) => {
  try {
    const request = toWebRequest(req);
    const response = await serverModule.fetch(request, process.env, {});
    await sendResponse(res, response);
  } catch (error) {
    console.error("[server] Request handling failed:", error);
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("Internal server error");
  }
});

server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
