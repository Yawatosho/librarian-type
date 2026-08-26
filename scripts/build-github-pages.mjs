import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { questions, recommendedGames, results } from "../app/data.ts";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(projectRoot, "github-pages");
const siteUrl = (process.env.SITE_URL || "https://example.com").replace(/\/$/, "");
const template = readFileSync(resolve(projectRoot, "static/result-template.html"), "utf8");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
  });
}

function resultBody(result) {
  const games = result.recommendedGames.map(function (id) { return recommendedGames[id]; });
  const likes = result.likes.map(function (like, index) {
    return '<li><span aria-hidden="true">' + String(index + 1).padStart(2, "0") + '</span>' + escapeHtml(like) + '</li>';
  }).join("");
  const gameCards = games.map(function (game, index) {
    return '<a href="' + escapeHtml(game.href) + '" class="game-card" aria-label="' + escapeHtml(game.title) + '（仮リンク）">' +
      '<span class="game-number">0' + (index + 1) + '</span><span><strong>' + escapeHtml(game.title) + '</strong>' +
      '<small>' + escapeHtml(game.note) + '</small></span><i aria-hidden="true">→</i></a>';
  }).join("");

  return '<main class="result-shell"><article class="result-card">' +
    '<header class="result-header"><a class="mini-brand" href="../../">LIBRARIAN TYPE</a><span>YAWATOSHO GAMES</span></header>' +
    '<section class="result-hero" aria-labelledby="result-name">' +
      '<p class="result-kicker">あなたの図書館員タイプは……</p>' +
      '<h1 id="result-name">' + escapeHtml(result.name) + '</h1>' +
      '<div class="result-illustration" role="img" aria-label="' + escapeHtml(result.name) + 'のイラスト用プレースホルダー" data-illustration="' + escapeHtml(result.illustration) + '">' +
        '<span class="illustration-desk" aria-hidden="true"></span><span class="illustration-book one" aria-hidden="true"></span>' +
        '<span class="illustration-book two" aria-hidden="true"></span><span class="illustration-book three" aria-hidden="true"></span>' +
        '<span class="illustration-note" aria-hidden="true">LIBRARY<br>WORK<br>STYLE</span></div>' +
      '<p class="catch-copy">' + escapeHtml(result.catchCopy) + '</p>' +
      '<p class="result-description">' + escapeHtml(result.description) + '</p></section>' +
    '<section class="likes-section" aria-labelledby="likes-title"><h2 id="likes-title">こんなこと、ちょっと好きかも</h2><ul>' + likes + '</ul></section>' +
    '<p class="disclaimer">※もちろん、だいたいです。<br><small>図書館員あるあるを使った遊びです。</small></p>' +
    '<section class="share-section" aria-labelledby="share-title"><h2 id="share-title">このタイプ、だれかに教える？</h2>' +
      '<div class="share-buttons"><button id="share-button" type="button" class="share-main">結果をシェア <span aria-hidden="true">↗</span></button>' +
      '<a id="x-share" href="https://x.com/" target="_blank" rel="noreferrer" class="share-x">Xで共有</a>' +
      '<button id="copy-button" type="button" class="copy-button" aria-live="polite">URLをコピー</button></div></section>' +
    '<a class="replay-button" href="../../">← もう一度やる</a>' +
    '<section class="games-section" aria-labelledby="games-title"><p class="games-eyebrow">YAWATOSHO GAMES</p>' +
      '<h2 id="games-title">このタイプなら、こんなゲームも。</h2><div class="game-list">' + gameCards + '</div>' +
      '<p class="games-note">※おすすめゲームはMVP用の仮データです。</p></section>' +
    '</article></main>';
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
cpSync(resolve(projectRoot, "public"), outputDir, { recursive: true });
mkdirSync(resolve(outputDir, "assets"), { recursive: true });

const css = readFileSync(resolve(projectRoot, "app/globals.css"), "utf8");
writeFileSync(resolve(outputDir, "assets/styles.css"), css);
cpSync(resolve(projectRoot, "static/quiz.js"), resolve(outputDir, "assets/quiz.js"));
cpSync(resolve(projectRoot, "static/result.js"), resolve(outputDir, "assets/result.js"));
cpSync(resolve(projectRoot, "static/index.html"), resolve(outputDir, "index.html"));

const resultSlugs = Object.fromEntries(results.map(function (result) { return [result.internalCode, result.slug]; }));
writeFileSync(
  resolve(outputDir, "assets/game-data.js"),
  "window.GAME_DATA=" + JSON.stringify({ questions: questions, resultSlugs: resultSlugs }) + ";\n"
);

results.forEach(function (result) {
  const resultDir = resolve(outputDir, "result", result.slug);
  const resultUrl = siteUrl + "/result/" + result.slug + "/";
  const shareTitle = "私は「" + result.name + "」でした。";
  const description = result.catchCopy + " あなたはどの図書館員タイプ？";
  const html = template
    .replaceAll("%%TITLE%%", escapeHtml(shareTitle + " | 図書館員タイプ"))
    .replaceAll("%%SHARE_TITLE%%", escapeHtml(shareTitle))
    .replaceAll("%%META_DESCRIPTION%%", escapeHtml(description))
    .replaceAll("%%RESULT_URL%%", escapeHtml(resultUrl))
    .replaceAll("%%OG_IMAGE%%", escapeHtml(siteUrl + result.ogImage))
    .replace("%%RESULT_BODY%%", '<div data-page="result"></div>' + resultBody(result))
    .replace("<body>", '<body data-result-name="' + escapeHtml(result.name) + '" data-catch-copy="' + escapeHtml(result.catchCopy) + '">');
  mkdirSync(resultDir, { recursive: true });
  writeFileSync(resolve(resultDir, "index.html"), html);
});

writeFileSync(resolve(outputDir, ".nojekyll"), "");
writeFileSync(resolve(outputDir, "robots.txt"), "User-agent: *\nAllow: /\n");
writeFileSync(
  resolve(outputDir, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  ["", ...results.map(function (result) { return "result/" + result.slug + "/"; })]
    .map(function (path) { return "  <url><loc>" + escapeHtml(siteUrl + "/" + path) + "</loc></url>"; }).join("\n") +
  "\n</urlset>\n"
);

console.log("GitHub Pages output: " + outputDir);
console.log("Questions: " + questions.length + " / Result pages: " + results.length);
