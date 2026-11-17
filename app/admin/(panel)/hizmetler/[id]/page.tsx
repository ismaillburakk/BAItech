import type { Metadata } from "next";
import ServiceForm from "@/components/admin/services/ServiceForm";

export const metadata: Metadata = { title: "Hizmet — düzenle" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ServiceForm serviceId={id} />;
}
