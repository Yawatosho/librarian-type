(function () {
  "use strict";

  var shareButton = document.getElementById("share-button");
  var copyButton = document.getElementById("copy-button");
  var xLink = document.getElementById("x-share");
  var illustration = document.querySelector(".result-illustration");
  if (!shareButton || !copyButton || !xLink || !illustration) return;

  Array.prototype.forEach.call(document.querySelectorAll("a[href]"), function (link) {
    var href = link.getAttribute("href");
    if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) return;
    link.href = new URL(href, window.location.href).href;
  });

  var name = document.body.getAttribute("data-result-name");
  var catchCopy = document.body.getAttribute("data-catch-copy");
  var variant = document.body.getAttribute("data-result-variant") === "librarian" ? "librarian" : "default";
  var defaultImageElement = illustration.querySelector(".result-image-default");
  var librarianImageElement = illustration.querySelector(".result-image-librarian");
  var defaultImage = new URL(illustration.getAttribute("data-default-image"), window.location.href).href;
  var librarianImage = new URL(illustration.getAttribute("data-librarian-image"), window.location.href).href;
  var defaultUrl = variant === "librarian" ? new URL("../", window.location.href).href : window.location.href;
  var librarianUrl = variant === "librarian" ? window.location.href : new URL("librarian/", window.location.href).href;
  var shareText = "図書館員タイプ、私は\n「" + name + "」でした。\n\n" + catchCopy + "\n\nあなたはどの図書館員タイプ？\n#図書館員タイプ";

  function currentShareUrl() {
    return variant === "librarian" ? librarianUrl : defaultUrl;
  }

  function updateShareLink() {
    xLink.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText) + "&url=" + encodeURIComponent(currentShareUrl());
  }

  function updateVariant(nextVariant) {
    variant = nextVariant;
    var nextUrl = currentShareUrl();
    var nextImage = variant === "librarian" ? librarianImage : defaultImage;
    document.body.setAttribute("data-result-variant", variant);
    illustration.classList.toggle("is-librarian", variant === "librarian");
    illustration.setAttribute("aria-pressed", String(variant === "librarian"));
    illustration.setAttribute("aria-label", variant === "librarian" ? "通常バージョンのイラストに戻す" : "イラストの別バージョンに切り替える");
    defaultImageElement.setAttribute("aria-hidden", String(variant === "librarian"));
    librarianImageElement.setAttribute("aria-hidden", String(variant !== "librarian"));
    document.querySelector('link[rel="canonical"]').href = nextUrl;
    document.querySelector('meta[property="og:url"]').content = nextUrl;
    document.querySelector('meta[property="og:image"]').content = nextImage;
    document.querySelector('meta[name="twitter:image"]').content = nextImage;
    window.history.replaceState(null, "", nextUrl);
    updateShareLink();
  }

  function toggleIllustration() {
    updateVariant(variant === "librarian" ? "default" : "librarian");
  }

  updateShareLink();
  illustration.addEventListener("click", toggleIllustration);
  illustration.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleIllustration();
  });

  function copyUrl() {
    var shareUrl = currentShareUrl();
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl).then(function () {
        copyButton.textContent = "コピーしました！";
        window.setTimeout(function () { copyButton.textContent = "URLをコピー"; }, 1800);
      });
      return;
    }
    window.prompt("このURLをコピーしてください", shareUrl);
  }

  shareButton.addEventListener("click", function () {
    var shareUrl = currentShareUrl();
    if (navigator.share) {
      navigator.share({ title: "あなたはどの図書館員タイプ？", text: shareText, url: shareUrl }).catch(function () {});
      return;
    }
    copyUrl();
  });
  copyButton.addEventListener("click", copyUrl);

  function loadResultStats() {
    var statsEndpoint = "https://script.google.com/macros/s/AKfycbzmlEHb4dOdx09HqzfwEkupO-1f3VuaSPxPHXBnKcSyjyIwpGCphybdzAkY6ruChPWj/exec";
    var resultSlug = document.body.getAttribute("data-result-slug");
    var statsSection = document.getElementById("result-stats");
    var percentageElement = document.getElementById("result-stats-percentage");
    var percentageValueElement = document.getElementById("result-stats-percentage-value");
    var countElement = document.getElementById("result-stats-count");
    var rankElement = document.getElementById("result-stats-rank");
    if (!resultSlug || !statsSection || !percentageElement || !percentageValueElement || !countElement || !rankElement) return;

    var script = document.createElement("script");
    var settled = false;
    var timeoutId;

    function isFiniteNumber(value) {
      return typeof value === "number" && isFinite(value);
    }

    function isWholeNumber(value) {
      return isFiniteNumber(value) && value >= 0 && Math.floor(value) === value;
    }

    function formatInteger(value) {
      return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function cleanup() {
      window.clearTimeout(timeoutId);
      script.onerror = null;
      if (script.parentNode) script.parentNode.removeChild(script);
      window.__LIBRARIAN_TYPE_STATS__ = function () {};
    }

    function failSilently() {
      if (settled) return;
      settled = true;
      cleanup();
    }

    window.__LIBRARIAN_TYPE_STATS__ = function (data) {
      if (settled) return;
      settled = true;

      try {
        var total = data && data.total;
        var types = data && data.types;
        var stat = types && typeof types === "object" ? types[resultSlug] : null;
        var count = stat && stat.count;
        var percentage = stat && stat.percentage;
        var rank = stat && stat.rank;
        var isValid =
          isWholeNumber(total) && total > 0 &&
          isWholeNumber(count) && count <= total &&
          isFiniteNumber(percentage) && percentage >= 0 && percentage <= 100 &&
          isWholeNumber(rank) && rank >= 1 && rank <= 16;

        if (isValid) {
          percentageValueElement.textContent = percentage.toFixed(1);
          countElement.textContent = formatInteger(count) + " / " + formatInteger(total) + "件";
          rankElement.textContent = "16タイプ中 " + rank + "位";
          statsSection.hidden = false;
        }
      } catch (error) {}

      cleanup();
    };

    script.async = true;
    script.onerror = failSilently;
    script.src = statsEndpoint + "?v=" + Math.floor(Date.now() / 300000);
    timeoutId = window.setTimeout(failSilently, 8000);
    document.head.appendChild(script);
  }

  loadResultStats();
}());
