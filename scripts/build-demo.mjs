// Gera a versão de demonstração (somente leitura): copia o catálogo fictício
// para out/api/products, no mesmo formato que a API real devolve.
import fs from "fs";
import path from "path";

const catalog = JSON.parse(fs.readFileSync(path.join("demo", "catalog.json"), "utf8"));
const target = path.join("out", "api");
fs.mkdirSync(target, { recursive: true });
fs.writeFileSync(path.join(target, "products"), JSON.stringify({ products: catalog }));
console.log(`Demo pronta: ${catalog.length} produtos fictícios em out/api/products`);
