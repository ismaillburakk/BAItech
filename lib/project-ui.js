// Proje durumu → rozet metni / tonu (types: PROJECT_STATUS_LABELS ile aynı küme)
const LABELS = { live: "Yayında", development: "Geliştirmede", soon: "Yakında" }
const TONES = { live: "live", development: "active", soon: "soon" }

export function statusLabel(project) {
  return LABELS[project?.status] ?? null
}

export function statusTone(project) {
  return TONES[project?.status] ?? "soon"
}
