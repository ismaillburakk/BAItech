import type { Metadata } from "next";
import ReferenceList from "@/components/admin/references/ReferenceList";

export const metadata: Metadata = { title: "Referanslar" };

export default function Page() {
  return <ReferenceList />;
}
