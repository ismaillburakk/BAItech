import type { Metadata } from "next";
import SubmissionList from "@/components/admin/inbox/SubmissionList";

export const metadata: Metadata = { title: "Gelen Kutusu" };

export default function Page() {
  return <SubmissionList />;
}
