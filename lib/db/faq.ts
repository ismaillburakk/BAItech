/** faq koleksiyonu — client SDK CRUD katmanı. */
import { createOrderedCollection, type OrderedInput } from "@/lib/db/collection";
import { COLLECTIONS, type FaqItem } from "@/types";

export type FaqInput = OrderedInput<FaqItem>;

export const faqDb = createOrderedCollection<FaqItem>(COLLECTIONS.faq);
