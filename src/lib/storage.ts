import type { Goal, Habit, JournalEntry, Project, Task } from '@/types/codex';

const STORAGE_KEYS = {
  tasks: 'codex_tasks',
  projects: 'codex_projects',
  goals: 'codex_goals',
  habits: 'codex_habits',
  journalEntries: 'codex_journal_entries',
} as const;

function loadFromStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as T[];
  } catch {
    window.localStorage.removeItem(key);
    return [];
  }
}

function saveToStorage<T>(key: string, value: T[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadTasks() {
  return loadFromStorage<Task>(STORAGE_KEYS.tasks);
}

export function saveTasks(tasks: Task[]) {
  saveToStorage(STORAGE_KEYS.tasks, tasks);
}

export function loadProjects() {
  return loadFromStorage<Project>(STORAGE_KEYS.projects);
}

export function saveProjects(projects: Project[]) {
  saveToStorage(STORAGE_KEYS.projects, projects);
}

export function loadGoals() {
  return loadFromStorage<Goal>(STORAGE_KEYS.goals);
}

export function saveGoals(goals: Goal[]) {
  saveToStorage(STORAGE_KEYS.goals, goals);
}

export function loadHabits() {
  return loadFromStorage<Habit>(STORAGE_KEYS.habits);
}

export function saveHabits(habits: Habit[]) {
  saveToStorage(STORAGE_KEYS.habits, habits);
}

export function loadJournalEntries() {
  return loadFromStorage<JournalEntry>(STORAGE_KEYS.journalEntries);
}

export function saveJournalEntries(entries: JournalEntry[]) {
  saveToStorage(STORAGE_KEYS.journalEntries, entries);
}
