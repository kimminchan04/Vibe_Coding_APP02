import type { AiAdvice } from "@/types";

const styles: Record<AiAdvice["type"], string> = {
  success: "border-success/30 bg-success/5",
  warning: "border-warning/30 bg-warning/5",
  info: "border-accent/30 bg-accent/5",
};

export function AdviceList({ advice }: { advice: AiAdvice[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold">💡 AI 영양 조언</h2>
      {advice.map((item, i) => (
        <div key={i} className={`rounded-2xl border p-4 ${styles[item.type]}`}>
          <p className="mb-1 font-semibold text-text">{item.title}</p>
          <p className="text-sm leading-relaxed text-muted">{item.message}</p>
        </div>
      ))}
    </div>
  );
}
