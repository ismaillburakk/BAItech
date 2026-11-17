import {
  BlocksIcon,
  BrainCircuitIcon,
  CloudIcon,
  CodeIcon,
  DatabaseIcon,
  GlobeIcon,
  SearchCheckIcon,
  ServerIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SmartphoneIcon,
  SparklesIcon,
  WrenchIcon,
} from "lucide-react"
import { createElement } from "react"

// Hizmet ikon anahtarı (Firestore services.icon) → Lucide ikon
// (skill: no-emoji-icons, icon-style-consistent)
export const SERVICE_ICON_MAP = {
  smartphone: SmartphoneIcon,
  globe: GlobeIcon,
  blocks: BlocksIcon,
  "shopping-bag": ShoppingBagIcon,
  "brain-circuit": BrainCircuitIcon,
  code: CodeIcon,
  database: DatabaseIcon,
  cloud: CloudIcon,
  shield: ShieldCheckIcon,
  server: ServerIcon,
  "search-check": SearchCheckIcon,
  wrench: WrenchIcon,
  sparkles: SparklesIcon,
}

export function serviceIcon(key) {
  return SERVICE_ICON_MAP[key] ?? SparklesIcon
}

/** İkonu anahtarla çizer (bileşen render sırasında üretilmez) */
export function ServiceIcon({ name, ...props }) {
  return createElement(SERVICE_ICON_MAP[name] ?? SparklesIcon, props)
}
