import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

interface BarData {
  children: number;
  apples: number;
}

const GraphApplesRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const { bars, askChildren, totalApples } = question.data as {
    bars: BarData[];
    askChildren: number;
    askApples: number;
    totalApples: number;
  };

  const correctAnswer = question.correctAnswer as {
    perGroup: number;
    total: number;
  };

  const [perGroupInput, setPerGroupInput] = useState("");
  const [totalInput, setTotalInput] = useState("");
  const locked = result?.answered;

  const maxApples = Math.max(...bars.map((b) => b.apples));

  const handleSubmit = () => {
    onAnswer({
      perGroup: Number(perGroupInput),
      total: Number(totalInput),
    });
  };

  return (
    <div className={styles.questionContainer}>
      {/* Bar chart */}
      <div className={styles.graphContainer}>
        <div className={styles.graphYLabel}>Apples eaten</div>
        <div className={styles.graphChart}>
          <div className={styles.graphYAxis}>
            {Array.from({ length: maxApples + 1 })
              .map((_, i) => maxApples - i)
              .map((val) => (
                <div key={val} className={styles.graphYTick}>
                  {val}
                </div>
              ))}
          </div>
          <div className={styles.graphBars}>
            {bars.map((bar, idx) => (
              <div key={idx} className={styles.graphBarCol}>
                <div
                  className={styles.graphBar}
                  style={{
                    height: `${(bar.apples / (maxApples + 1)) * 100}%`,
                    backgroundColor:
                      bar.children === askChildren ? "#e91e63" : "#4CAF50",
                  }}
                >
                  <span className={styles.graphBarValue}>{bar.apples}</span>
                </div>
                <div className={styles.graphBarLabel}>{bar.children}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.graphXLabel}>Number of children</div>
      </div>

      <div className={styles.graphQuestions}>
        <div className={styles.graphQuestion}>
          <label>
            How many apples were eaten by the group of{" "}
            <strong>{askChildren}</strong> children?{" "}
            <span style={{ color: "#e91e63" }}>(highlighted in pink)</span>
          </label>
          <input
            type="number"
            value={perGroupInput}
            onChange={(e) => setPerGroupInput(e.target.value)}
            disabled={!!locked}
            className={`${styles.numberInput} ${locked ? (Number(perGroupInput) === correctAnswer.perGroup ? styles.correct : styles.wrong) : ""}`}
            placeholder="?"
          />
        </div>
        <div className={styles.graphQuestion}>
          <label>
            How many <strong>total</strong> apples were eaten by all groups?
            <br />
            <span className={styles.hint}>
              (Hint: multiply children × apples for each group, then add them up)
            </span>
          </label>
          <input
            type="number"
            value={totalInput}
            onChange={(e) => setTotalInput(e.target.value)}
            disabled={!!locked}
            className={`${styles.numberInput} ${locked ? (Number(totalInput) === correctAnswer.total ? styles.correct : styles.wrong) : ""}`}
            placeholder="?"
          />
        </div>
      </div>

      {locked && (
        <div className={styles.answerReveal}>
          Correct: per group = <strong>{correctAnswer.perGroup}</strong>, total
          = <strong>{correctAnswer.total}</strong>
        </div>
      )}
      {!locked && (
        <button
          onClick={handleSubmit}
          disabled={perGroupInput === "" || totalInput === ""}
          className={styles.submitBtn}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default GraphApplesRenderer;
