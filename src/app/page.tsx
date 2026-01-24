"use client";

import { useState } from "react";

interface TarotImage {
  id: number;
  webformatURL: string;
  tags: string;
}

interface Fortune {
  card1: string;
  card2: string;
  card3: string;
  summary: string;
}

interface TarotResponse {
  images: TarotImage[];
  fortune: Fortune;
}

const CARD_LABELS = ["과거", "현재", "미래"];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [images, setImages] = useState<TarotImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const drawTarot = async () => {
    setLoading(true);
    setError(null);
    setFortune(null);
    setImages([]);

    try {
      const response = await fetch("/api/tarot");

      if (!response.ok) {
        throw new Error("타로 카드를 뽑을 수 없습니다");
      }

      const data: TarotResponse = await response.json();
      setImages(data.images);
      setFortune(data.fortune);
    } catch {
      setError("운세를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const getCardFortune = (index: number): string => {
    if (!fortune) return "";
    const keys = ["card1", "card2", "card3"] as const;
    return fortune[keys[index]];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex justify-center items-center p-5">
      <div className="bg-gradient-to-br from-purple-800/30 to-indigo-900/30 backdrop-blur-sm rounded-3xl p-10 shadow-2xl max-w-[900px] w-full text-center border border-purple-500/20">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
            🔮 타로 오라클 🔮
          </h1>
          <p className="text-purple-200 text-lg">
            카드를 뽑아 오늘의 운세를 확인하세요
          </p>
        </div>

        <button
          onClick={drawTarot}
          disabled={loading}
          className="px-12 py-5 text-xl font-bold border-2 border-purple-400 rounded-2xl cursor-pointer transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/50 active:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
        >
          {loading ? "🌙 카드를 뽑는 중..." : "✨ 카드 뽑기 ✨"}
        </button>

        <div className="mt-8 min-h-[200px]">
          {error && (
            <div className="text-rose-300 text-lg p-5 bg-rose-500/20 rounded-xl border border-rose-500/30">
              {error}
            </div>
          )}

          {fortune && images.length === 3 && (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {images.map((image, index) => (
                  <div key={image.id} className="flex flex-col">
                    <div className="text-purple-300 font-bold mb-2 text-lg">
                      {CARD_LABELS[index]}
                    </div>
                    <div className="rounded-xl overflow-hidden border-2 border-purple-400/30 shadow-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.webformatURL}
                        alt={image.tags}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="mt-3 p-3 bg-purple-900/40 rounded-lg border border-purple-500/20 text-purple-100 text-sm leading-relaxed">
                      {getCardFortune(index)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xl font-bold text-purple-200 p-5 bg-purple-500/20 rounded-xl border border-purple-400/30">
                {fortune.summary}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
