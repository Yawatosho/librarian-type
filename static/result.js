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

  var JSONP_AUTHUSER_FALLBACKS = [null, "0", "1", "2", "3"];

  function withAuthuserFallback(url, authuser) {
    if (authuser === null || /[?&]authuser=/.test(url)) return url;
    var separator = url.indexOf("?") !== -1 ? "&" : "?";
    return url + separator + "authuser=" + encodeURIComponent(authuser);
  }

  function fetchJSONPAttempt(url, timeout) {
    return new Promise(function (resolve, reject) {
      var callbackName = "__librarianTypeStats_" + Date.now() + "_" + Math.random().toString(36).slice(2);
      var separator = url.indexOf("?") !== -1 ? "&" : "?";
      var script = document.createElement("script");
      var timer = null;
      var settled = false;

      function cleanup() {
        if (timer) window.clearTimeout(timer);
        script.onerror = null;
        if (script.parentNode) script.parentNode.removeChild(script);
        window[callbackName] = function () {};
        window.setTimeout(function () {
          try { delete window[callbackName]; } catch (error) {}
        }, 30000);
      }

      window[callbackName] = function (data) {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(data);
      };

      script.onerror = function () {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error("JSONP request failed: " + script.src));
      };

      timer = window.setTimeout(function () {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error("JSONP request timed out: " + script.src));
      }, timeout);

      script.src = url + separator + "callback=" + encodeURIComponent(callbackName);
      script.async = true;
      document.head.appendChild(script);
    });
  }

  function fetchJSONP(url, timeout) {
    timeout = timeout || 5000;
    var index = 0;
    var errors = [];

    function attemptNext() {
      if (index >= JSONP_AUTHUSER_FALLBACKS.length) {
        return Promise.reject(new Error(errors.join(" / ")));
      }

      var authuser = JSONP_AUTHUSER_FALLBACKS[index++];
      var attemptUrl = withAuthuserFallback(url, authuser);
      return fetchJSONPAttempt(attemptUrl, timeout).catch(function (error) {
        errors.push(error.message);
        return attemptNext();
      });
    }

    return attemptNext();
  }

  function loadResultStats() {
    var statsEndpoint = "https://script.google.com/macros/s/AKfycbzmlEHb4dOdx09HqzfwEkupO-1f3VuaSPxPHXBnKcSyjyIwpGCphybdzAkY6ruChPWj/exec";
    var resultSlug = document.body.getAttribute("data-result-slug");
    var statsSection = document.getElementById("result-stats");
    var percentageElement = document.getElementById("result-stats-percentage");
    var percentageValueElement = document.getElementById("result-stats-percentage-value");
    var countElement = document.getElementById("result-stats-count");
    var rankElement = document.getElementById("result-stats-rank");
    if (!resultSlug || !statsSection || !percentageElement || !percentageValueElement || !countElement || !rankElement) return;
    if (typeof window.Promise !== "function") return;

    function isFiniteNumber(value) {
      return typeof value === "number" && isFinite(value);
    }

    function isWholeNumber(value) {
      return isFiniteNumber(value) && value >= 0 && Math.floor(value) === value;
    }

    function formatInteger(value) {
      return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var statsUrl = statsEndpoint + "?v=" + Math.floor(Date.now() / 300000);
    fetchJSONP(statsUrl, 5000).then(function (data) {
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
    }).catch(function () {});
  }

  loadResultStats();
}());
