import type { Metadata } from "next";
import ReferenceForm from "@/components/admin/references/ReferenceForm";

export const metadata: Metadata = { title: "Referans — düzenle" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReferenceForm referenceId={id} />;
}
