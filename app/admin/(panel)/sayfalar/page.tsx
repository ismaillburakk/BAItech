import type { Metadata } from "next";
import PageList from "@/components/admin/pages/PageList";

export const metadata: Metadata = { title: "Sayfalar" };

export default function Page() {
  return <PageList />;
}
