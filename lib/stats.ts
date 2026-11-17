import type { Project, Service, SiteSettings } from "@/types";

/** Site Ayarları › İstatistikler → gösterilecek değerler (otomatik sayımlar canlı veriden) */
export function computeStats(settings: SiteSettings | null, projects: Project[], services: Service[]) {
  const liveApps = projects.filter((p) => p.status === "live" && (p.links?.appStore || p.links?.playStore)).length;
  return (settings?.stats ?? [])
    .map((s) => {
      if (s.source === "liveApps") return { label: s.label, value: liveApps };
      if (s.source === "projects") return { label: s.label, value: projects.length };
      if (s.source === "services") return { label: s.label, value: services.length };
      const n = Number(s.value);
      return { label: s.label, value: s.value && /^\d+$/.test(s.value) && n < 1000 ? n : s.value };
    })
    .filter((s) => s.label && s.value !== "" && s.value !== undefined);
}
