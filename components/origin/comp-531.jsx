/**
 * Origin UI comp-531 — "timeline, vertical timeline"
 * Kaynak: https://coss.com/origin/r/comp-531.json (@origin/comp-531, ui/timeline)
 * BAI uyarlaması: Hakkımızda › "Yapay zeka modeli geliştirme" süreç adımları
 * (SSS cevabındaki adımlar). Tarih sütunu yerine adım numarası (01–05).
 * Kurallar: hakkimizda.md (sıralı başlık, satır uzunluğu), MASTER (gölgesiz, net hiyerarşi).
 */
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"

/** @param {any} props */
export default function ProcessTimeline({ steps, note }) {
  return (
    <Timeline defaultValue={steps.length} aria-label="Model geliştirme süreci">
      {steps.map((step, i) => (
        <TimelineItem className="sm:group-data-[orientation=vertical]/timeline:ms-24" key={step} step={i + 1}>
          <TimelineHeader>
            <TimelineSeparator className="group-data-completed/timeline-item:bg-brand" />
            <TimelineDate className="tabular font-heading text-brand-ink sm:group-data-[orientation=vertical]/timeline:absolute sm:group-data-[orientation=vertical]/timeline:-left-24 sm:group-data-[orientation=vertical]/timeline:w-14 sm:group-data-[orientation=vertical]/timeline:text-right">
              {String(i + 1).padStart(2, "0")}
            </TimelineDate>
            <TimelineTitle className="font-heading text-base text-foreground sm:-mt-0.5">{step}</TimelineTitle>
            <TimelineIndicator className="group-data-completed/timeline-item:border-brand group-data-completed/timeline-item:bg-brand" />
          </TimelineHeader>
          {i === steps.length - 1 && note ? (
            <TimelineContent className="measure mt-2 text-[0.9375rem] leading-relaxed">{note}</TimelineContent>
          ) : null}
        </TimelineItem>
      ))}
    </Timeline>
  )
}
