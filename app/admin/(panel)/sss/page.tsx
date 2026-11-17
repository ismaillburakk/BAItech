import type { Metadata } from "next";
import FaqList from "@/components/admin/faq/FaqList";

export const metadata: Metadata = { title: "SSS" };

export default function Page() {
  return <FaqList />;
}
