import React, { useState, useRef } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

const OrderNumbersRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const { numbers } = question.data as { numbers: number[] };
  const [order, setOrder] = useState<number[]>(numbers);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const locked = result?.answered;

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newOrder = [...order];
    const draggedItemContent = newOrder[dragItem.current];
    newOrder.splice(dragItem.current, 1);
    newOrder.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setOrder(newOrder);
  };

  const handleSubmit = () => {
    onAnswer(order);
  };

  const correctAnswer = question.correctAnswer as number[];

  return (
    <div className={styles.questionContainer}>
      <div className={styles.dragList}>
        {order.map((num, idx) => {
          let itemClass = styles.dragItem;
          if (locked) {
            if (correctAnswer[idx] === num) {
              itemClass += " " + styles.correct;
            } else {
              itemClass += " " + styles.wrong;
            }
          }
          return (
            <div
              key={`${num}-${idx}`}
              className={itemClass}
              draggable={!locked}
              onDragStart={() => handleDragStart(idx)}
              onDragEnter={() => handleDragEnter(idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              {num}
            </div>
          );
        })}
      </div>
      {locked && (
        <div className={styles.correctOrderLabel}>
          Correct order: {correctAnswer.join(", ")}
        </div>
      )}
      {!locked && (
        <button onClick={handleSubmit} className={styles.submitBtn}>
          Submit
        </button>
      )}
    </div>
  );
};

export default OrderNumbersRenderer;
