import type { Metadata } from "next";
import ProjectForm from "@/components/admin/projects/ProjectForm";

export const metadata: Metadata = { title: "Proje — düzenle" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectForm projectId={id} />;
}
