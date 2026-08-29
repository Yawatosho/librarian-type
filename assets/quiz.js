(function () {
  "use strict";

  var app = document.getElementById("app");
  var game = window.GAME_DATA;
  var index = 0;
  var selected = false;
  var scores = {};
  var answerOrder = [];
  var values = ["P", "C", "Q", "O", "R", "D", "X", "S"];

  function resetScores() {
    values.forEach(function (value) { scores[value] = 0; });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function shuffled(items) {
    var copy = items.slice();
    for (var current = copy.length - 1; current > 0; current -= 1) {
      var random = Math.floor(Math.random() * (current + 1));
      var temporary = copy[current];
      copy[current] = copy[random];
      copy[random] = temporary;
    }
    return copy;
  }

  function renderQuestion() {
    var question = game.questions[index];
    answerOrder = shuffled(question.answers);
    var number = String(index + 1).padStart(2, "0");
    var progressStart = (index / game.questions.length) * 100;
    var progressEnd = ((index + 1) / game.questions.length) * 100;
    app.className = "site-shell quiz-shell";
    app.innerHTML =
      '<section class="question-card" aria-labelledby="question-heading">' +
        '<header class="quiz-header"><span class="mini-brand">LIBRARIAN TYPE</span>' +
          '<span class="question-number" aria-label="質問 ' + number + ' / ' + game.questions.length + '">Q. ' + number + ' <small>/ ' + game.questions.length + '</small></span></header>' +
        '<div class="progress-track" role="progressbar" aria-label="回答の進み具合" aria-valuemin="0" aria-valuemax="' + game.questions.length + '" aria-valuenow="' + (index + 1) + '">' +
          '<span style="--progress-start:' + progressStart + '%;--progress-end:' + progressEnd + '%"></span></div>' +
        '<div class="question-content">' +
          '<span class="question-stamp" aria-hidden="true">' + number + '</span>' +
          '<h1 id="question-heading" tabindex="-1">' + escapeHtml(question.prompt).replace(/\n/g, "<br>") + '</h1>' +
          '<div class="answers" aria-label="回答を選んでください">' +
            answerOrder.map(function (answer, answerIndex) {
              return '<button type="button" class="answer-button" data-index="' + answerIndex + '" aria-keyshortcuts="' + (answerIndex === 0 ? "A 1" : "B 2") + '">' +
                '<span class="answer-mark" aria-hidden="true">' + (answerIndex === 0 ? "A" : "B") + '</span>' +
                '<span>' + escapeHtml(answer.text) + '</span><i aria-hidden="true">→</i></button>';
            }).join("") +
          '</div>' +
        '</div>' +
        '<p class="quiz-note">悩んだら、なんとなくで。</p>' +
        '<p class="quiz-control" aria-hidden="true">A / B から選択</p>' +
      '</section>';

    document.getElementById("question-heading").focus();
    Array.prototype.forEach.call(app.querySelectorAll(".answer-button"), function (button) {
      button.addEventListener("click", function () {
        choose(Number(button.getAttribute("data-index")));
      });
    });
  }

  function choose(answerIndex) {
    if (selected) return;
    if (answerIndex < 0 || answerIndex >= answerOrder.length) return;
    selected = true;
    var value = answerOrder[answerIndex].value;
    scores[value] += 1;
    if (typeof navigator.vibrate === "function") navigator.vibrate(10);
    Array.prototype.forEach.call(app.querySelectorAll(".answer-button"), function (button, current) {
      button.disabled = true;
      if (current === answerIndex) button.classList.add("is-selected");
    });

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var confirmDuration = reduceMotion ? 10 : 100;
    var exitDuration = reduceMotion ? 10 : 90;
    window.setTimeout(function () {
      var currentCard = app.querySelector(".question-card");
      if (currentCard) currentCard.classList.add("is-leaving");
      window.setTimeout(function () {
        if (index < game.questions.length - 1) {
          index += 1;
          selected = false;
          renderQuestion();
          return;
        }

        var code =
          (scores.P > scores.C ? "P" : "C") +
          (scores.Q > scores.O ? "Q" : "O") +
          (scores.R > scores.D ? "R" : "D") +
          (scores.X > scores.S ? "X" : "S");
        reveal(game.resultSlugs[code]);
      }, exitDuration);
    }, confirmDuration);
  }

  function reveal(slug) {
    app.className = "site-shell";
    app.innerHTML = '<section class="reveal-card" aria-live="polite"><span>あなたは……</span><strong>どのタイプ？</strong><i aria-hidden="true"></i></section>';
    var base = new URL(".", window.location.href.replace(/index\.html$/, ""));
    var delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 980;
    window.setTimeout(function () {
      window.location.assign(new URL("result/" + slug + "/", base).href);
    }, delay);
  }

  document.getElementById("start-button").addEventListener("click", function () {
    index = 0;
    selected = false;
    resetScores();
    renderQuestion();
  });
  document.addEventListener("keydown", function (event) {
    if (selected || app.className.indexOf("quiz-shell") === -1 || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
    var targetName = event.target && event.target.tagName ? event.target.tagName : "";
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(targetName)) return;
    var key = event.key.toLowerCase();
    if (key === "a" || key === "1") {
      event.preventDefault();
      choose(0);
      return;
    }
    if (key === "b" || key === "2") {
      event.preventDefault();
      choose(1);
      return;
    }
    if (key === "arrowup" || key === "arrowdown") {
      event.preventDefault();
      var buttons = app.querySelectorAll(".answer-button");
      var focusIndex = key === "arrowup" ? 0 : 1;
      if (buttons[focusIndex]) buttons[focusIndex].focus();
    }
  });
  resetScores();
}());
