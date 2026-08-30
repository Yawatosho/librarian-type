(function () {
  "use strict";

  var shareButton = document.getElementById("share-button");
  var copyButton = document.getElementById("copy-button");
  var xLink = document.getElementById("x-share");
  var illustration = document.querySelector(".result-illustration");
  if (!shareButton || !copyButton || !xLink || !illustration) return;

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
}());
