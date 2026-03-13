import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

const MultipleChoiceRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const { options, correctIndex } = question.data as {
    options: string[];
    correctIndex: number;
  };

  const [selected, setSelected] = useState<number | null>(null);
  const locked = result?.answered;

  const handleSubmit = () => {
    if (selected !== null) onAnswer(selected);
  };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.mcOptions}>
        {options.map((opt, idx) => {
          let cls = styles.mcOption;
          if (selected === idx && !locked) cls += " " + styles.mcSelected;
          if (locked && idx === correctIndex) cls += " " + styles.correct;
          if (locked && idx === selected && idx !== correctIndex) cls += " " + styles.wrong;
          return (
            <button
              key={idx}
              className={cls}
              onClick={() => !locked && setSelected(idx)}
              disabled={!!locked}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {!locked && (
        <button onClick={handleSubmit} disabled={selected === null} className={styles.submitBtn}>
          Submit
        </button>
      )}
    </div>
  );
};

export default MultipleChoiceRenderer;
