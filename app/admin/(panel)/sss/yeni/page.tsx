import type { Metadata } from "next";
import FaqForm from "@/components/admin/faq/FaqForm";

export const metadata: Metadata = { title: "Soru" };

export default function Page() {
  return <FaqForm />;
}
