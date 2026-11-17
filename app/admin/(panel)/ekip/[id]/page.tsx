import type { Metadata } from "next";
import TeamForm from "@/components/admin/team/TeamForm";

export const metadata: Metadata = { title: "Ekip üyesi — düzenle" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TeamForm memberId={id} />;
}
