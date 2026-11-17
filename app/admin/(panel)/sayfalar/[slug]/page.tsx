import type { Metadata } from "next";
import PageForm from "@/components/admin/pages/PageForm";

export const metadata: Metadata = { title: "Sayfa düzenle" };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PageForm slug={slug} />;
}
