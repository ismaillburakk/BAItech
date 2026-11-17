import type { Metadata } from "next";
import ServiceForm from "@/components/admin/services/ServiceForm";

export const metadata: Metadata = { title: "Hizmet" };

export default function Page() {
  return <ServiceForm />;
}
