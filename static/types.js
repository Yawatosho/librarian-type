(function () {
  "use strict";

  var archive = document.getElementById("type-archive");
  var buttons = document.querySelectorAll("[data-types-variant]");
  if (!archive || buttons.length !== 2) return;

  function selectVariant(nextVariant) {
    if (nextVariant !== "original" && nextVariant !== "librarian") return;
    archive.setAttribute("data-variant", nextVariant);
    Array.prototype.forEach.call(buttons, function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-types-variant") === nextVariant));
    });
  }

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener("click", function () {
      selectVariant(button.getAttribute("data-types-variant"));
    });
  });

  selectVariant("original");
}());
