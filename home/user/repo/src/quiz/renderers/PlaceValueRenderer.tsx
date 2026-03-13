import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

interface MatchItem {
  label: string;
  belongsTo: number;
}

const PlaceValueRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const { numbers, matchItems } = question.data as {
    numbers: number[];
    matchItems: MatchItem[];
  };

  const [assignments, setAssignments] = useState<Record<string, number | null>>(
    () => {
      const init: Record<string, number | null> = {};
      matchItems.forEach((_, idx) => {
        init[`item_${idx}`] = null;
      });
      return init;
    }
  );

  const handleSelect = (itemKey: string, num: number) => {
    setAssignments((prev) => ({ ...prev, [itemKey]: num }));
  };

  const handleSubmit = () => {
    const answer: Record<string, number> = {};
    for (const key of Object.keys(assignments)) {
      if (assignments[key] !== null) {
        answer[key] = assignments[key]!;
      }
    }
    onAnswer(answer);
  };

  const allAssigned = Object.values(assignments).every((v) => v !== null);
  const locked = result?.answered;

  return (
    <div className={styles.questionContainer}>
      <div className={styles.numberBadges}>
        {numbers.map((n) => (
          <span key={n} className={styles.badge}>
            {n}
          </span>
        ))}
      </div>
      <div className={styles.matchGrid}>
        {matchItems.map((item, idx) => {
          const key = `item_${idx}`;
          const isCorrect =
            locked &&
            (question.correctAnswer as Record<string, number>)[key] ===
              assignments[key];
          const isWrong = locked && !isCorrect;
          return (
            <div
              key={key}
              className={`${styles.matchRow} ${isCorrect ? styles.correct : ""} ${isWrong ? styles.wrong : ""}`}
            >
              <span className={styles.matchLabel}>{item.label}</span>
              <select
                value={assignments[key] ?? ""}
                onChange={(e) => handleSelect(key, Number(e.target.value))}
                disabled={!!locked}
                className={styles.selectInput}
              >
                <option value="">Pick a number</option>
                {numbers.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      {!locked && (
        <button
          onClick={handleSubmit}
          disabled={!allAssigned}
          className={styles.submitBtn}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default PlaceValueRenderer;
