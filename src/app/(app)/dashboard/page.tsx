
'use client';
import PageWrapper from "@/components/layout/page-wrapper";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, CalendarDays, Briefcase, Target, ListChecks, Edit3 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from 'react-i18next';

const summaryKey = "dashboard_dummy_summary";
const upcomingGlobalTasksData = [
  { id: '1', titleKey: "dashboard_task_pay_bills", dueDate: "2024-08-15" },
  { id: '2', titleKey: "dashboard_task_schedule_dentist", dueDate: "2024-08-20" },
];
const projectTasksInFocusData = [
  { id: 'p1_t1', titleKey: "dashboard_project_task_logo_design", projectKey: "dashboard_project_phoenix" },
  { id: 'p2_t1', titleKey: "dashboard_project_task_user_testing", projectKey: "dashboard_webapp_revamp" },
];

export default function DashboardPage() {
  const { t } = useTranslation('common');

  return (
    <PageWrapper title={t('page_title_dashboard')}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 lg:col-span-3" data-testid="daily-summary-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium">{t('dashboard_day_diary_summary')}</CardTitle>
            <Edit3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t(summaryKey) || t('dashboard_no_summary_placeholder')}</p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/journal">{t('dashboard_view_full_entry_button')}</Link>
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
                    <span>{t(task.titleKey)}</span>
                    <span className="text-xs text-muted-foreground">{task.dueDate}</span>
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
                    {t(task.titleKey)} <span className="text-xs text-muted-foreground">({t(task.projectKey)})</span>
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
            <p className="text-sm text-muted-foreground">{t('dashboard_milestone_alpha_release')}</p>
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
              <div>
                <p className="text-sm">{t('dashboard_goal_learn_spanish')}: 60%</p>
                <div className="w-full bg-muted rounded-full h-2.5 mt-1">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
              <div>
                <p className="text-sm">{t('dashboard_goal_complete_project')}: 30%</p>
                <div className="w-full bg-muted rounded-full h-2.5 mt-1">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: "30%" }}></div>
                </div>
              </div>
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
            <ul className="space-y-2">
              <li className="text-sm flex items-center"><CheckSquare className="h-4 w-4 mr-2 text-green-500"/> {t('dashboard_habit_read_30_mins')}</li>
              <li className="text-sm flex items-center"><CheckSquare className="h-4 w-4 mr-2 text-muted-foreground"/> {t('dashboard_habit_morning_exercise')}</li>
              <li className="text-sm flex items-center"><CheckSquare className="h-4 w-4 mr-2 text-green-500"/> {t('dashboard_habit_drink_water')}</li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <Link href="/goals">{t('dashboard_update_habits_button')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
