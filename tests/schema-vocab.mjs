/**
 * schema.org sözlük kontrolü — üretim HTML'indeki tüm JSON-LD düğümlerinde kullanılan tür ve
 * özelliklerin schema.org sözlüğünde bulunduğunu ve özelliğin o türde (ya da üst türünde) tanımlı
 * olduğunu doğrular. Sözlük schema.org'dan indirilir ve tests/.cache altında saklanır.
 *   node tests/schema-vocab.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
const BASE = process.env.SITE_URL ?? "http://localhost:3100";
const ROUTES = ["/", "/hizmetler", "/projeler", "/projeler/baseline", "/projeler/bukira", "/projeler/gymbot", "/projeler/dukan", "/projeler/isletmelere-ozel-yazilim", "/projeler/chatekg", "/hakkimizda", "/iletisim", "/aydinlatma-metni", "/gizlilik-politikasi", "/cerez-politikasi"];
const CACHE = "tests/.cache/schemaorg.jsonld";
if (!existsSync(CACHE)) {
  mkdirSync("tests/.cache", { recursive: true });
  writeFileSync(CACHE, await (await fetch("https://schema.org/version/latest/schemaorg-current-https.jsonld")).text());
}
const graph = JSON.parse(readFileSync(CACHE, "utf8"))["@graph"];
const id = (x) => x.replace("schema:", "");
const list = (v) => (v ? [v].flat().map((x) => id(x["@id"])) : []);
const parents = new Map();
const props = new Map();
for (const n of graph) {
  const types = [n["@type"]].flat();
  if (types.includes("rdfs:Class")) parents.set(id(n["@id"]), list(n["rdfs:subClassOf"]));
  if (types.includes("rdf:Property")) props.set(id(n["@id"]), list(n["schema:domainIncludes"]));
}
const ancestors = (t, seen = new Set()) => {
  if (seen.has(t)) return seen;
  seen.add(t);
  for (const p of parents.get(t) ?? []) ancestors(p, seen);
  return seen;
};
const errors = new Set();
let nodes = 0;
let checked = 0;
function walk(node, route, path) {
  if (Array.isArray(node)) return node.forEach((x, i) => walk(x, route, `${path}[${i}]`));
  if (!node || typeof node !== "object") return;
  const types = [node["@type"]].flat().filter(Boolean);
  if (types.length) {
    nodes++;
    const all = new Set();
    for (const t of types) {
      if (!parents.has(t)) errors.add(`${route} ${path}: bilinmeyen tür ${t}`);
      for (const a of ancestors(t)) all.add(a);
    }
    for (const key of Object.keys(node)) {
      if (key.startsWith("@")) continue;
      checked++;
      const domain = props.get(key);
      if (!domain) errors.add(`${route} ${path}: bilinmeyen özellik ${key} (${types.join("+")})`);
      else if (!domain.some((d) => all.has(d))) errors.add(`${route} ${path}: ${key} özelliği ${types.join("+")} türünde tanımlı değil`);
    }
  }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith("@")) walk(v, route, `${path}.${k}`);
}
for (const r of ROUTES) {
  const html = await (await fetch(BASE + r)).text();
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) walk(JSON.parse(m[1]), r, "ld");
}
console.log(`${ROUTES.length} sayfa · ${nodes} düğüm · ${checked} özellik denetlendi · ${errors.size} hata`);
for (const e of errors) console.log("  ✗ " + e);
process.exit(errors.size ? 1 : 0);
