import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { games, questions, results } from "../app/data.ts";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = projectRoot;
const siteUrl = (process.env.SITE_URL || "https://example.com").replace(/\/$/, "");
const template = readFileSync(resolve(projectRoot, "static/result-template.html"), "utf8");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
  });
}

function librarianImage(result) {
  const filename = result.slug === "shelving-tuner" ? "shelving-tuner.webp" : result.slug + "_lib.webp";
  return "/assets/result-ogp/librarian/" + filename;
}

function resultBody(result, rootPrefix, variant) {
  const game = games[result.recommendedGame.gameId];
  const defaultImage = rootPrefix + result.ogImage.replace(/^\/+/, "");
  const alternateImage = rootPrefix + librarianImage(result).replace(/^\/+/, "");
  const toggleLabel = variant === "librarian" ? "通常バージョンのイラストに戻す" : "イラストの別バージョンに切り替える";
  const defaultImageHidden = variant === "librarian" ? ' aria-hidden="true"' : "";
  const alternateImageHidden = variant === "librarian" ? "" : ' aria-hidden="true"';
  const librarianClass = variant === "librarian" ? " is-librarian" : "";
  const likes = result.likes.map(function (like, index) {
    return '<li><span aria-hidden="true">' + String(index + 1).padStart(2, "0") + '</span>' + escapeHtml(like) + '</li>';
  }).join("");
  const gameSubtitle = game.subtitle ? '<p class="game-subtitle">' + escapeHtml(game.subtitle) + '</p>' : "";

  return '<main class="result-shell"><article class="result-card">' +
    '<header class="result-header"><a class="mini-brand" href="' + rootPrefix + '">LIBRARIAN TYPE</a><span>YAWATOSHO GAMES</span></header>' +
    '<section class="result-hero" aria-labelledby="result-name">' +
      '<p class="result-kicker">あなたの図書館員タイプは……</p>' +
      '<h1 id="result-name" class="visually-hidden">' + escapeHtml(result.name) + '</h1>' +
      '<figure class="result-illustration' + librarianClass + '" role="button" tabindex="0" aria-pressed="' + String(variant === "librarian") + '" aria-label="' + toggleLabel + '" data-default-image="' + escapeHtml(defaultImage) + '" data-librarian-image="' + escapeHtml(alternateImage) + '">' +
        '<span class="result-illustration-flipper">' +
          '<img class="result-image-default" src="' + escapeHtml(defaultImage) + '" alt="' + escapeHtml(result.name) + 'のタイプ画像" decoding="async"' + defaultImageHidden + '>' +
          '<img class="result-image-librarian" src="' + escapeHtml(alternateImage) + '" alt="' + escapeHtml(result.name) + 'の司書さんと探偵さんバージョンのタイプ画像" decoding="async"' + alternateImageHidden + '>' +
        '</span>' +
      '</figure>' +
      '<p class="catch-copy">' + escapeHtml(result.catchCopy) + '</p>' +
      '<p class="result-description">' + escapeHtml(result.description) + '</p></section>' +
    '<section id="result-stats" class="result-stats" aria-labelledby="result-stats-title" hidden>' +
      '<p class="result-stats-label">LIVE STATS / みんなの診断結果</p>' +
      '<h2 id="result-stats-title">このタイプだった人</h2>' +
      '<div class="result-stats-main"><strong id="result-stats-percentage"><span id="result-stats-percentage-value"></span><small>%</small></strong></div>' +
      '<div class="result-stats-details">' +
        '<p class="result-stats-count"><span>診断結果</span><strong id="result-stats-count"></strong></p>' +
        '<p class="result-stats-rank"><span>順位</span><strong id="result-stats-rank"></strong></p>' +
      '</div>' +
      '<p class="result-stats-note">これまでに集まった診断結果を集計しています。</p>' +
    '</section>' +
    '<section class="likes-section" aria-labelledby="likes-title"><h2 id="likes-title">こんなこと、ちょっと好きかも</h2><ul>' + likes + '</ul></section>' +
    '<section class="diagnosis-cta" aria-labelledby="diagnosis-cta-title">' +
      '<div class="diagnosis-cta-copy"><p class="diagnosis-cta-label">TYPE CHECK / YOUR TURN</p>' +
        '<h2 id="diagnosis-cta-title">あなたなら、どの図書館員タイプ？</h2></div>' +
      '<a class="diagnosis-cta-button" href="' + rootPrefix + '">診断してみる <span aria-hidden="true">→</span></a>' +
    '</section>' +
    '<section class="share-section" aria-labelledby="share-title"><h2 id="share-title">このタイプ、だれかに教える？</h2>' +
      '<div class="share-buttons"><button id="share-button" type="button" class="share-main">結果をシェア <span aria-hidden="true">↗</span></button>' +
      '<a id="x-share" href="https://x.com/" target="_blank" rel="noreferrer" class="share-x">Xで共有</a>' +
      '<button id="copy-button" type="button" class="copy-button" aria-live="polite">URLをコピー</button></div></section>' +
    '<a class="replay-button" href="' + rootPrefix + '"><span aria-hidden="true">←</span> もう一度診断する</a>' +
    '<section class="games-section" aria-labelledby="games-title"><p class="games-eyebrow">YAWATOSHO GAMES / PICK 01</p>' +
      '<h2 id="games-title">あなたにおすすめのYAWATOSHO GAME</h2>' +
      '<div class="game-feature"><div class="game-identity"><p class="game-number">GAME / 01</p>' +
        '<h3>' + escapeHtml(game.title) + '</h3>' + gameSubtitle + '</div>' +
        '<div class="game-reason"><p class="game-description">' + escapeHtml(game.description) + '</p>' +
          '<p class="game-comment">' + escapeHtml(result.recommendedGame.comment) + '</p>' +
          '<a class="game-play" href="' + escapeHtml(game.href) + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(game.title) + 'を別タブで開く">このゲームで遊ぶ <span aria-hidden="true">→</span></a>' +
        '</div></div></section>' +
    '</article></main>';
}

for (const generatedPath of ["assets", "result", "index.html", "favicon.svg", "favicon-32x32.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "manifest.webmanifest", ".nojekyll", "robots.txt", "sitemap.xml"]) {
  rmSync(resolve(outputDir, generatedPath), { recursive: true, force: true });
}
mkdirSync(resolve(outputDir, "assets"), { recursive: true });
cpSync(resolve(projectRoot, "public/assets"), resolve(outputDir, "assets"), { recursive: true });
cpSync(resolve(projectRoot, "public/favicon.svg"), resolve(outputDir, "favicon.svg"));
cpSync(resolve(projectRoot, "public/favicon-32x32.png"), resolve(outputDir, "favicon-32x32.png"));
cpSync(resolve(projectRoot, "public/apple-touch-icon.png"), resolve(outputDir, "apple-touch-icon.png"));
cpSync(resolve(projectRoot, "public/icon-192.png"), resolve(outputDir, "icon-192.png"));
cpSync(resolve(projectRoot, "public/icon-512.png"), resolve(outputDir, "icon-512.png"));
cpSync(resolve(projectRoot, "public/manifest.webmanifest"), resolve(outputDir, "manifest.webmanifest"));

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

function writeResultPage(result, variant) {
  const isLibrarian = variant === "librarian";
  const rootPrefix = isLibrarian ? "../../../" : "../../";
  const resultDir = resolve(outputDir, "result", result.slug, isLibrarian ? "librarian" : "");
  const resultUrl = siteUrl + "/result/" + result.slug + (isLibrarian ? "/librarian/" : "/");
  const shareTitle = "私は「" + result.name + "」でした。";
  const description = result.catchCopy + " あなたはどの図書館員タイプ？";
  const ogImage = isLibrarian ? librarianImage(result) : result.ogImage;
  const html = template
    .replaceAll("%%TITLE%%", escapeHtml(shareTitle + " | 図書館員タイプ"))
    .replaceAll("%%SHARE_TITLE%%", escapeHtml(shareTitle))
    .replaceAll("%%META_DESCRIPTION%%", escapeHtml(description))
    .replaceAll("%%RESULT_URL%%", escapeHtml(resultUrl))
    .replaceAll("%%OG_IMAGE%%", escapeHtml(siteUrl + ogImage))
    .replaceAll("%%ROOT_PREFIX%%", rootPrefix)
    .replace("%%RESULT_BODY%%", '<div data-page="result"></div>' + resultBody(result, rootPrefix, variant))
    .replace("<body>", '<body data-result-slug="' + escapeHtml(result.slug) + '" data-result-name="' + escapeHtml(result.name) + '" data-catch-copy="' + escapeHtml(result.catchCopy) + '" data-result-variant="' + variant + '">');
  mkdirSync(resultDir, { recursive: true });
  writeFileSync(resolve(resultDir, "index.html"), html);
}

results.forEach(function (result) {
  writeResultPage(result, "default");
  writeResultPage(result, "librarian");
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

console.log("GitHub Pages root: " + outputDir);
console.log("Questions: " + questions.length + " / Result pages: " + (results.length * 2));
