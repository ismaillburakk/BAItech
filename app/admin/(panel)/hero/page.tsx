import type { Metadata } from "next";
import HeroForm from "@/components/admin/hero/HeroForm";

export const metadata: Metadata = { title: "Hero" };

export default function Page() {
  return <HeroForm />;
}
