import { ExternalLinkIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

function AppleGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.65.8-3.33.8-.7 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.1 8.79.74 1.06 1.61 2.25 2.75 2.2 1.11-.04 1.52-.71 2.86-.71 1.33 0 1.71.71 2.87.69 1.19-.02 1.94-1.08 2.66-2.15.84-1.23 1.19-2.43 1.2-2.49-.03-.01-2.3-.88-2.32-3.52ZM14.2 6.13c.6-.74 1.01-1.75.9-2.77-.87.04-1.94.59-2.56 1.32-.56.64-1.05 1.68-.92 2.67.97.08 1.97-.49 2.58-1.22Z" />
    </svg>
  )
}

function PlayGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.3 2.6c-.2.2-.3.6-.3 1v16.8c0 .4.1.8.3 1l9.4-9.4L4.3 2.6Zm10.8 10.8 2.6 2.6-11.5 6.6c-.4.2-.8.2-1.1.1l10-9.3Zm0-2.8-10-9.3c.3-.1.7-.1 1.1.1L17.7 8l-2.6 2.6Zm3.9 4.3-2.9-1.7L13.3 12l2.8-2.8 2.9 1.7c.8.5.8 1.7 0 2.2v.1Z" />
    </svg>
  )
}

/** Mağaza / web bağlantıları — proje-detay.md "Download buttons prominent". Dış bağlantılar yeni sekmede. */
/** @param {any} props */
export function StoreButtons({ project, size = "default" }) {
  const links = project.links ?? {}
  const storeLinks = links.appStore || links.playStore ? links : null
  const webUrl = links.web || ""
  if (!storeLinks && !webUrl) return null
  return (
    <div className="flex flex-wrap gap-3">
      {storeLinks?.appStore ? (
        <Button asChild size={size}>
          <a href={storeLinks.appStore} target="_blank" rel="noopener noreferrer">
            <AppleGlyph className="size-5" />
            App Store
            <span className="sr-only">(yeni sekmede açılır)</span>
          </a>
        </Button>
      ) : null}
      {storeLinks?.playStore ? (
        <Button asChild size={size} variant={storeLinks?.appStore ? "outline" : "default"}>
          <a href={storeLinks.playStore} target="_blank" rel="noopener noreferrer">
            <PlayGlyph className="size-5" />
            Google Play
            <span className="sr-only">(yeni sekmede açılır)</span>
          </a>
        </Button>
      ) : null}
      {webUrl ? (
        <Button asChild size={size} variant="outline">
          <a href={webUrl} target="_blank" rel="noopener noreferrer">
            Web sitesini ziyaret et
            <ExternalLinkIcon data-icon="inline-end" aria-hidden="true" />
            <span className="sr-only">(yeni sekmede açılır)</span>
          </a>
        </Button>
      ) : null}
    </div>
  )
}
