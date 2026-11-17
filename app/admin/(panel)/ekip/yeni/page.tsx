import type { Metadata } from "next";
import TeamForm from "@/components/admin/team/TeamForm";

export const metadata: Metadata = { title: "Ekip üyesi" };

export default function Page() {
  return <TeamForm />;
}
