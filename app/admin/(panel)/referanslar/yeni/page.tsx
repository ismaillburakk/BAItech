import type { Metadata } from "next";
import ReferenceForm from "@/components/admin/references/ReferenceForm";

export const metadata: Metadata = { title: "Referans" };

export default function Page() {
  return <ReferenceForm />;
}
