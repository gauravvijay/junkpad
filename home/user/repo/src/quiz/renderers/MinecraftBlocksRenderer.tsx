import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

const MinecraftBlocksRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const { width, height, depth } = question.data as {
    width: number;
    height: number;
    depth: number;
  };

  const [value, setValue] = useState("");
  const locked = result?.answered;

  const handleSubmit = () => {
    onAnswer(Number(value));
  };

  // Draw a simple isometric grid of blocks
  const blockSize = Math.min(30, 150 / Math.max(width, height, depth));

  return (
    <div className={styles.questionContainer}>
      <div className={styles.minecraftVisual}>
        <svg
          viewBox={`0 0 ${300} ${250}`}
          width="300"
          height="250"
          className={styles.minecraftSvg}
        >
          {/* Draw isometric blocks */}
          {Array.from({ length: depth }).map((_, z) =>
            Array.from({ length: width }).map((_, x) =>
              Array.from({ length: height }).map((_, y) => {
                const isoX = 150 + (x - z) * blockSize * 0.8;
                const isoY = 200 - y * blockSize * 0.9 + (x + z) * blockSize * 0.4;
                const green = 100 + y * 20;
                return (
                  <rect
                    key={`${x}_${y}_${z}`}
                    x={isoX - blockSize / 2}
                    y={isoY - blockSize / 2}
                    width={blockSize - 2}
                    height={blockSize - 2}
                    fill={`rgb(80, ${green}, 80)`}
                    stroke="#2d5a2d"
                    strokeWidth="1"
                    rx="2"
                  />
                );
              })
            )
          )}
        </svg>
        <div className={styles.minecraftDimensions}>
          🧱 {width} × {height} × {depth}
        </div>
      </div>

      <div className={styles.inputGroup}>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!!locked}
          className={`${styles.numberInput} ${locked ? (result?.correct ? styles.correct : styles.wrong) : ""}`}
          placeholder="Total blocks?"
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

export default MinecraftBlocksRenderer;
