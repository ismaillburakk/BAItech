/** teamMembers koleksiyonu — client SDK CRUD katmanı. */
import { createOrderedCollection, type OrderedInput } from "@/lib/db/collection";
import { COLLECTIONS, type TeamMember } from "@/types";

export type TeamMemberInput = OrderedInput<TeamMember>;

export const teamMembersDb = createOrderedCollection<TeamMember>(COLLECTIONS.teamMembers);
