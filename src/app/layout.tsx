import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yes or No?",
  description: "Get a random Yes or No answer with a GIF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans">{children}</body>
    </html>
  );
}
