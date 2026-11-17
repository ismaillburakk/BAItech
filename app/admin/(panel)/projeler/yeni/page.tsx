import type { Metadata } from "next";
import ProjectForm from "@/components/admin/projects/ProjectForm";

export const metadata: Metadata = { title: "Proje" };

export default function Page() {
  return <ProjectForm />;
}
