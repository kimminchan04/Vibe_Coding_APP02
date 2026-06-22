import type { AiAdvice, NutritionInfo } from "@/types";

type DailyTotals = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

const DAILY_GOALS = {
  kcal: 2000,
  protein: 60,
  carbs: 250,
  fat: 65,
};

function ruleBasedAdvice(nutrition: NutritionInfo, daily?: DailyTotals): AiAdvice[] {
  const advice: AiAdvice[] = [];

  if (nutrition.protein >= 20) {
    advice.push({
      type: "success",
      title: "단백질 충분",
      message: "이 메뉴는 단백질이 풍부해요. 운동 후 식사로도 좋습니다.",
    });
  } else if (nutrition.protein < 15) {
    advice.push({
      type: "warning",
      title: "단백질이 부족합니다",
      message: "단백질 섭취가 부족해요. 돈까스·제육·닭 메뉴를 함께 고려해 보세요.",
    });
  }

  if (nutrition.kcal >= 700) {
    advice.push({
      type: "warning",
      title: "칼로리가 높아요",
      message: "한 끼 기준 칼로리가 높은 편이에요. 저녁은 가벼운 메뉴를 추천합니다.",
    });
  } else if (nutrition.kcal <= 400) {
    advice.push({
      type: "info",
      title: "가벼운 한 끼",
      message: "칼로리가 낮은 메뉴예요. 간식이나 단백질 보충을 고려해 보세요.",
    });
  }

  if (nutrition.sodium >= 1000) {
    advice.push({
      type: "warning",
      title: "나트륨 주의",
      message: "나트륨 함량이 높아요. 물을 충분히 마시고 짠 반찬은 줄여보세요.",
    });
  }

  if (nutrition.fat >= 30) {
    advice.push({
      type: "info",
      title: "지방 함량 안내",
      message: "지방 함량이 다소 높아요. 야채 반찬을 곁들이면 균형에 도움이 됩니다.",
    });
  }

  if (daily) {
    const remainingProtein = DAILY_GOALS.protein - daily.protein;
    if (remainingProtein > 30) {
      advice.push({
        type: "info",
        title: "오늘 단백질 목표",
        message: `오늘 단백질 ${Math.round(daily.protein)}g 섭취 중. ${Math.round(remainingProtein)}g 더 필요해요.`,
      });
    }

    const remainingKcal = DAILY_GOALS.kcal - daily.kcal;
    if (remainingKcal < 400 && remainingKcal > 0) {
      advice.push({
        type: "info",
        title: "오늘 칼로리 거의 충족",
        message: `남은 칼로리 약 ${Math.round(remainingKcal)}kcal. 가벼운 메뉴를 추천해요.`,
      });
    }
  }

  if (advice.length === 0) {
    advice.push({
      type: "success",
      title: "균형 잡힌 선택",
      message: "전반적으로 균형 잡힌 메뉴예요. 맛있게 드세요!",
    });
  }

  return advice.slice(0, 4);
}

async function openAiAdvice(nutrition: NutritionInfo, menuName: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "당신은 대진대학교 학생을 위한 영양 조언 AI입니다. 한국어로 2문장 이내, 친근하게 조언하세요.",
          },
          {
            role: "user",
            content: `메뉴: ${menuName}, 칼로리: ${nutrition.kcal}kcal, 단백질: ${nutrition.protein}g, 탄수: ${nutrition.carbs}g, 지방: ${nutrition.fat}g. 이 메뉴에 대한 실용적인 조언을 해주세요.`,
          },
        ],
        max_tokens: 150,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

export async function generateAiAdvice(
  nutrition: NutritionInfo,
  menuName: string,
  daily?: DailyTotals,
): Promise<AiAdvice[]> {
  const advice = ruleBasedAdvice(nutrition, daily);

  const aiText = await openAiAdvice(nutrition, menuName);
  if (aiText) {
    advice.unshift({
      type: "info",
      title: "AI 맞춤 조언",
      message: aiText,
    });
  }

  return advice;
}

export { DAILY_GOALS };
