import React, { useState, useCallback, useMemo } from "react";
import type { Question, QuestionResult } from "./types";
import { generateAllQuestions } from "./generators";
import { getRenderer } from "./renderers";
import { checkAnswer } from "./answerChecker";
import styles from "./QuizApp.module.css";

const QuizApp: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(() => generateAllQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Record<number, QuestionResult>>({});

  const question = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleAnswer = useCallback(
    (answer: unknown) => {
      const correct = checkAnswer(question, answer);
      setResults((prev) => ({
        ...prev,
        [question.id]: { questionId: question.id, answered: true, correct, userAnswer: answer },
      }));
    },
    [question]
  );

  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };
  const handleNext = () => { if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1); };

  const handleNewQuiz = () => {
    setQuestions(generateAllQuestions());
    setResults({});
    setCurrentIndex(0);
  };

  const Renderer = getRenderer(question.type);
  const result = results[question.id];

  const stats = useMemo(() => {
    const answered = Object.values(results).filter((r) => r.answered).length;
    const correctCount = Object.values(results).filter((r) => r.correct === true).length;
    const wrongCount = Object.values(results).filter((r) => r.correct === false).length;
    return { answered, correctCount, wrongCount };
  }, [results]);

  return (
    <div className={styles.quizApp}>
      <div className={styles.header}>
        <h1 className={styles.title}>{"\uD83C\uDF93"} Maths Quiz</h1>
        <button onClick={handleNewQuiz} className={styles.newQuizBtn}>
          {"\uD83D\uDD04"} New Quiz
        </button>
      </div>

      <div className={styles.scorecard}>
        <div className={styles.scoreItem}>
          {"\uD83D\uDCDD"} <strong>{stats.answered}</strong>/{totalQuestions} answered
        </div>
        <div className={`${styles.scoreItem} ${styles.scoreCorrect}`}>
          {"\u2705"} <strong>{stats.correctCount}</strong> correct
        </div>
        <div className={`${styles.scoreItem} ${styles.scoreWrong}`}>
          {"\u274C"} <strong>{stats.wrongCount}</strong> wrong
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
            {result.correct ? "\u2705 Correct!" : "\u274C Wrong"}
          </div>
        )}
        <div className={styles.questionPrompt}>{question.prompt}</div>
        <div className={styles.rendererArea}>
          <Renderer question={question} onAnswer={handleAnswer} result={result} />
        </div>
      </div>

      <div className={styles.navButtons}>
        <button onClick={handlePrev} disabled={currentIndex === 0} className={styles.navBtn}>
          {"\u25C0"} Previous
        </button>
        <button onClick={handleNext} disabled={currentIndex === totalQuestions - 1} className={styles.navBtn}>
          Next {"\u25B6"}
        </button>
      </div>
    </div>
  );
};

export default QuizApp;
