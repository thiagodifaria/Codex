
"use client";

import type { Goal, SubGoal } from "@/types/codex";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Edit, Trash2 } from "lucide-react";
import { format, parseISO, isValid } from 'date-fns';
import { useTranslation } from "react-i18next";
import React from 'react';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goalId: string) => void;
  onDelete: (goalId: string) => void;
  onToggleSubGoal: (goalId: string, subGoalId: string) => void;
}

export const GoalCard = React.memo(function GoalCard({ goal, onEdit, onDelete, onToggleSubGoal }: GoalCardProps) {
  const { t } = useTranslation('common');
  return (
    <Card data-testid={`goal-card-${goal.id}`} className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-xl font-headline">{goal.title}</CardTitle>
          {goal.targetDate && isValid(parseISO(goal.targetDate)) && <CardDescription>{t('common_target_date')}: {format(parseISO(goal.targetDate), 'PPP')}</CardDescription>}
        </div>
        <Target className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        {goal.description && <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>{t('goal_progress_label')}</span>
            <span>{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} aria-label={`${t('goal_progress_label')}: ${goal.progress}%`} />
        </div>
        {goal.subGoals && goal.subGoals.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">{t('goal_sub_goals_label')}:</h4>
            <ul className="space-y-1.5">
              {goal.subGoals.map(subGoal => (
                <li key={subGoal.id} className="flex items-center gap-2 text-sm">
                  <Checkbox 
                    id={`subgoal-${goal.id}-${subGoal.id}`} 
                    checked={subGoal.completed} 
                    onCheckedChange={() => onToggleSubGoal(goal.id, subGoal.id)}
                    aria-label={t('goal_toggle_subgoal_aria_label', { subGoalTitle: subGoal.title})}
                  />
                  <label 
                    htmlFor={`subgoal-${goal.id}-${subGoal.id}`}
                    className={`${subGoal.completed ? 'line-through text-muted-foreground' : ''} cursor-pointer`}
                  >
                    {subGoal.title}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(goal.id)}><Edit className="h-4 w-4 mr-1.5"/> {t('common_edit')}</Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(goal.id)}><Trash2 className="h-4 w-4 mr-1.5"/> {t('common_delete')}</Button>
      </CardFooter>
    </Card>
  );
});

GoalCard.displayName = 'GoalCard';
    
