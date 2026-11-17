/** references koleksiyonu (referanslar / müşteri logoları) — client SDK CRUD katmanı. */
import { createOrderedCollection, type OrderedInput } from "@/lib/db/collection";
import { COLLECTIONS, type Reference } from "@/types";

export type ReferenceInput = OrderedInput<Reference>;

export const referencesDb = createOrderedCollection<Reference>(COLLECTIONS.references);
