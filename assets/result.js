(function () {
  "use strict";

  var shareButton = document.getElementById("share-button");
  var copyButton = document.getElementById("copy-button");
  var xLink = document.getElementById("x-share");
  if (!shareButton || !copyButton || !xLink) return;

  var name = document.body.getAttribute("data-result-name");
  var catchCopy = document.body.getAttribute("data-catch-copy");
  var shareText = "私は「" + name + "」でした。\n\n" + catchCopy + "\n\nあなたはどの図書館員タイプ？\n#図書館員タイプ";
  var shareUrl = window.location.href;
  xLink.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText) + "&url=" + encodeURIComponent(shareUrl);

  function copyUrl() {
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
    if (navigator.share) {
      navigator.share({ title: "あなたはどの図書館員タイプ？", text: shareText, url: shareUrl }).catch(function () {});
      return;
    }
    copyUrl();
  });
  copyButton.addEventListener("click", copyUrl);
}());
