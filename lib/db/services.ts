/** services koleksiyonu — client SDK CRUD katmanı. */
import { createOrderedCollection, type OrderedInput } from "@/lib/db/collection";
import { COLLECTIONS, type Service } from "@/types";

export type ServiceInput = OrderedInput<Service>;

export const servicesDb = createOrderedCollection<Service>(COLLECTIONS.services);

export function servicePublicIds(s: Pick<Service, "images">): string[] {
  return s.images.map((image) => image.public_id);
}
