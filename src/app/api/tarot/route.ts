import { NextResponse } from "next/server";

export const runtime = "edge";

interface PixabayImage {
  id: number;
  webformatURL: string;
  tags: string;
}

interface PixabayResponse {
  hits: PixabayImage[];
}

const TAROT_KEYWORDS = [
  "mystical",
  "tarot",
  "fortune",
  "magic",
  "stars night",
  "moon sky",
  "crystal ball",
  "zodiac",
  "celestial",
  "astrology",
  "spiritual",
  "oracle",
];

export async function GET() {
  try {
    // 1. Pixabay에서 이미지 가져오기
    const keyword =
      TAROT_KEYWORDS[Math.floor(Math.random() * TAROT_KEYWORDS.length)];
    const pixabayKey = process.env.PIXABAY_API_KEY;

    const pixabayResponse = await fetch(
      `https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(keyword)}&image_type=photo&per_page=5&safesearch=true`
    );

    if (!pixabayResponse.ok) {
      throw new Error("Failed to fetch images");
    }

    const pixabayData: PixabayResponse = await pixabayResponse.json();

    if (!pixabayData.hits || pixabayData.hits.length < 3) {
      throw new Error("Not enough images");
    }

    const shuffled = pixabayData.hits.sort(() => Math.random() - 0.5);
    const selectedImages = shuffled.slice(0, 3);

    // 2. Anthropic API로 점괘 생성 (fetch 직접 사용 - Edge 호환)
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    const anthropicResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [
            {
              role: "user",
              content: `당신은 신비로운 타로 점술사입니다. 세 장의 타로 카드를 뽑았습니다.

첫 번째 카드 (과거): ${selectedImages[0].tags}
두 번째 카드 (현재): ${selectedImages[1].tags}
세 번째 카드 (미래): ${selectedImages[2].tags}

각 카드의 이미지 태그를 바탕으로 타로 해석을 해주세요.

반드시 아래 JSON 형식으로만 응답해주세요:
{
  "card1": "첫 번째 카드 해석 (1-2문장, 이모지 포함)",
  "card2": "두 번째 카드 해석 (1-2문장, 이모지 포함)",
  "card3": "세 번째 카드 해석 (1-2문장, 이모지 포함)",
  "summary": "세 카드를 종합한 오늘의 운세 (2-3문장, 이모지 포함)"
}`,
            },
          ],
        }),
      }
    );

    if (!anthropicResponse.ok) {
      throw new Error("Failed to generate fortune");
    }

    const anthropicData = await anthropicResponse.json();
    const responseText = anthropicData.content[0]?.text || "";

    // JSON 파싱
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse fortune");
    }

    const fortune = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      images: selectedImages.map((img) => ({
        id: img.id,
        webformatURL: img.webformatURL,
        tags: img.tags,
      })),
      fortune,
    });
  } catch (error) {
    console.error("Tarot API error:", error);
    return NextResponse.json(
      { error: "Failed to draw tarot cards" },
      { status: 500 }
    );
  }
}
