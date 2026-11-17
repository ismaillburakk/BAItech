/**
 * JSON-LD script bloğu — schema.org yapılandırılmış verisi (SSR'da HTML'e basılır).
 *
 * Her blok TEK bir kök nesnedir ve kökte daima "@context" bulunur. Birden çok düğüm
 * `@graph` içinde toplanır; düğümlerin kendi "@context"i atılır. (Kökü dizi olan
 * bloklar, `data["@context"]` okuyan istemci tarafı ayrıştırıcıları — tarayıcı
 * eklentileri, Safari, SEO araçları — `undefined.toLowerCase` hatasıyla düşürüyordu.)
 * `<` kaçışlanır: içerikteki "</script>" dizisi bloğu kıramaz.
 */
const CONTEXT = "https://schema.org";

type Node = Record<string, unknown>;

function withoutContext(node: Node): Node {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { "@context": _ctx, ...rest } = node;
  return rest;
}

export function normalizeJsonLd(data: unknown): Node {
  const nodes = (Array.isArray(data) ? data : [data]).filter(
    (n): n is Node => !!n && typeof n === "object" && !Array.isArray(n),
  );
  if (nodes.length === 1) return { "@context": CONTEXT, ...withoutContext(nodes[0]) };
  return { "@context": CONTEXT, "@graph": nodes.map(withoutContext) };
}

export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(normalizeJsonLd(data)).replace(/</g, "\\u003c") }}
    />
  );
}
