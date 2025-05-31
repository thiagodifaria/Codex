
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from "@/components/layout/page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import type { Project, Task, Milestone, ResourceLink, ProjectStatus, TaskStatus, TaskPriority } from '@/types/codex';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, LinkIcon, Flag, ListTodo, Info, Trash2, Edit2, FileText, CalendarDays } from 'lucide-react';
import LoadingAnimation from '@/components/shared/loading-animation';
import { TiptapEditor } from '@/components/shared/tiptap-editor';
import { NewTaskForm } from '@/components/todo/new-task-form';
import { TaskItem } from '@/components/todo/task-item';
import TaskCompletionAnimation from '@/components/shared/task-completion-animation';
import { format, parseISO, isValid } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';


const projectStatusColors: Record<ProjectStatus, string> = {
  planning: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  'on-hold': "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  archived: "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300",
};


const getDummyProjectsData = (t: Function): Project[] => [
  { 
    id: 'codex-app', nameKey: "projects_dummy_proj1_name", 
    descriptionKey: "projects_dummy_proj1_desc", 
    status: 'active', focus: true, 
    startDate: new Date(2024, 5, 1).toISOString(), endDate: new Date(2024, 11, 31).toISOString(),
    milestones: [
      { id: 'm1', titleKey: "projects_dummy_proj1_milestone1_title", dueDate: "2024-09-01", completed: false },
      { id: 'm2', titleKey: "projects_dummy_proj1_milestone2_title", dueDate: "2024-10-15", completed: false },
    ],
    resources: [
      { id: 'r1', titleKey: "projects_dummy_proj1_resource1_title", url: "https://figma.com/..." },
      { id: 'r2', titleKey: "projects_dummy_proj1_resource2_title", url: "https://docs.example.com/..." },
    ]
  },
  { 
    id: 'personal-website', nameKey: "projects_dummy_proj2_name", 
    descriptionKey: "projects_dummy_proj2_desc", 
    status: 'planning', focus: false, 
    startDate: new Date(2024, 8, 1).toISOString(), 
    milestones: [], resources: [] 
  },
];

const getDummyTasksData = (t: Function): { [projectId: string]: Task[] } => ({
  'codex-app': [
    { id: 't1', projectId: 'codex-app', titleKey: "projects_task_proj1_task1_title", completed: true, status: 'done', priority: 'high', descriptionKey: "projects_task_proj1_task1_desc" },
    { id: 't2', projectId: 'codex-app', titleKey: "projects_task_proj1_task2_title", completed: false, status: 'in-progress', dueDate: "2024-08-10", priority: 'high', descriptionKey: "projects_task_proj1_task2_desc" },
    { id: 't3', projectId: 'codex-app', titleKey: "projects_task_proj1_task3_title", completed: false, status: 'todo', priority: 'medium', descriptionKey: "projects_task_proj1_task3_desc" },
  ],
  'personal-website': [
    { id: 't4', projectId: 'personal-website', titleKey: "projects_task_proj2_task1_title", completed: true, status: 'done', priority: 'medium', descriptionKey: "projects_task_proj2_task1_desc" },
    { id: 't5', projectId: 'personal-website', titleKey: "projects_task_proj2_task2_title", completed: false, status: 'todo', priority: 'low', descriptionKey: "projects_task_proj2_task2_desc" },
  ]
});


export default function ProjectDetailPage() {
  const { t } = useTranslation('common');
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [projectNotes, setProjectNotes] = useState("<p></p>");

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceUrl, setNewResourceUrl] = useState("");

  const [deletingProjectTaskId, setDeletingProjectTaskId] = useState<string | null>(null);


  useEffect(() => {
    if (projectId) {
      const dummyProjectsData = getDummyProjectsData(t);
      const dummyTasksData = getDummyTasksData(t);

      setTimeout(() => {
        const foundProject = dummyProjectsData.find(p => p.id === projectId);
        if (foundProject) {
          setProject({
            ...foundProject,
            name: foundProject.nameKey ? t(foundProject.nameKey) : '',
            description: foundProject.descriptionKey ? t(foundProject.descriptionKey) : '',
            milestones: (foundProject.milestones || []).map(m => ({...m, title: m.titleKey ? t(m.titleKey): ''})),
            resources: (foundProject.resources || []).map(r => ({...r, title: r.titleKey ? t(r.titleKey) : ''}))
          });
          setTasks((dummyTasksData[projectId] || []).map(task => ({
            ...task, 
            title: task.titleKey ? t(task.titleKey) : '',
            description: task.descriptionKey ? t(task.descriptionKey) : task.description,
            completed: task.status === 'done'
          })));
          setProjectNotes(localStorage.getItem(`project_notes_${projectId}`) || `<p>${t('project_detail_notes_placeholder', { projectName: foundProject.nameKey ? t(foundProject.nameKey) : '' })}</p>`);
        } else {
          console.error("Project not found");
        }
        setIsLoading(false);
      }, 500);
    }
  }, [projectId, router, t]);

  const handleSaveProjectNotes = useCallback((notes: string) => {
    setProjectNotes(notes);
    localStorage.setItem(`project_notes_${projectId}`, notes);
  }, [projectId]);
  

  const handleAddTaskToProject = useCallback((newTaskData: Omit<Task, 'id' | 'completed' | 'projectId'>) => {
    if (!project) return;
    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
      completed: newTaskData.status === 'done',
      projectId: project.id,
      title: newTaskData.title, // Already provided by form
      description: newTaskData.description
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    // Note: dummyTasksData is not directly mutable like this in a real scenario. 
    // This is for local simulation only.
    // dummyTasksData[project.id] = [newTask, ...(dummyTasksData[project.id] || [])]; 
  }, [project]);

  const handleToggleTaskComplete = useCallback((taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newStatus = task.status === 'done' ? 'todo' : 'done';
          if (newStatus === 'done' && task.status !== 'done') {
            setTaskCompleted(true);
          }
          return { ...task, status: newStatus, completed: newStatus === 'done' };
        }
        return task;
      })
    );
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setDeletingProjectTaskId(taskId);
    setTimeout(() => {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setDeletingProjectTaskId(null);
    }, 300); 
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    alert(t('common_edit_task_feature_not_implemented', {taskTitle: task.title}));
  }, [t]);

  const handleSaveMilestone = useCallback(() => {
    if (!project || !newMilestoneTitle || !newMilestoneDate) {
      alert(t('project_alert_milestone_title_date_required'));
      return;
    }
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: newMilestoneTitle,
      dueDate: new Date(newMilestoneDate).toISOString(),
      completed: false,
    };
    setProject(prev => prev ? { ...prev, milestones: [...(prev.milestones || []), newMilestone] } : null);
    setIsMilestoneModalOpen(false);
    setNewMilestoneTitle("");
    setNewMilestoneDate("");
  }, [project, newMilestoneTitle, newMilestoneDate, t]);

  const handleSaveResource = useCallback(() => {
    if (!project || !newResourceTitle || !newResourceUrl) {
      alert(t('project_alert_resource_title_url_required'));
      return;
    }
    try {
      // Basic URL validation, can be improved
      if (!newResourceUrl.startsWith('http://') && !newResourceUrl.startsWith('https://')) {
          throw new Error("Invalid URL");
      }
      new URL(newResourceUrl);
    } catch (_) {
      alert(t('project_alert_invalid_url'));
      return;
    }
    const newResource: ResourceLink = {
      id: Date.now().toString(),
      title: newResourceTitle,
      url: newResourceUrl,
    };
    setProject(prev => prev ? { ...prev, resources: [...(prev.resources || []), newResource] } : null);
    setIsResourceModalOpen(false);
    setNewResourceTitle("");
    setNewResourceUrl("");
  }, [project, newResourceTitle, newResourceUrl, t]);
  
  const handleToggleMilestoneComplete = useCallback((milestoneId: string) => {
    if (!project) return;
    setProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        milestones: (prev.milestones || []).map(m => 
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        )
      };
    });
  }, [project]);


  const sortedTasks = React.useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;
      return 0;
    });
  }, [tasks]);


  if (isLoading) {
    return <PageWrapper><LoadingAnimation fullPage={false} /></PageWrapper>;
  }

  if (!project) {
    return <PageWrapper title={t('project_detail_not_found_title')}><p>{t('project_detail_not_found_message')}</p></PageWrapper>;
  }

  return (
    <PageWrapper title={project.name} className="pb-12">
      <Card className="mb-6 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
            <Badge className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border-transparent", projectStatusColors[project.status])}>
              {t(`project_status_${project.status.replace('-', '_')}`)}
            </Badge>
            {project.focus && (
              <Badge variant="outline" className="text-xs">
                {t('project_in_focus_badge')}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {project.startDate && isValid(parseISO(project.startDate)) && (
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                <strong>{t('project_start_date_prefix')}</strong>&nbsp;{format(parseISO(project.startDate), 'PPP')}
              </div>
            )}
            {project.endDate && isValid(parseISO(project.endDate)) && (
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                <strong>{t('project_end_date_prefix')}</strong>&nbsp;{format(parseISO(project.endDate), 'PPP')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="overview"><Info className="mr-2 h-4 w-4 inline-block"/>{t('project_detail_tab_overview')}</TabsTrigger>
          <TabsTrigger value="tasks"><ListTodo className="mr-2 h-4 w-4 inline-block"/>{t('project_detail_tab_tasks', {count: tasks.filter(t => t.status !== 'done').length})}</TabsTrigger>
          <TabsTrigger value="roadmap"><Flag className="mr-2 h-4 w-4 inline-block"/>{t('project_detail_tab_roadmap')}</TabsTrigger>
          <TabsTrigger value="resources"><LinkIcon className="mr-2 h-4 w-4 inline-block"/>{t('project_detail_tab_resources')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>{t('project_detail_notes_card_title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <TiptapEditor
                 id={`projectNotes-${project.id}`}
                 value={projectNotes}
                 onChange={handleSaveProjectNotes}
                 placeholder={t('project_detail_notes_placeholder', { projectName: project.name })}
               />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>{t('project_detail_tasks_card_title')}</CardTitle>
               <div className="flex justify-end mt-[-2.5rem]">
                <Button size="sm" onClick={() => setIsTaskFormOpen(!isTaskFormOpen)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> {isTaskFormOpen ? t('project_detail_close_form_button') : t('project_detail_add_task_button')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <NewTaskForm 
                onAddTask={handleAddTaskToProject} 
                isOpen={isTaskFormOpen} 
                onToggle={() => setIsTaskFormOpen(!isTaskFormOpen)}
                formTitle={t('todo_new_task_form_title_project')}
              />
              {sortedTasks.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {sortedTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggleComplete={handleToggleTaskComplete} 
                      onDelete={handleDeleteTask} 
                      onEdit={handleEditTask}
                      isDeleting={task.id === deletingProjectTaskId}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">{t('project_detail_no_tasks_placeholder')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap">
          <Card>
            <CardHeader>
              <CardTitle>{t('project_detail_roadmap_card_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              {project.milestones && project.milestones.length > 0 ? (
                <ul className="space-y-4">
                  {project.milestones.map(milestone => (
                    <li key={milestone.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className={`font-medium ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>{milestone.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('project_detail_milestone_due_date_prefix')} {isValid(parseISO(milestone.dueDate)) ? format(parseISO(milestone.dueDate), 'PPP') : t('common_invalid_date')}
                        </p>
                      </div>
                      <Checkbox 
                        checked={milestone.completed} 
                        onCheckedChange={() => handleToggleMilestoneComplete(milestone.id)}
                        aria-label={t('project_detail_milestone_mark_complete_aria_label', {milestoneTitle: milestone.title})} 
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">{t('project_detail_no_milestones_placeholder')}</p>
              )}
              <Button variant="outline" className="mt-4" onClick={() => setIsMilestoneModalOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/>{t('project_detail_add_milestone_button')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>{t('project_detail_resources_card_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              {project.resources && project.resources.length > 0 ? (
                <ul className="space-y-3">
                  {project.resources.map(resource => (
                    <li key={resource.id} className="p-3 border rounded-md hover:bg-accent/50 transition-colors">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                        <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{resource.title}</span>
                        <LinkIcon className="ml-auto h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">{t('project_detail_no_resources_placeholder')}</p>
              )}
              <Button variant="outline" className="mt-4" onClick={() => setIsResourceModalOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/>{t('project_detail_add_resource_button')}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <TaskCompletionAnimation visible={taskCompleted} onAnimationEnd={() => setTaskCompleted(false)} />

      <Dialog open={isMilestoneModalOpen} onOpenChange={setIsMilestoneModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('project_detail_milestone_modal_title')}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="milestoneTitle">{t('project_detail_milestone_title_label')}</Label>
              <Input id="milestoneTitle" value={newMilestoneTitle} onChange={e => setNewMilestoneTitle(e.target.value)} placeholder={t('project_detail_milestone_title_placeholder')} />
            </div>
            <div>
              <Label htmlFor="milestoneDueDate">{t('common_due_date')}</Label>
              <Input id="milestoneDueDate" type="date" value={newMilestoneDate} onChange={e => setNewMilestoneDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">{t('common_cancel')}</Button></DialogClose>
            <Button onClick={handleSaveMilestone}>{t('project_detail_milestone_save_button')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResourceModalOpen} onOpenChange={setIsResourceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('project_detail_resource_modal_title')}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="resourceTitle">{t('project_detail_resource_title_label')}</Label>
              <Input id="resourceTitle" value={newResourceTitle} onChange={e => setNewResourceTitle(e.target.value)} placeholder={t('project_detail_resource_title_placeholder')} />
            </div>
            <div>
              <Label htmlFor="resourceUrl">{t('project_detail_resource_url_label')}</Label>
              <Input id="resourceUrl" type="url" value={newResourceUrl} onChange={e => setNewResourceUrl(e.target.value)} placeholder={t('project_detail_resource_url_placeholder')} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">{t('common_cancel')}</Button></DialogClose>
            <Button onClick={handleSaveResource}>{t('project_detail_resource_save_button')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageWrapper>
  );
}
    
