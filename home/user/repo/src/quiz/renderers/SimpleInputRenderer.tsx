import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

/**
 * A generic renderer for questions that need a single numeric input.
 * Used for: sequence, minecraft-blocks, trampoline, division-teams,
 * dance-video, number-line, subtraction, speed-distance
 */
const SimpleInputRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const [value, setValue] = useState("");
  const locked = result?.answered;

  const handleSubmit = () => {
    onAnswer(Number(value));
  };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.inputGroup}>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!!locked}
          className={`${styles.numberInput} ${locked ? (result?.correct ? styles.correct : styles.wrong) : ""}`}
          placeholder="Your answer"
        />
      </div>
      {locked && (
        <div className={styles.answerReveal}>
          Correct answer: <strong>{String(question.correctAnswer)}</strong>
        </div>
      )}
      {!locked && (
        <button
          onClick={handleSubmit}
          disabled={value === ""}
          className={styles.submitBtn}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default SimpleInputRenderer;
