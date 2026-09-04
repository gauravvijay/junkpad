import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { Question, QuestionResult } from "./types";
import { generateAllQuestions } from "./generators";
import { getRenderer } from "./renderers";
import { checkAnswer } from "./answerChecker";
import QuizSummary from "./QuizSummary";
import styles from "./QuizApp.module.css";

const QuizApp: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(() => generateAllQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Record<number, QuestionResult>>({});
  const [showSummary, setShowSummary] = useState(false);

  const questionStartTimeRef = useRef<number>(Date.now());

  const question = questions[currentIndex];
  const totalQuestions = questions.length;

  // Reset timer whenever we navigate to an unanswered question
  useEffect(() => {
    const q = questions[currentIndex];
    if (q && !results[q.id]?.answered) {
      questionStartTimeRef.current = Date.now();
    }
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = useCallback(
    (answer: unknown) => {
      const correct = checkAnswer(question, answer);
      const timeTaken = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
      setResults((prev) => ({
        ...prev,
        [question.id]: { questionId: question.id, answered: true, correct, userAnswer: answer, timeTaken },
      }));
    },
    [question]
  );

  const stats = useMemo(() => {
    const answered = Object.values(results).filter((r) => r.answered).length;
    const correctCount = Object.values(results).filter((r) => r.correct === true).length;
    const wrongCount = Object.values(results).filter((r) => r.correct === false).length;
    return { answered, correctCount, wrongCount };
  }, [results]);

  // Auto-show summary when all questions have been answered
  useEffect(() => {
    if (stats.answered === totalQuestions && totalQuestions > 0) {
      setShowSummary(true);
    }
  }, [stats.answered, totalQuestions]);

  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };
  const handleNext = () => { if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1); };

  const handleNewQuiz = () => {
    setQuestions(generateAllQuestions());
    setResults({});
    setCurrentIndex(0);
    setShowSummary(false);
    questionStartTimeRef.current = Date.now();
  };

  const allAnswered = stats.answered === totalQuestions;

  if (showSummary) {
    return (
      <QuizSummary
        questions={questions}
        results={results}
        onNewQuiz={handleNewQuiz}
        onReview={() => { setShowSummary(false); setCurrentIndex(0); }}
      />
    );
  }

  const Renderer = getRenderer(question.type);
  const result = results[question.id];

  return (
    <div className={styles.quizApp}>
      <div className={styles.header}>
        <h1 className={styles.title}>{"🎓"} Maths Quiz</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {allAnswered && (
            <button onClick={() => setShowSummary(true)} className={styles.summaryBtn}>
              See Results
            </button>
          )}
          <button onClick={handleNewQuiz} className={styles.newQuizBtn}>
            {"🔄"} New Quiz
          </button>
        </div>
      </div>

      <div className={styles.scorecard}>
        <div className={styles.scoreItem}>
          {"📝"} <strong>{stats.answered}</strong>/{totalQuestions} answered
        </div>
        <div className={`${styles.scoreItem} ${styles.scoreCorrect}`}>
          {"✅"} <strong>{stats.correctCount}</strong> correct
        </div>
        <div className={`${styles.scoreItem} ${styles.scoreWrong}`}>
          {"❌"} <strong>{stats.wrongCount}</strong> wrong
        </div>
      </div>

      <div className={styles.dotNav}>
        {questions.map((q, idx) => {
          const r = results[q.id];
          let dotClass = styles.dot;
          if (idx === currentIndex) dotClass += " " + styles.dotCurrent;
          if (r?.correct === true) dotClass += " " + styles.dotCorrect;
          if (r?.correct === false) dotClass += " " + styles.dotWrong;
          if (r === undefined) dotClass += " " + styles.dotUnanswered;
          return (
            <button key={q.id} className={dotClass} onClick={() => setCurrentIndex(idx)} title={`Q${idx + 1}: ${q.category}`}>
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <span className={styles.questionNumber}>Question {currentIndex + 1} of {totalQuestions}</span>
          <span className={styles.categoryBadge}>{question.category}</span>
        </div>
        {result?.answered && (
          <div className={result.correct ? styles.resultCorrect : styles.resultWrong}>
            {result.correct ? "✅ Correct!" : "❌ Wrong"}
          </div>
        )}
        <div className={styles.questionPrompt}>{question.prompt}</div>
        <div className={styles.rendererArea}>
          <Renderer question={question} onAnswer={handleAnswer} result={result} />
        </div>
      </div>

      <div className={styles.navButtons}>
        <button onClick={handlePrev} disabled={currentIndex === 0} className={styles.navBtn}>
          {"◀"} Previous
        </button>
        <button onClick={handleNext} disabled={currentIndex === totalQuestions - 1} className={styles.navBtn}>
          Next {"▶"}
        </button>
      </div>
    </div>
  );
};

export default QuizApp;
