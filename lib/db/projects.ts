/** projects koleksiyonu — client SDK CRUD katmanı. */
import { getDocs, query, where } from "firebase/firestore";
import { createOrderedCollection, type OrderedInput } from "@/lib/db/collection";
import { COLLECTIONS, type Project } from "@/types";

export type ProjectInput = OrderedInput<Project>;

export const projectsDb = createOrderedCollection<Project>(COLLECTIONS.projects);

/** Slug başka bir projede kullanılıyor mu? (düzenlemede kendisi hariç) */
export async function isProjectSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const snapshot = await getDocs(query(projectsDb.ref, where("slug", "==", slug)));
  return snapshot.docs.some((d) => d.id !== excludeId);
}

/** Bir projedeki tüm Cloudinary public_id'leri (öksüz görsel temizliği için) */
export function projectPublicIds(p: Pick<Project, "coverImage" | "gallery">): string[] {
  return [
    ...(p.coverImage ? [p.coverImage.public_id] : []),
    ...p.gallery.flatMap((tab) => tab.images.map((image) => image.public_id)),
  ];
}
