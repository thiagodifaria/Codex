import type { Goal, Habit, SubGoal } from "@/types/codex";

export const getDummyGoals = (): Goal[] => [];

export const getDummyHabits = (): Habit[] => [];

export const calculateProgress = (subGoals?: SubGoal[]): number => {
  if (!subGoals || subGoals.length === 0) {
    return 0;
  }

  const completedCount = subGoals.filter((subGoal) => subGoal.completed).length;
  return Math.round((completedCount / subGoals.length) * 100);
};
