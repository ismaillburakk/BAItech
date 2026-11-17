/**
 * Tekil dokümanlar — hero/main ve siteSettings/main (client SDK).
 * Kaydetme upsert'tir (setDoc): doküman yoksa oluşturur.
 */
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { clean, notifySiteRevalidate } from "@/lib/db/common";
import { COLLECTIONS, SINGLETON_DOC_ID, type FirestoreDoc, type HeroContent, type SiteSettings } from "@/types";

export type HeroInput = Omit<HeroContent, "id" | "updatedAt">;
export type SiteSettingsInput = Omit<SiteSettings, "id" | "updatedAt">;

const heroDoc = doc(db, COLLECTIONS.hero, SINGLETON_DOC_ID);
const settingsDoc = doc(db, COLLECTIONS.siteSettings, SINGLETON_DOC_ID);

export async function getHero(): Promise<HeroContent | null> {
  const snapshot = await getDoc(heroDoc);
  return snapshot.exists() ? ({ id: snapshot.id, ...(snapshot.data() as FirestoreDoc<HeroContent>) } as HeroContent) : null;
}

export async function saveHero(input: HeroInput): Promise<void> {
  await setDoc(heroDoc, { ...clean(input), updatedAt: serverTimestamp() });
  notifySiteRevalidate();
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const snapshot = await getDoc(settingsDoc);
  return snapshot.exists() ? ({ id: snapshot.id, ...(snapshot.data() as FirestoreDoc<SiteSettings>) } as SiteSettings) : null;
}

export async function saveSiteSettings(input: SiteSettingsInput): Promise<void> {
  await setDoc(settingsDoc, { ...clean(input), updatedAt: serverTimestamp() });
  notifySiteRevalidate();
}
