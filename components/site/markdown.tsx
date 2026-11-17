/**
 * Minimal, güvenli Markdown renderer (yasal metinler için).
 * Desteklenen: ## / ### başlık, "- " madde, paragraf, **kalın**, *italik*,
 * [metin](url). HTML ÜRETİLMEZ — React elemanları döner (XSS yok).
 * Başlık seviyeleri sayfa hiyerarşisine uyar: H1 sayfada, gövde H2'den başlar.
 */
import Link from "next/link";
import type { ReactNode } from "react";

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyBase}-${i++}`;
    if (m[2]) out.push(<strong key={key}>{m[2]}</strong>);
    else if (m[4]) out.push(<em key={key}>{m[4]}</em>);
    else if (m[6]) {
      const href = m[7];
      if (href.startsWith("/")) out.push(<Link key={key} href={href}>{m[6]}</Link>);
      else if (/^(https?:|mailto:|tel:)/.test(href))
        out.push(
          <a key={key} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {m[6]}
          </a>,
        );
      else out.push(m[6]);
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks: ReactNode[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let list: string[] = [];
  let para: string[] = [];
  const flushList = () => {
    if (list.length) {
      const k = `ul-${blocks.length}`;
      blocks.push(
        <ul key={k}>
          {list.map((item, i) => (
            <li key={i}>{inline(item, `${k}-${i}`)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  const flushPara = () => {
    if (para.length) {
      const k = `p-${blocks.length}`;
      blocks.push(<p key={k}>{inline(para.join(" "), k)}</p>);
      para = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      flushPara();
      continue;
    }
    const h = line.match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      flushList();
      flushPara();
      const k = `h-${blocks.length}`;
      blocks.push(h[1] === "##" ? <h2 key={k}>{inline(h[2], k)}</h2> : <h3 key={k}>{inline(h[2], k)}</h3>);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushPara();
      list.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }
    flushList();
    para.push(line);
  }
  flushList();
  flushPara();
  return <div className={className}>{blocks}</div>;
}
