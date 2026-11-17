"use client"

/**
 * Origin UI comp-446 — "breadcrumb" (dropdown'lı üç nokta)
 * Kaynak: https://coss.com/origin/r/comp-446.json (@origin/comp-446)
 * BAI uyarlaması: Proje detay › Ana Sayfa / Projeler / [diğer projeler ▾] / Mevcut.
 * Üç nokta menüsü kardeş projelere hızlı geçiş verir.
 * Kurallar: proje-detay.md, skill breadcrumb-web (3+ seviye), back-behavior.
 */
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/** @param {any} props */
export default function ProjectBreadcrumb({ current, siblings }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="inline-flex min-h-11 items-center">Ana Sayfa</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/projeler" className="inline-flex min-h-11 items-center">Projeler</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex size-11 items-center justify-center rounded-md hover:bg-accent hover:text-foreground">
              <BreadcrumbEllipsis />
              <span className="sr-only">Diğer projeler</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {siblings.map((p) => (
                <DropdownMenuItem asChild key={p.slug}>
                  <Link href={`/projeler/${p.slug}`} className="min-h-11">{p.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
