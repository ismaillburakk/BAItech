/**
 * Public site veri katmanı — YALNIZCA server component'lerden kullanılır.
 *
 * Okumalar Admin SDK ile yapılır (SSR/ISR uyumlu; içerik JS kapalıyken de
 * HTML'de). Timestamp'ler client component'lere prop olarak geçebilsin
 * diye düz objeye ({seconds, nanoseconds}) çevrilir.
 * cache(): aynı istek içinde generateMetadata + sayfa gövdesi tek fetch paylaşır.
 */
import "server-only";

import { cache } from "react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import {
  COLLECTIONS,
  SINGLETON_DOC_ID,
  type FaqItem,
  type HeroContent,
  type Page,
  type PageSlug,
  type Project,
  type Reference,
  type Service,
  type SiteSettings,
  type TeamMember,
} from "@/types";

/** Firestore Timestamp → düz obje (iç içe alanlar dahil) */
function toPlain(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(toPlain);
  const maybeTs = value as { seconds?: unknown; nanoseconds?: unknown; toDate?: unknown };
  if (typeof maybeTs.toDate === "function" && typeof maybeTs.seconds === "number") {
    return { seconds: maybeTs.seconds, nanoseconds: maybeTs.nanoseconds ?? 0 };
  }
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) out[key] = toPlain(item);
  return out;
}

function plainDoc<T>(id: string, data: DocumentData): T {
  return { id, ...(toPlain(data) as Record<string, unknown>) } as T;
}

async function orderedCollection<T>(name: string): Promise<T[]> {
  const snapshot = await adminDb.collection(name).orderBy("order", "asc").get();
  return snapshot.docs.map((d: QueryDocumentSnapshot) => plainDoc<T>(d.id, d.data()));
}

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  const snapshot = await adminDb.collection(COLLECTIONS.siteSettings).doc(SINGLETON_DOC_ID).get();
  return snapshot.exists ? plainDoc<SiteSettings>(snapshot.id, snapshot.data()!) : null;
});

export const getHero = cache(async (): Promise<HeroContent | null> => {
  const snapshot = await adminDb.collection(COLLECTIONS.hero).doc(SINGLETON_DOC_ID).get();
  return snapshot.exists ? plainDoc<HeroContent>(snapshot.id, snapshot.data()!) : null;
});

/** Yayındaki projeler (isPublished), order sırasıyla */
export const getProjects = cache(async (): Promise<Project[]> => {
  const all = await orderedCollection<Project>(COLLECTIONS.projects);
  return all.filter((p) => p.isPublished !== false);
});

export async function getProjectBySlug(slug: string): Promise<{
  project: Project;
  previous: Project;
  next: Project;
  siblings: Project[];
} | null> {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) return null;
  const total = projects.length;
  return {
    project: projects[index],
    previous: projects[(index - 1 + total) % total],
    next: projects[(index + 1) % total],
    siblings: projects.filter((p) => p.slug !== slug),
  };
}

export const getServices = cache(() => orderedCollection<Service>(COLLECTIONS.services));

export const getReferences = cache(async (): Promise<Reference[]> => {
  const all = await orderedCollection<Reference>(COLLECTIONS.references);
  return all.filter((r) => r.isActive !== false);
});

export const getFaq = cache(async (): Promise<FaqItem[]> => {
  const all = await orderedCollection<FaqItem>(COLLECTIONS.faq);
  return all.filter((f) => f.isActive !== false);
});

export const getTeamMembers = cache(async (): Promise<TeamMember[]> => {
  const all = await orderedCollection<TeamMember>(COLLECTIONS.teamMembers);
  return all.filter((m) => m.isActive !== false);
});

export const getPage = cache(async (slug: PageSlug): Promise<Page | null> => {
  const snapshot = await adminDb.collection(COLLECTIONS.pages).doc(slug).get();
  return snapshot.exists ? plainDoc<Page>(snapshot.id, snapshot.data()!) : null;
});
