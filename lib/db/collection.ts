/**
 * Sıralı içerik koleksiyonları için ortak client SDK CRUD fabrikası.
 * (projects, services, references, faq, teamMembers)
 *
 * AD Mimarlık'taki koleksiyon başına CRUD dosyalarının ortak kalıbı tek
 * yerde: canlı liste (onSnapshot), tekil okuma, sıradaki order, oluştur,
 * güncelle, sil, sürükle-bırak sırasını toplu yaz. Her mutasyon sonrası
 * public site önbelleği tazelenir. Yazma izni firestore.rules'taki
 * `admin == true` custom claim kontrolüne dayanır.
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { clean, mapFirestoreError, notifySiteRevalidate } from "@/lib/db/common";
import type { FirestoreDoc } from "@/types";

export type OrderedInput<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

export function createOrderedCollection<T extends { id: string; order: number }>(name: string) {
  const ref = collection(db, name);

  function subscribe(onData: (items: T[]) => void, onError: (message: string) => void): Unsubscribe {
    return onSnapshot(
      query(ref, orderBy("order", "asc")),
      (snapshot) =>
        onData(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as FirestoreDoc<T>) }) as T)),
      (error) => onError(mapFirestoreError(error)),
    );
  }

  async function get(id: string): Promise<T | null> {
    const snapshot = await getDoc(doc(ref, id));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...(snapshot.data() as FirestoreDoc<T>) } as T;
  }

  async function list(): Promise<T[]> {
    const snapshot = await getDocs(query(ref, orderBy("order", "asc")));
    return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as FirestoreDoc<T>) }) as T);
  }

  async function nextOrder(): Promise<number> {
    const snapshot = await getDocs(query(ref, orderBy("order", "desc"), limit(1)));
    if (snapshot.empty) return 0;
    return ((snapshot.docs[0].data() as { order?: number }).order ?? 0) + 1;
  }

  async function create(input: OrderedInput<T>): Promise<string> {
    const created = await addDoc(ref, {
      ...clean(input),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    notifySiteRevalidate();
    return created.id;
  }

  async function update(id: string, input: Partial<OrderedInput<T>>): Promise<void> {
    await updateDoc(doc(ref, id), { ...clean(input), updatedAt: serverTimestamp() });
    notifySiteRevalidate();
  }

  async function remove(id: string): Promise<void> {
    await deleteDoc(doc(ref, id));
    notifySiteRevalidate();
  }

  async function persistOrder(orderedIds: readonly string[], field: "order" | "homeOrder" = "order") {
    const batch = writeBatch(db);
    orderedIds.forEach((id, index) => {
      batch.update(doc(ref, id), { [field]: index, updatedAt: serverTimestamp() });
    });
    await batch.commit();
    notifySiteRevalidate();
  }

  return { ref, subscribe, get, list, nextOrder, create, update, remove, persistOrder };
}
