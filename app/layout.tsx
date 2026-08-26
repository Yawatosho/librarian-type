import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "あなたはどの図書館員タイプ？ | YAWATOSHO GAMES",
  description: "12の質問から、あなたの図書館員タイプを勝手に分類します。",
  openGraph: {
    title: "あなたはどの図書館員タイプ？",
    description: "12の質問から、あなたの図書館員タイプを勝手に分類します。",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "あなたはどの図書館員タイプ？", description: "12の質問から、図書館員タイプを勝手に分類。" },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ja"><body>{children}</body></html>;
}
