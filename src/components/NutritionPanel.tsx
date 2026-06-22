import type { NutritionInfo } from "@/types";

type Props = {
  nutrition: NutritionInfo;
};

export function NutritionPanel({ nutrition }: Props) {
  const items = [
    { label: "칼로리", value: `${nutrition.kcal}`, unit: "kcal", color: "text-accent" },
    { label: "단백질", value: `${nutrition.protein}`, unit: "g", color: "text-success" },
    { label: "탄수화물", value: `${nutrition.carbs}`, unit: "g", color: "text-primary" },
    { label: "지방", value: `${nutrition.fat}`, unit: "g", color: "text-warning" },
  ];

  const total = nutrition.protein + nutrition.carbs + nutrition.fat || 1;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">영양·열량</h2>
        <span className="text-xs text-muted">
          {nutrition.source === "api" ? "식약처 API" : "참고용 추정치"} · {nutrition.servingSize}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-bg p-3 text-center">
            <p className="text-xs text-muted">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>
              {item.value}
              <span className="text-sm font-normal">{item.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mb-2 flex h-3 overflow-hidden rounded-full">
        <div
          className="bg-success"
          style={{ width: `${(nutrition.protein / total) * 100}%` }}
        />
        <div
          className="bg-primary"
          style={{ width: `${(nutrition.carbs / total) * 100}%` }}
        />
        <div
          className="bg-warning"
          style={{ width: `${(nutrition.fat / total) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>단백질</span>
        <span>탄수</span>
        <span>지방</span>
      </div>

      <p className="mt-3 text-sm text-muted">나트륨 {nutrition.sodium}mg</p>
    </div>
  );
}
