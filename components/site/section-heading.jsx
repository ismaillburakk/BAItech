import { Reveal } from "@/components/motion/reveal"
import { Eyebrow } from "@/components/site/eyebrow"
import { cn } from "@/lib/utils"

/** @param {any} props */
export function SectionHeading({ index, eyebrow, title, description, as: H = "h2", className, align = "left" }) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <Eyebrow index={index}>{eyebrow}</Eyebrow> : null}
      {title ? (
        <H className="mt-5 text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-tight">{title}</H>
      ) : null}
      {description ? <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{description}</p> : null}
    </Reveal>
  )
}
