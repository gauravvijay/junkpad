import React from "react";
import type { Question, QuestionResult } from "./types";

interface Props {
  questions: Question[];
  results: Record<number, QuestionResult>;
  onNewQuiz: () => void;
  onReview: () => void;
}

function fmtTime(seconds?: number): string {
  if (seconds === undefined) return "—";
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

const QuizSummary: React.FC<Props> = ({ questions, results, onNewQuiz, onReview }) => {
  const correctCount = Object.values(results).filter(r => r.correct === true).length;
  const totalTime = Object.values(results).reduce((s, r) => s + (r.timeTaken ?? 0), 0);
  const pct = Math.round((correctCount / questions.length) * 100);

  const emoji = pct === 100 ? "🏆" : pct >= 80 ? "🌟" : pct >= 60 ? "👍" : "💪";

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px", fontFamily: "'Source Sans Pro', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{emoji}</div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1a237e" }}>Quiz Complete!</h1>
        <p style={{ margin: "8px 0 0", fontSize: 18, color: "#555" }}>
          You got <strong style={{ color: correctCount === questions.length ? "#2e7d32" : "#1565c0" }}>{correctCount}/{questions.length}</strong> correct ({pct}%)
          &nbsp;·&nbsp; Total time: <strong>{fmtTime(totalTime)}</strong>
        </p>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 16, border: "2px solid #e0e0e0", overflow: "hidden", boxShadow: "0 4px 18px rgba(0,0,0,.06)", marginBottom: 24 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#e8eaf6" }}>
              <th style={thStyle}>#</th>
              <th style={{ ...thStyle, textAlign: "left" }}>Category</th>
              <th style={thStyle}>Result</th>
              <th style={thStyle}>Time</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => {
              const r = results[q.id];
              const isCorrect = r?.correct === true;
              const rowBg = isCorrect ? "#f1f8f1" : "#fff8f8";
              return (
                <tr key={q.id} style={{ background: rowBg, borderTop: "1px solid #eee" }}>
                  <td style={{ ...tdStyle, color: "#888", fontSize: 13 }}>{idx + 1}</td>
                  <td style={{ ...tdStyle, textAlign: "left", fontWeight: 600, fontSize: 14 }}>
                    <span style={{
                      display: "inline-block", padding: "2px 10px",
                      background: "#e8eaf6", color: "#3949ab",
                      borderRadius: 12, fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
                    }}>
                      {q.category}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 20 }}>{isCorrect ? "✅" : "❌"}</td>
                  <td style={{ ...tdStyle, color: "#555", fontSize: 14, fontWeight: 600 }}>{fmtTime(r?.timeTaken)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={onReview}
          style={{
            flex: 1, padding: "14px", borderRadius: 12, border: "2px solid #1565c0",
            background: "white", color: "#1565c0", fontSize: 17, fontWeight: 700, cursor: "pointer",
          }}
        >
          Review Questions
        </button>
        <button
          onClick={onNewQuiz}
          style={{
            flex: 1, padding: "14px", borderRadius: 12, border: "none",
            background: "#7c4dff", color: "white", fontSize: 17, fontWeight: 700, cursor: "pointer",
          }}
        >
          🔄 New Quiz
        </button>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: "12px 16px", textAlign: "center",
  fontSize: 13, fontWeight: 700, color: "#3949ab", textTransform: "uppercase", letterSpacing: 0.5,
};

const tdStyle: React.CSSProperties = {
  padding: "10px 16px", textAlign: "center",
};

export default QuizSummary;
