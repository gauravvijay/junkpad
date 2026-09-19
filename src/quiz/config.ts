import { getAllTopicIds } from "./generators/registry";

export const STORAGE_KEY = "junkpad_quiz_topics_v1";

/**
 * Loads selected topic IDs from localStorage.
 * Automatically prunes any obsolete or unknown IDs.
 * Falls back to all available topics if stored data is absent, corrupt, or empty.
 */
export function loadConfig(): string[] {
  const allIds = getAllTopicIds();
  const validSet = new Set(allIds);

  if (typeof window === "undefined" || !window.localStorage) {
    return allIds;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return allIds;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return allIds;
    }
    // Prune invalid or obsolete topic IDs
    const filtered = parsed.filter((id): id is string => typeof id === "string" && validSet.has(id));
    return filtered.length > 0 ? filtered : allIds;
  } catch {
    return allIds;
  }
}

/**
 * Persists valid topic IDs to localStorage.
 * Wrapped defensively to handle quota exceeded or private browsing restrictions.
 */
export function saveConfig(selectedIds: string[]): void {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  const validSet = new Set(getAllTopicIds());
  const sanitized = selectedIds.filter((id) => validSet.has(id));

  try {
    if (sanitized.length === 0) {
      // Don't persist empty config, remove key so defaults apply
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    }
  } catch {
    // Gracefully ignore storage write failures
  }
}

/**
 * Clears custom configuration from localStorage and returns default (all) topic IDs.
 */
export function resetConfig(): string[] {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Gracefully ignore
    }
  }
  return getAllTopicIds();
}
