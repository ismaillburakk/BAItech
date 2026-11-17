import type { Metadata } from "next";
import SiteSettingsForm from "@/components/admin/settings/SiteSettingsForm";

export const metadata: Metadata = { title: "Site Ayarları" };

export default function Page() {
  return <SiteSettingsForm />;
}
