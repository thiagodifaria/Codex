
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { GoalCard } from "@/components/goals/goal-card";
import { HabitTrackerCard } from "@/components/goals/habit-tracker-card";
import type { Goal, Habit, SubGoal } from "@/types/codex";
import { PlusCircle, Target, Trash2, Edit3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from '@/components/ui/label';
import { format, isValid, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { calculateProgress, getDummyGoals, getDummyHabits } from '@/lib/goals';
import { loadGoals, loadHabits, saveGoals, saveHabits } from '@/lib/storage';


export default function GoalsPage() {
  const { t } = useTranslation('common');
  const [goals, setGoals] = useState<Goal[]>(() => getDummyGoals().map(g => ({
      ...g, 
      title: g.titleKey ? t(g.titleKey) : g.title || '',
      description: g.descriptionKey ? t(g.descriptionKey) : g.description,
      subGoals: g.subGoals?.map(sg => ({...sg, title: sg.titleKey ? t(sg.titleKey) : sg.title || ''})),
      progress: calculateProgress(g.subGoals) || g.progress || 0
    })));
  const [habits, setHabits] = useState<Habit[]>(() => getDummyHabits().map(h => ({
      ...h,
      name: h.nameKey ? t(h.nameKey) : h.name || ''
  })));

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);

  const [currentGoalId, setCurrentGoalId] = useState<string | null>(null); 
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalTargetDate, setGoalTargetDate] = useState<string>("");
  const [subGoals, setSubGoals] = useState<SubGoal[]>([]);
  const [newSubGoalTitle, setNewSubGoalTitle] = useState("");

  const [habitName, setHabitName] = useState("");
  const [habitFrequency, setHabitFrequency] = useState<'daily' | 'weekly'>('daily');
  const [hasLoadedGoalData, setHasLoadedGoalData] = useState(false);

  useEffect(() => {
    setGoals(loadGoals());
    setHabits(loadHabits());
    setHasLoadedGoalData(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedGoalData) {
      return;
    }
    saveGoals(goals);
  }, [goals, hasLoadedGoalData]);

  useEffect(() => {
    if (!hasLoadedGoalData) {
      return;
    }
    saveHabits(habits);
  }, [habits, hasLoadedGoalData]);

  const openNewGoalModal = useCallback(() => {
    setCurrentGoalId(null); 
    setGoalTitle(""); 
    setGoalDescription(""); 
    setGoalTargetDate("");
    setSubGoals([]);
    setNewSubGoalTitle("");
    setIsGoalModalOpen(true);
  }, []);

  const handleEditGoal = useCallback((goalId: string) => {
    const goalToEdit = goals.find(g => g.id === goalId);
    if (goalToEdit) {
      setCurrentGoalId(goalToEdit.id);
      setGoalTitle(goalToEdit.title || "");
      setGoalDescription(goalToEdit.description || "");
      setGoalTargetDate(goalToEdit.targetDate && isValid(parseISO(goalToEdit.targetDate)) ? format(parseISO(goalToEdit.targetDate), 'yyyy-MM-dd') : "");
      setSubGoals(goalToEdit.subGoals ? [...goalToEdit.subGoals] : []);
      setNewSubGoalTitle("");
      setIsGoalModalOpen(true);
    }
  }, [goals]);

  const handleDeleteGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  }, []);

  const handleToggleSubGoal = useCallback((goalId: string, subGoalId: string) => {
    setGoals(prevGoals => prevGoals.map(goal => {
      if (goal.id === goalId) {
        const updatedSubGoals = goal.subGoals?.map(sg => 
          sg.id === subGoalId ? { ...sg, completed: !sg.completed } : sg
        );
        return { ...goal, subGoals: updatedSubGoals, progress: calculateProgress(updatedSubGoals) };
      }
      return goal;
    }));
  }, []);

  const handleAddSubGoal = useCallback(() => {
    if (!newSubGoalTitle.trim()) return;
    const newSub: SubGoal = {
      id: `sg-${Date.now()}`,
      title: newSubGoalTitle.trim(),
      completed: false,
    };
    setSubGoals(prev => [...prev, newSub]);
    setNewSubGoalTitle("");
  }, [newSubGoalTitle]);

  const handleRemoveSubGoal = useCallback((subGoalId: string) => {
    setSubGoals(prev => prev.filter(sg => sg.id !== subGoalId));
  }, []);
  
  const handleEditSubGoalTitle = useCallback((subGoalId: string, newTitle: string) => {
    setSubGoals(prev => prev.map(sg => sg.id === subGoalId ? {...sg, title: newTitle} : sg));
  }, []);

  const handleSaveGoal = useCallback(() => {
    if (!goalTitle.trim()) {
      alert(t('goal_alert_title_required')); return;
    }
    
    const goalData: Omit<Goal, 'id' | 'progress'> & { id?: string } = {
      title: goalTitle,
      description: goalDescription,
      targetDate: goalTargetDate ? new Date(goalTargetDate).toISOString() : undefined,
      subGoals: subGoals,
    };

    if (currentGoalId) { 
      setGoals(prev => prev.map(g => g.id === currentGoalId ? { ...g, ...goalData, progress: calculateProgress(subGoals) || g.progress || 0 } : g));
    } else { 
      const newGoal: Goal = {
        id: Date.now().toString(),
        progress: calculateProgress(subGoals) || 0,
        ...goalData,
      } as Goal;
      setGoals(prev => [newGoal, ...prev]);
    }
    setIsGoalModalOpen(false);
    setCurrentGoalId(null);
    setGoalTitle(""); setGoalDescription(""); setGoalTargetDate(""); setSubGoals([]); setNewSubGoalTitle("");
  }, [goalTitle, goalDescription, goalTargetDate, subGoals, currentGoalId, t]);

  const handleToggleHabit = useCallback((habitId: string, date: string) => {
    setHabits(prevHabits => prevHabits.map(habit => {
      if (habit.id === habitId) {
        const isCurrentlyCheckedInForDate = habit.lastCheckedIn && isValid(parseISO(habit.lastCheckedIn)) && format(parseISO(habit.lastCheckedIn), 'yyyy-MM-dd') === date;
        return { ...habit, lastCheckedIn: isCurrentlyCheckedInForDate ? undefined : new Date(date + 'T12:00:00Z').toISOString() }; 
      }
      return habit;
    }));
  }, []);

  const handleSaveHabit = useCallback(() => {
    if (!habitName.trim()) {
      alert(t('habit_alert_name_required')); return;
    }
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitName,
      frequency: habitFrequency,
    };
    setHabits(prev => [newHabit, ...prev]);
    setIsHabitModalOpen(false);
    setHabitName("");
    setHabitFrequency('daily');
  }, [habitName, habitFrequency, t]);


  return (
    <PageWrapper title={t('page_title_goals')}>
      <div className="flex flex-wrap justify-end gap-2 mb-6">
        <Button onClick={openNewGoalModal} data-testid="add-new-goal-btn">
          <PlusCircle className="mr-2 h-5 w-5" /> {t('goal_add_new_goal_button')}
        </Button>
        <Button onClick={() => setIsHabitModalOpen(true)} variant="outline" data-testid="add-new-habit-btn">
          <PlusCircle className="mr-2 h-5 w-5" /> {t('goal_add_new_habit_button')}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-headline font-semibold">{t('goal_your_goals_title')}</h2>
          {goals.length > 0 ? (
            goals.map(goal => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onEdit={handleEditGoal} 
                onDelete={handleDeleteGoal}
                onToggleSubGoal={handleToggleSubGoal} 
              />
            ))
          ) : (
             <div className="flex flex-col items-center justify-center p-10 text-center border rounded-lg min-h-[200px] bg-card">
              <Target className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">{t('goal_no_goals_placeholder')}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
           <h2 className="text-2xl font-headline font-semibold">{t('goal_habit_tracker_title')}</h2>
          <HabitTrackerCard 
            habits={habits} 
            onToggleHabit={handleToggleHabit} 
            currentDate={format(new Date(), 'yyyy-MM-dd')} 
          />
        </div>
      </div>

      <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
        <DialogContent data-testid="goal-modal" className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentGoalId ? t('goal_modal_edit_title') : t('goal_modal_add_title')}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 flex-grow">
            <div>
              <Label htmlFor="goalTitle">{t('goal_title_label')}</Label>
              <Input id="goalTitle" value={goalTitle} onChange={e => setGoalTitle(e.target.value)} placeholder={t('goal_title_placeholder')} />
            </div>
            <div>
              <Label htmlFor="goalDescription">{t('common_description')} {t('common_optional_suffix')}</Label>
              <Textarea id="goalDescription" value={goalDescription} onChange={e => setGoalDescription(e.target.value)} placeholder={t('goal_description_placeholder')} />
            </div>
            <div>
              <Label htmlFor="goalTargetDate">{t('common_target_date')} {t('common_optional_suffix')}</Label>
              <Input id="goalTargetDate" type="date" value={goalTargetDate} onChange={e => setGoalTargetDate(e.target.value)} />
            </div>
            
            <div className="space-y-3">
              <Label>{t('goal_sub_goals_label')}</Label>
              {subGoals.map((sg, index) => (
                <div key={sg.id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                  <Input 
                    value={sg.title} 
                    onChange={(e) => handleEditSubGoalTitle(sg.id, e.target.value)}
                    placeholder={`${t('goal_sub_goal_item_label_prefix')} ${index + 1}`}
                    className="flex-grow bg-background"
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveSubGoal(sg.id)} aria-label={t('goal_remove_sub_goal_aria_label')}>
                    <Trash2 className="h-4 w-4 text-destructive"/>
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input 
                  value={newSubGoalTitle} 
                  onChange={(e) => setNewSubGoalTitle(e.target.value)}
                  placeholder={t('goal_sub_goal_placeholder')}
                  onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubGoal();}}}
                />
                <Button type="button" onClick={handleAddSubGoal} variant="outline" size="sm">{t('common_add')}</Button>
              </div>
              {subGoals.length === 0 && <p className="text-xs text-muted-foreground">{t('goal_no_sub_goals_text')}</p>}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">{t('common_cancel')}</Button></DialogClose>
            <Button onClick={handleSaveGoal}>{t('goal_save_button')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isHabitModalOpen} onOpenChange={setIsHabitModalOpen}>
        <DialogContent data-testid="habit-modal">
          <DialogHeader>
            <DialogTitle>{t('habit_modal_add_title')}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 flex-grow">
            <div>
              <Label htmlFor="habitName">{t('habit_name_label')}</Label>
              <Input id="habitName" value={habitName} onChange={e => setHabitName(e.target.value)} placeholder={t('habit_name_placeholder')} />
            </div>
            <div>
              <Label htmlFor="habitFrequency">{t('habit_frequency_label')}</Label>
              <select 
                id="habitFrequency" 
                value={habitFrequency} 
                onChange={e => setHabitFrequency(e.target.value as 'daily' | 'weekly')}
                className="w-full p-2 border rounded-md bg-input text-sm"
              >
                <option value="daily">{t('habit_frequency_daily')}</option>
                <option value="weekly">{t('habit_frequency_weekly')}</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">{t('common_cancel')}</Button></DialogClose>
            <Button onClick={handleSaveHabit}>{t('habit_save_button')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageWrapper>
  );
}
    
    
