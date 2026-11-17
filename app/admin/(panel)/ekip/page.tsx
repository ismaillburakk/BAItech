import type { Metadata } from "next";
import TeamList from "@/components/admin/team/TeamList";

export const metadata: Metadata = { title: "Ekip" };

export default function Page() {
  return <TeamList />;
}
