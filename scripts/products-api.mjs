import fs from "fs";
import http from "http";
import path from "path";
import { handleCatalog } from "../lib/catalog-store.mjs";

const file = path.join(process.cwd(), "data", "catalog.json");
const port = 8788;

function envValue(name) {
  if (process.env[name]) return process.env[name];
  try {
    const text = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    const line = text.split(/\r?\n/).find((item) => item.startsWith(`${name}=`));
    return line ? line.slice(name.length + 1).trim() : "";
  } catch {
    return "";
  }
}

const store = {
  async list() {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  async save(products) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(products, null, 2));
  },
};

const auth = { user: envValue("ADMIN_USER"), password: envValue("ADMIN_PASSWORD") };
const server = http.createServer(async (req, res) => {
  const request = new Request(`http://127.0.0.1:${port}${req.url}`, {
    method: req.method,
    headers: req.headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await readBody(req),
  });
  const response = await handleCatalog(request, store, auth);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Cadastro de produtos em http://127.0.0.1:${port}/api/products`);
});

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
