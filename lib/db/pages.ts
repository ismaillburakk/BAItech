/** pages koleksiyonu (doc id = slug) — client SDK katmanı. */
import { collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { clean, mapFirestoreError, notifySiteRevalidate } from "@/lib/db/common";
import { COLLECTIONS, type FirestoreDoc, type Page, type PageSlug } from "@/types";

export type PageInput = Omit<Page, "id" | "updatedAt">;

const pagesCollection = collection(db, COLLECTIONS.pages);

export function subscribeToPages(onData: (pages: Page[]) => void, onError: (message: string) => void): Unsubscribe {
  return onSnapshot(
    pagesCollection,
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as FirestoreDoc<Page>) }) as Page)),
    (error) => onError(mapFirestoreError(error)),
  );
}

export async function getPage(slug: PageSlug): Promise<Page | null> {
  const snapshot = await getDoc(doc(pagesCollection, slug));
  return snapshot.exists() ? ({ id: snapshot.id, ...(snapshot.data() as FirestoreDoc<Page>) } as Page) : null;
}

/** Upsert — sayfa dokümanı yoksa oluşturur */
export async function savePage(slug: PageSlug, input: PageInput): Promise<void> {
  await setDoc(doc(pagesCollection, slug), { ...clean(input), slug, updatedAt: serverTimestamp() });
  notifySiteRevalidate();
}
