import type { Metadata } from "next";
import ServiceList from "@/components/admin/services/ServiceList";

export const metadata: Metadata = { title: "Hizmetler" };

export default function Page() {
  return <ServiceList />;
}
