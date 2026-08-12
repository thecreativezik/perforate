import type { Grade } from "@/lib/types";

export function EmptyStamp({ grade, accent }: { grade: Grade; accent: string }) {
  return (
    <div className="empty-stamp" style={{ "--stamp-accent": accent } as React.CSSProperties}>
      <div className="empty-stamp-picture">
        <div className="empty-stamp-rays" />
        <div className="empty-stamp-coin">{grade}</div>
      </div>
      <div className="empty-stamp-copy">
        <span>New edition</span>
        <strong>Waiting for artwork</strong>
        <small>Generated images land here</small>
      </div>
    </div>
  );
}
