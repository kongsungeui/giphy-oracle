"use client";

import { useState } from "react";

type AnswerType = "yes" | "no" | "maybe";

interface ApiResponse {
  answer: AnswerType;
  forced: boolean;
  image: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = async (type: "yes" | "no" | "random") => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let url = "https://yesno.wtf/api";
      if (type !== "random") {
        url += `?force=${type}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      const data: ApiResponse = await response.json();
      setResult(data);
    } catch {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const getAnswerColor = (answer: AnswerType) => {
    switch (answer) {
      case "yes":
        return "text-indigo-500";
      case "no":
        return "text-rose-500";
      case "maybe":
        return "text-cyan-400";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex justify-center items-center p-5">
      <div className="bg-white rounded-2xl p-10 shadow-2xl max-w-[600px] w-full text-center">
        <h1 className="text-gray-800 mb-8 text-4xl font-bold">Yes or No?</h1>

        <div className="flex gap-4 justify-center flex-wrap mb-8">
          <button
            onClick={() => askQuestion("yes")}
            className="px-8 py-4 text-lg font-bold border-none rounded-xl cursor-pointer transition-all duration-300 uppercase tracking-wider bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5"
          >
            Yes
          </button>
          <button
            onClick={() => askQuestion("no")}
            className="px-8 py-4 text-lg font-bold border-none rounded-xl cursor-pointer transition-all duration-300 uppercase tracking-wider bg-gradient-to-br from-fuchsia-400 to-rose-500 text-white hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5"
          >
            No
          </button>
          <button
            onClick={() => askQuestion("random")}
            className="px-8 py-4 text-lg font-bold border-none rounded-xl cursor-pointer transition-all duration-300 uppercase tracking-wider bg-gradient-to-br from-sky-400 to-cyan-400 text-white hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5"
          >
            Random
          </button>
        </div>

        <div className="mt-8 min-h-[100px]">
          {loading && (
            <div className="text-2xl text-indigo-500 animate-pulse-loading">
              Deciding...
            </div>
          )}

          {error && (
            <div className="text-rose-500 text-lg p-5 bg-rose-50 rounded-xl">
              {error}
            </div>
          )}

          {result && (
            <>
              <div
                className={`text-5xl font-bold mb-5 uppercase animate-fadeIn ${getAnswerColor(result.answer)}`}
              >
                {result.answer}
              </div>
              <div className="mt-5 rounded-xl overflow-hidden animate-fadeIn">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.image}
                  alt={result.answer}
                  className="max-w-full h-auto rounded-xl"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
