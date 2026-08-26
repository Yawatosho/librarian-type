"use client";

import { useEffect, useRef, useState } from "react";
import { questions, resultByCode, type AxisValue } from "./data";

const initialScores: Record<AxisValue, number> = { P: 0, C: 0, Q: 0, O: 0, R: 0, D: 0, X: 0, S: 0 };

export function QuizApp() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState(initialScores);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealing, setRevealing] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const question = questions[index];

  useEffect(() => {
    if (started && !revealing) headingRef.current?.focus();
  }, [index, started, revealing]);

  const start = () => { setStarted(true); setIndex(0); setScores(initialScores); };

  const choose = (answerIndex: number, value: AxisValue) => {
    if (selected !== null) return;
    setSelected(answerIndex);
    const nextScores = { ...scores, [value]: scores[value] + 1 };
    setScores(nextScores);

    window.setTimeout(() => {
      if (index < questions.length - 1) {
        setIndex((current) => current + 1);
        setSelected(null);
        return;
      }

      const code = `${nextScores.P > nextScores.C ? "P" : "C"}${nextScores.Q > nextScores.O ? "Q" : "O"}${nextScores.R > nextScores.D ? "R" : "D"}${nextScores.X > nextScores.S ? "X" : "S"}`;
      const result = resultByCode[code];
      setRevealing(true);
      window.setTimeout(() => { window.location.assign(`/result/${result.slug}/`); }, 900);
    }, 260);
  };

  if (revealing) {
    return <main className="site-shell"><section className="reveal-card" aria-live="polite"><span>あなたは……</span><strong>どのタイプ？</strong><i aria-hidden="true" /></section></main>;
  }

  if (!started) {
    return (
      <main className="site-shell">
        <section className="title-card" aria-labelledby="game-title">
          <div className="brand-row"><span className="brand">YAWATOSHO GAMES</span><span className="edition">LIBRARIAN TYPE</span></div>
          <div className="shelf-scene" aria-hidden="true"><span className="book book-one" /><span className="book book-two" /><span className="book book-three" /><span className="book book-four" /><span className="shelf-label">?</span></div>
          <p className="eyebrow">図書館員の仕事のクセを、勝手に命名。</p>
          <h1 id="game-title">あなたはどの<br /><span>図書館員タイプ？</span></h1>
          <p className="lead">12の質問から、あなたの図書館員タイプを<br className="desktop-break" />勝手に分類します。</p>
          <button className="start-button" type="button" onClick={start}>やってみる <span aria-hidden="true">→</span></button>
          <p className="duration">全12問・2〜3分くらい</p>
        </section>
      </main>
    );
  }

  return (
    <main className="site-shell quiz-shell">
      <section className="question-card" aria-labelledby="question-heading">
        <header className="quiz-header">
          <span className="mini-brand">LIBRARIAN TYPE</span>
          <span className="question-number" aria-label={`質問 ${String(index + 1).padStart(2, "0")} / 12`}>Q. {String(index + 1).padStart(2, "0")} <small>/ 12</small></span>
        </header>
        <div className="progress-track" role="progressbar" aria-label="回答の進み具合" aria-valuemin={0} aria-valuemax={12} aria-valuenow={index + 1}><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
        <div className="question-content" key={question.id}>
          <span className="question-stamp" aria-hidden="true">{String(question.id).padStart(2, "0")}</span>
          <h1 id="question-heading" ref={headingRef} tabIndex={-1}>{question.prompt}</h1>
          <div className="answers" aria-label="回答を選んでください">
            {question.answers.map((answer, answerIndex) => (
              <button key={answer.text} type="button" className={`answer-button ${selected === answerIndex ? "is-selected" : ""}`} disabled={selected !== null} onClick={() => choose(answerIndex, answer.value)}>
                <span className="answer-mark" aria-hidden="true">{answerIndex === 0 ? "A" : "B"}</span><span>{answer.text}</span><i aria-hidden="true">→</i>
              </button>
            ))}
          </div>
        </div>
        <p className="quiz-note">悩んだら、なんとなくで。</p>
      </section>
    </main>
  );
}
