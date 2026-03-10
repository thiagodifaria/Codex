
      'use client';
import PageWrapper from "@/components/layout/page-wrapper";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, CalendarDays, Briefcase, Target, ListChecks, Edit3, BookOpenText, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useCallback } from 'react';
import type { JournalEntry, Goal, Task } from "@/types/codex"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { format, parseISO, isValid } from 'date-fns';
import { loadGoals, loadHabits, loadJournalEntries, loadProjects, loadTasks } from '@/lib/storage';

export default function DashboardPage() {
  const { t } = useTranslation('common');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [dashboardGoals, setDashboardGoals] = useState<Goal[]>([]);
  const [upcomingGlobalTasksData, setUpcomingGlobalTasksData] = useState<Task[]>([]);
  const [projectTasksInFocusData, setProjectTasksInFocusData] = useState<Array<Task & { projectName?: string }>>([]);
  const [projectMilestones, setProjectMilestones] = useState<Array<{ id: string; title?: string; dueDate: string; projectName?: string }>>([]);
  const [habitSummary, setHabitSummary] = useState(loadHabits());

  useEffect(() => {
    const storedEntries = loadJournalEntries().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const storedGoals = loadGoals();
    const storedHabits = loadHabits();
    const storedTasks = loadTasks();
    const storedProjects = loadProjects();

    setEntries(storedEntries);
    setDashboardGoals(storedGoals.slice(0, 2));
    setHabitSummary(storedHabits);

    const upcomingTasks = storedTasks
      .filter((task) => !task.projectId && task.status !== 'done')
      .sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    setUpcomingGlobalTasksData(upcomingTasks.slice(0, 3));

    const focusedProjectTasks = storedTasks
      .filter((task) => task.projectId && task.status !== 'done')
      .map((task) => ({
        ...task,
        projectName: storedProjects.find((project) => project.id === task.projectId)?.name,
      }))
      .sort((a, b) => Number(Boolean(b.projectName)) - Number(Boolean(a.projectName)));
    setProjectTasksInFocusData(focusedProjectTasks.slice(0, 3));

    const milestones = storedProjects
      .flatMap((project) =>
        (project.milestones || []).map((milestone) => ({
          ...milestone,
          projectName: project.name,
        }))
      )
      .filter((milestone) => !milestone.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    setProjectMilestones(milestones.slice(0, 3));
  }, [t]);

  const todayEntry = entries.find(entry => isValid(parseISO(entry.date)) && format(parseISO(entry.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'));


  return (
    <PageWrapper title={t('page_title_dashboard')}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 lg:col-span-3" data-testid="daily-summary-card">
          <CardHeader className="flex flex-row items-start justify-between pb-2 gap-2">
            <div className="flex-grow">
              <CardTitle className="text-xl font-medium">{t('dashboard_general_summary_title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t('dashboard_no_summary_placeholder')}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsBriefingModalOpen(true)}>
              {t('dashboard_view_briefing_button')}
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="upcoming-tasks-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">{t('dashboard_upcoming_global_tasks')}</CardTitle>
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {upcomingGlobalTasksData.length > 0 ? (
              <ul className="space-y-2">
                {upcomingGlobalTasksData.map(task => (
                  <li key={task.id} className="text-sm flex justify-between items-center">
                    <span>{task.title}</span>
                    <span className="text-xs text-muted-foreground">{task.dueDate ? format(parseISO(task.dueDate), 'PP') : ''}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('dashboard_no_global_tasks_placeholder')}</p>
            )}
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <Link href="/todo">{t('dashboard_view_all_tasks_button')}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="focused-project-tasks-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">{t('dashboard_focus_project_tasks')}</CardTitle>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {projectTasksInFocusData.length > 0 ? (
              <ul className="space-y-2">
                {projectTasksInFocusData.map(task => (
                  <li key={task.id} className="text-sm">
                    {task.title} <span className="text-xs text-muted-foreground">({task.projectName || t('nav_projects')})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('dashboard_no_focus_project_tasks_placeholder')}</p>
            )}
             <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
               <Link href="/projects">{t('dashboard_go_to_projects_button')}</Link>
             </Button>
          </CardContent>
        </Card>

        <Card data-testid="project-milestones-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">{t('dashboard_project_milestones')}</CardTitle>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {projectMilestones.length > 0 ? (
              <ul className="space-y-2">
                {projectMilestones.map((milestone) => (
                  <li key={milestone.id} className="text-sm">
                    {milestone.title} <span className="text-xs text-muted-foreground">({milestone.projectName || t('nav_projects')})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('project_detail_no_milestones_placeholder')}</p>
            )}
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <Link href="/projects">{t('dashboard_view_roadmap_button')}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="goal-progress-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">{t('dashboard_goal_progress')}</CardTitle>
            <Target className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dashboardGoals.length > 0 ? dashboardGoals.slice(0,2).map(goal => ( 
                <div key={goal.id}>
                  <p className="text-sm">{goal.title}: {goal.progress}%</p>
                  <div className="w-full bg-muted rounded-full h-2.5 mt-1">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                  </div>
                </div>
              )) : (
                 <p className="text-sm text-muted-foreground">{t('dashboard_briefing_no_goal_progress_modal')}</p>
              )}
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <Link href="/goals">{t('dashboard_view_goals_button')}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="habit-checkin-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">{t('dashboard_habit_checkins')}</CardTitle>
            <CheckSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {habitSummary.length > 0 ? (
              <ul className="space-y-2">
                {habitSummary.slice(0, 3).map((habit) => (
                  <li key={habit.id} className="text-sm flex items-center">
                    <CheckSquare className={`h-4 w-4 mr-2 ${habit.lastCheckedIn ? 'text-green-500' : 'text-muted-foreground'}`} />
                    {habit.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('habit_tracker_no_habits_placeholder')}</p>
            )}
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <Link href="/goals">{t('dashboard_update_habits_button')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isBriefingModalOpen} onOpenChange={setIsBriefingModalOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl" data-testid="daily-briefing-modal">
          <DialogHeader>
            <DialogTitle>{t('dashboard_daily_briefing_modal_title')}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 p-1 pr-4">
              <section>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <BookOpenText className="mr-2 h-5 w-5 text-primary" /> {t('dashboard_briefing_recent_journal')}
                </h3>
                {todayEntry ? (
                  <div>
                    <h4 className="font-medium">{todayEntry.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">{(todayEntry.content || '').replace(/<[^>]+>/g, '')}</p>
                     <Button variant="link" size="sm" asChild className="px-0 h-auto">
                        <Link href="/journal">{t('dashboard_view_full_entry_button')}</Link>
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('dashboard_briefing_no_recent_journal')}</p>
                )}
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <ListChecks className="mr-2 h-5 w-5 text-primary" /> {t('dashboard_briefing_upcoming_tasks')}
                </h3>
                {upcomingGlobalTasksData.length > 0 ? (
                  <ul className="space-y-1">
                    {upcomingGlobalTasksData.slice(0,3).map(task => (
                      <li key={task.id} className="text-sm flex justify-between items-center">
                        <span>{task.title}</span>
                        <span className="text-xs text-muted-foreground">{task.dueDate ? format(parseISO(task.dueDate), 'PP') : ''}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('dashboard_briefing_no_upcoming_tasks')}</p>
                )}
                 <Button variant="link" size="sm" asChild className="px-0 h-auto mt-1">
                    <Link href="/todo">{t('dashboard_view_all_tasks_button')}</Link>
                 </Button>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-primary" /> {t('dashboard_briefing_focus_project_tasks')}
                </h3>
                {projectTasksInFocusData.length > 0 ? (
                  <ul className="space-y-1">
                    {projectTasksInFocusData.slice(0,3).map(task => (
                      <li key={task.id} className="text-sm">
                        {task.title} <span className="text-xs text-muted-foreground">({task.projectName || t('nav_projects')})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('dashboard_briefing_no_focus_project_tasks_modal')}</p>
                )}
                <Button variant="link" size="sm" asChild className="px-0 h-auto mt-1">
                   <Link href="/projects">{t('dashboard_go_to_projects_button')}</Link>
                </Button>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-primary" /> {t('dashboard_briefing_goal_progress')}
                </h3>
                {dashboardGoals.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardGoals.map(goal => (
                      <div key={goal.id}>
                        <div className="flex justify-between text-sm mb-0.5">
                            <span className="font-medium">{goal.title}</span>
                            <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} aria-label={`${t('goal_progress_label')}: ${goal.progress}%`} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('dashboard_briefing_no_goal_progress_modal')}</p>
                )}
                 <Button variant="link" size="sm" asChild className="px-0 h-auto mt-1">
                    <Link href="/goals">{t('dashboard_view_goals_button')}</Link>
                 </Button>
              </section>
            </div>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t('common_close')}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageWrapper>
  );
}
    
    
