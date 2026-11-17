import type { Metadata } from "next";
import FaqForm from "@/components/admin/faq/FaqForm";

export const metadata: Metadata = { title: "Soru — düzenle" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FaqForm faqId={id} />;
}
