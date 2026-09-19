import React, { useState, useEffect } from "react";
import {
  getAllTopicIds,
  getTopicsByCategory,
  type RegisteredTopic,
} from "../generators/registry";
import styles from "./SettingsModal.module.css";

interface SettingsModalProps {
  isOpen: boolean;
  initialSelectedIds: string[];
  onClose: () => void;
  onSave: (selectedIds: string[]) => void;
  onReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  initialSelectedIds,
  onClose,
  onSave,
  onReset,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  const allTopics = getAllTopicIds();
  const categories = getTopicsByCategory();

  // Keep local selection in sync whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(initialSelectedIds);
    }
  }, [isOpen, initialSelectedIds]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleTopic = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleCategory = (topics: RegisteredTopic[]) => {
    const topicIds = topics.map((t) => t.id);
    const allSelected = topicIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      // Unselect all in this category
      setSelectedIds((prev) => prev.filter((id) => !topicIds.includes(id)));
    } else {
      // Select all in this category
      setSelectedIds((prev) => Array.from(new Set([...prev, ...topicIds])));
    }
  };

  const handleSelectAll = () => {
    setSelectedIds(allTopics);
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleResetDefaults = () => {
    onReset();
    setSelectedIds(allTopics);
  };

  const handleSave = () => {
    if (selectedIds.length === 0) return;
    onSave(selectedIds);
  };

  const isSaveDisabled = selectedIds.length === 0;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-topics-modal-title"
      >
        <div className={styles.header}>
          <h2 id="quiz-topics-modal-title" className={styles.title}>
            ⚙️ Quiz Topics Configuration
          </h2>
          <button onClick={onClose} className={styles.closeBtn} title="Close">
            ✕
          </button>
        </div>

        <div className={styles.toolbar}>
          <span className={styles.badge}>
            Selected: {selectedIds.length} / {allTopics.length}
          </span>
          <div className={styles.actions}>
            <button onClick={handleSelectAll} className={styles.actionBtn}>
              Select All
            </button>
            <button onClick={handleClearAll} className={styles.actionBtn}>
              Clear All
            </button>
            <button onClick={handleResetDefaults} className={styles.actionBtn}>
              Reset Defaults
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {Object.entries(categories).map(([categoryName, topics]) => {
            const allCatSelected = topics.every((t) => selectedIds.includes(t.id));

            return (
              <div key={categoryName} className={styles.categoryGroup}>
                <div className={styles.categoryHeader}>
                  <h3 className={styles.categoryTitle}>{categoryName}</h3>
                  <button
                    type="button"
                    onClick={() => handleToggleCategory(topics)}
                    className={styles.categoryToggleBtn}
                  >
                    {allCatSelected ? "Deselect Group" : "Select Group"}
                  </button>
                </div>
                <div className={styles.topicList}>
                  {topics.map((t) => {
                    const checked = selectedIds.includes(t.id);
                    return (
                      <label key={t.id} className={styles.topicItem}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleTopic(t.id)}
                        />
                        <span>{t.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.footer}>
          {isSaveDisabled && (
            <span className={styles.errorMsg}>⚠️ Select at least 1 topic to save</span>
          )}
          <div className={styles.footerButtons}>
            <button onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className={styles.saveBtn}
            >
              Save & Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
