/**
 * submissions koleksiyonu — admin tarafı okuma/işaretleme/silme katmanı.
 * Kayıt OLUŞTURMA public iletişim formundadır (components/site/contact-form).
 */
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { mapFirestoreError } from "@/lib/db/common";
import { COLLECTIONS, type FirestoreDoc, type Submission } from "@/types";

const submissionsCollection = collection(db, COLLECTIONS.submissions);

export function subscribeToSubmissions(
  onData: (submissions: Submission[]) => void,
  onError: (message: string) => void,
): Unsubscribe {
  return onSnapshot(
    query(submissionsCollection, orderBy("createdAt", "desc")),
    (snapshot) =>
      onData(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as FirestoreDoc<Submission>) }) as Submission)),
    (error) => onError(mapFirestoreError(error)),
  );
}

export function subscribeToUnreadCount(onCount: (count: number) => void): Unsubscribe {
  return onSnapshot(
    query(submissionsCollection, where("isRead", "==", false)),
    (snapshot) => onCount(snapshot.size),
    () => onCount(0),
  );
}

export async function setSubmissionRead(id: string, isRead: boolean): Promise<void> {
  await updateDoc(doc(submissionsCollection, id), { isRead });
}

export async function deleteSubmission(id: string): Promise<void> {
  await deleteDoc(doc(submissionsCollection, id));
}
