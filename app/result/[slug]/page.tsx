import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resultBySlug, results } from "../../data";
import { ResultView } from "../../result-view";

export function generateStaticParams() {
  return results.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = resultBySlug[slug];
  if (!result) return {};
  const title = `私は「${result.name}」でした。`;
  const description = `${result.catchCopy} あなたはどの図書館員タイプ？`;
  return {
    title,
    description,
    alternates: { canonical: `/result/${result.slug}/` },
    openGraph: { title, description, type: "website", url: `/result/${result.slug}/`, images: [{ url: result.ogImage, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [result.ogImage] },
  };
}

export default async function ResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = resultBySlug[slug];
  if (!result) notFound();
  return <ResultView result={result} />;
}
