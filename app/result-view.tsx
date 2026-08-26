"use client";

import { useEffect, useState } from "react";
import { recommendedGames, type Result } from "./data";

export function ResultView({ result }: { result: Result }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => setShareUrl(window.location.href), []);

  const shareText = `私は「${result.name}」でした。\n\n${result.catchCopy}\n\nあなたはどの図書館員タイプ？\n#図書館員タイプ`;

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `あなたはどの図書館員タイプ？`, text: shareText, url: shareUrl }); } catch { /* キャンセルは何もしない */ }
    } else {
      await copyUrl();
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("このURLをコピーしてください", shareUrl);
    }
  };

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const games = result.recommendedGames.map((id) => recommendedGames[id as keyof typeof recommendedGames]);

  return (
    <main className="result-shell">
      <article className="result-card">
        <header className="result-header"><a className="mini-brand" href="/">LIBRARIAN TYPE</a><span>YAWATOSHO GAMES</span></header>
        <section className="result-hero" aria-labelledby="result-name">
          <p className="result-kicker">あなたの図書館員タイプは……</p>
          <h1 id="result-name">{result.name}</h1>
          <div className="result-illustration" role="img" aria-label={`${result.name}のイラスト用プレースホルダー`} data-illustration={result.illustration}>
            <span className="illustration-desk" aria-hidden="true" />
            <span className="illustration-book one" aria-hidden="true" /><span className="illustration-book two" aria-hidden="true" /><span className="illustration-book three" aria-hidden="true" />
            <span className="illustration-note" aria-hidden="true">LIBRARY<br />WORK<br />STYLE</span>
          </div>
          <p className="catch-copy">{result.catchCopy}</p>
          <p className="result-description">{result.description}</p>
        </section>

        <section className="likes-section" aria-labelledby="likes-title">
          <h2 id="likes-title">こんなこと、ちょっと好きかも</h2>
          <ul>{result.likes.map((like, index) => <li key={like}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{like}</li>)}</ul>
        </section>

        <p className="disclaimer">※もちろん、だいたいです。<br /><small>図書館員あるあるを使った遊びです。</small></p>

        <section className="share-section" aria-labelledby="share-title">
          <h2 id="share-title">このタイプ、だれかに教える？</h2>
          <div className="share-buttons">
            <button type="button" onClick={share} className="share-main">結果をシェア <span aria-hidden="true">↗</span></button>
            <a href={xUrl} target="_blank" rel="noreferrer" className="share-x">Xで共有</a>
            <button type="button" onClick={copyUrl} className="copy-button" aria-live="polite">{copied ? "コピーしました！" : "URLをコピー"}</button>
          </div>
        </section>

        <a className="replay-button" href="/">← もう一度やる</a>

        <section className="games-section" aria-labelledby="games-title">
          <p className="games-eyebrow">YAWATOSHO GAMES</p>
          <h2 id="games-title">このタイプなら、こんなゲームも。</h2>
          <div className="game-list">{games.map((game, index) => (
            <a href={game.href} key={game.title} className="game-card" aria-label={`${game.title}（仮リンク）`}>
              <span className="game-number">0{index + 1}</span><span><strong>{game.title}</strong><small>{game.note}</small></span><i aria-hidden="true">→</i>
            </a>
          ))}</div>
          <p className="games-note">※おすすめゲームはMVP用の仮データです。</p>
        </section>
      </article>
    </main>
  );
}
