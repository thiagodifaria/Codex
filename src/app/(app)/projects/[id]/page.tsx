
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from "@/components/layout/page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import type { Project, Task, Milestone, ResourceLink, ProjectStatus, TaskStatus, TaskPriority } from '@/types/codex';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, LinkIcon, Flag, ListTodo, Info, Trash2, Edit2, FileText, CalendarDays, GripVertical, Edit3, Star, Tag as TagIcon } from 'lucide-react'; 
import LoadingAnimation from '@/components/shared/loading-animation';
import { TiptapEditor } from '@/components/shared/tiptap-editor';
import { NewTaskForm } from '@/components/todo/new-task-form';
import { TaskItem } from '@/components/todo/task-item';
import TaskCompletionAnimation from '@/components/shared/task-completion-animation';
import { format, parseISO, isValid } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';


const projectStatusColors: Record<ProjectStatus, string> = {
  planning: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  'on-hold': "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  archived: "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300",
};
const projectStatusOptions: ProjectStatus[] = ['planning', 'active', 'on-hold', 'completed', 'archived'];


const getDummyProjectsData = (t: Function): Project[] => [
  { 
    id: 'codex-app', nameKey: "projects_dummy_proj1_name", 
    descriptionKey: "projects_dummy_proj1_desc", 
    status: 'active', focus: true, 
    startDate: new Date(2024, 5, 1).toISOString(), endDate: new Date(2024, 11, 31).toISOString(),
    tags: ["dev", "productivity", "saas"],
    milestones: [
      { id: 'm1', titleKey: "projects_dummy_proj1_milestone1_title", dueDate: "2024-09-01", completed: false },
      { id: 'm2', titleKey: "projects_dummy_proj1_milestone2_title", dueDate: "2024-10-15", completed: false },
    ],
    resources: [
      { id: 'r1', titleKey: "projects_dummy_proj1_resource1_title", url: "https:
      { id: 'r2', titleKey: "projects_dummy_proj1_resource2_title", url: "https:
    ]
  },
  { 
    id: 'personal-website', nameKey: "projects_dummy_proj2_name", 
    descriptionKey: "projects_dummy_proj2_desc", 
    status: 'planning', focus: false, 
    startDate: new Date(2024, 8, 1).toISOString(), 
    tags: ["web", "portfolio"],
    milestones: [], resources: [] 
  },
];

const getDummyTasksData = (t: Function): { [projectId: string]: Task[] } => ({
  'codex-app': [
    { id: 't1', projectId: 'codex-app', titleKey: "projects_task_proj1_task1_title", completed: true, status: 'done', priority: 'high', descriptionKey: "projects_task_proj1_task1_desc", tags: ["setup", "config"] },
    { id: 't2', projectId: 'codex-app', titleKey: "projects_task_proj1_task2_title", completed: false, status: 'in-progress', dueDate: "2024-08-10", priority: 'high', descriptionKey: "projects_task_proj1_task2_desc", tags: ["backend", "database"] },
    { id: 't3', projectId: 'codex-app', titleKey: "projects_task_proj1_task3_title", completed: false, status: 'todo', priority: 'medium', descriptionKey: "projects_task_proj1_task3_desc", tags: ["auth", "security"] },
  ],
  'personal-website': [
    { id: 't4', projectId: 'personal-website', titleKey: "projects_task_proj2_task1_title", completed: true, status: 'done', priority: 'medium', descriptionKey: "projects_task_proj2_task1_desc", tags: ["design", "ui"] },
    { id: 't5', projectId: 'personal-website', titleKey: "projects_task_proj2_task2_title", completed: false, status: 'todo', priority: 'low', descriptionKey: "projects_task_proj2_task2_desc", tags: ["content", "writing"] },
  ]
});

const taskStatusOrder: TaskStatus[] = ['todo', 'in-progress', 'in-review', 'blocked', 'done'];


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

  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingProjectName, setEditingProjectName] = useState("");
  const [editingProjectDescription, setEditingProjectDescription] = useState("");
  const [editingProjectStatus, setEditingProjectStatus] = useState<ProjectStatus>('planning');
  const [editingProjectStartDate, setEditingProjectStartDate] = useState<Date | undefined>();
  const [editingProjectEndDate, setEditingProjectEndDate] = useState<Date | undefined>();
  const [editingProjectFocus, setEditingProjectFocus] = useState(false);
  const [editingProjectTagsString, setEditingProjectTagsString] = useState("");
  
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined');
  }, []);


  useEffect(() => {
    if (projectId) {
      const dummyProjectsData = getDummyProjectsData(t);
      const dummyTasksData = getDummyTasksData(t);

      setTimeout(() => {
        const foundProject = dummyProjectsData.find(p => p.id === projectId);
        if (foundProject) {
          const translatedProject = {
            ...foundProject,
            name: foundProject.nameKey ? t(foundProject.nameKey) : foundProject.name || '',
            description: foundProject.descriptionKey ? t(foundProject.descriptionKey) : foundProject.description || '',
            milestones: (foundProject.milestones || []).map(m => ({...m, title: m.titleKey ? t(m.titleKey): m.title || ''})),
            resources: (foundProject.resources || []).map(r => ({...r, title: r.titleKey ? t(r.titleKey) : r.title || ''}))
          };
          setProject(translatedProject);
          setTasks((dummyTasksData[projectId] || []).map(task => ({
            ...task, 
            title: task.titleKey ? t(task.titleKey) : task.title || '',
            description: task.descriptionKey ? t(task.descriptionKey) : task.description,
            tags: task.tags || [],
            completed: task.status === 'done'
          })));
          setProjectNotes(localStorage.getItem(`project_notes_${projectId}`) || `<p>${t('project_detail_notes_placeholder', { projectName: translatedProject.name })}</p>`);
        
          setEditingProjectName(translatedProject.name);
          setEditingProjectDescription(translatedProject.description);
          setEditingProjectStatus(translatedProject.status);
          setEditingProjectFocus(translatedProject.focus);
          setEditingProjectStartDate(translatedProject.startDate ? parseISO(translatedProject.startDate) : undefined);
          setEditingProjectEndDate(translatedProject.endDate ? parseISO(translatedProject.endDate) : undefined);
          setEditingProjectTagsString(translatedProject.tags?.join(', ') || "");

        }
        setIsLoading(false);
      }, 500);
    }
  }, [projectId, t]);

  const openEditProjectModal = useCallback(() => {
    if (project) {
      setEditingProjectName(project.name);
      setEditingProjectDescription(project.description);
      setEditingProjectStatus(project.status);
      setEditingProjectFocus(project.focus);
      setEditingProjectStartDate(project.startDate && isValid(parseISO(project.startDate)) ? parseISO(project.startDate) : undefined);
      setEditingProjectEndDate(project.endDate && isValid(parseISO(project.endDate)) ? parseISO(project.endDate) : undefined);
      setEditingProjectTagsString(project.tags?.join(', ') || "");
      setIsEditProjectModalOpen(true);
    }
  }, [project]);

  const handleSaveEditedProjectDetails = useCallback(() => {
    if (!project) return;
    if (!editingProjectName.trim()) {
      alert(t('project_alert_name_required'));
      return;
    }
    const tags = editingProjectTagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    const updatedProjectDetails: Partial<Project> = {
      name: editingProjectName,
      description: editingProjectDescription,
      status: editingProjectStatus,
      focus: editingProjectFocus,
      startDate: editingProjectStartDate?.toISOString(),
      endDate: editingProjectEndDate?.toISOString(),
      tags: tags,
    };
    setProject(prev => prev ? { ...prev, ...updatedProjectDetails } : null);
    setIsEditProjectModalOpen(false);
  }, [project, editingProjectName, editingProjectDescription, editingProjectStatus, editingProjectFocus, editingProjectStartDate, editingProjectEndDate, editingProjectTagsString, t]);


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
      title: newTaskData.title, 
      description: newTaskData.description,
      tags: newTaskData.tags || []
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
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
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
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
      if (!newResourceUrl.startsWith('http:
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


  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      todo: [],
      'in-progress': [],
      blocked: [],
      'in-review': [],
      done: [],
    };
    tasks.forEach(task => {
      groups[task.status]?.push(task);
    });
    return groups;
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    
    setTasks(prevTasks => {
        const taskToMove = prevTasks.find(t => t.id === draggableId);
        if (!taskToMove) return prevTasks;

        const tasksWithoutMoved = prevTasks.filter(t => t.id !== draggableId);
        
        const updatedTask = { 
          ...taskToMove, 
          status: destination.droppableId as TaskStatus, 
          completed: destination.droppableId === 'done' 
        };
        
        const newTasksArray = [...tasksWithoutMoved];
        
        
        
        
        
        let insertAtIndex = newTasksArray.length; 

        const tasksInDestinationCol = tasksWithoutMoved.filter(t => t.status === destination.droppableId as TaskStatus);
        if (tasksInDestinationCol.length > 0) {
            if (destination.index < tasksInDestinationCol.length) {
                const taskAtDestinationIndex = tasksInDestinationCol[destination.index];
                insertAtIndex = newTasksArray.findIndex(t => t.id === taskAtDestinationIndex.id);
            } else { 
                if (tasksInDestinationCol.length > 0) {
                    const lastTaskInCol = tasksInDestinationCol[tasksInDestinationCol.length - 1];
                    insertAtIndex = newTasksArray.findIndex(t => t.id === lastTaskInCol.id) + 1;
                } else { 
                    
                    const nextStatusIndex = taskStatusOrder.indexOf(destination.droppableId as TaskStatus) + 1;
                    let foundNextGroup = false;
                    for (let i = nextStatusIndex; i < taskStatusOrder.length; i++) {
                        const firstTaskOfNextGroup = newTasksArray.find(t => t.status === taskStatusOrder[i]);
                        if (firstTaskOfNextGroup) {
                            insertAtIndex = newTasksArray.findIndex(t => t.id === firstTaskOfNextGroup.id);
                            foundNextGroup = true;
                            break;
                        }
                    }
                    if (!foundNextGroup) insertAtIndex = newTasksArray.length;
                }
            }
        } else { 
             const currentStatusIndex = taskStatusOrder.indexOf(destination.droppableId as TaskStatus);
             let foundPreviousGroupLastTask = false;
             for (let i = currentStatusIndex -1; i >=0; i--) {
                 const tasksInPrevCol = newTasksArray.filter(t => t.status === taskStatusOrder[i]);
                 if (tasksInPrevCol.length > 0) {
                     const lastTaskInPrevCol = tasksInPrevCol[tasksInPrevCol.length-1];
                     insertAtIndex = newTasksArray.findIndex(t=>t.id === lastTaskInPrevCol.id) +1;
                     foundPreviousGroupLastTask = true;
                     break;
                 }
             }
             if(!foundPreviousGroupLastTask && currentStatusIndex > 0) { 
                insertAtIndex = 0; 
             } else if (!foundPreviousGroupLastTask && currentStatusIndex === 0) {
                insertAtIndex = 0;
             }
        }


        newTasksArray.splice(insertAtIndex, 0, updatedTask);
        return newTasksArray;
    });
  };


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
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-headline">{project.name}</CardTitle>
            <Button variant="outline" size="sm" onClick={openEditProjectModal} data-testid="edit-project-detail-btn">
              <Edit3 className="mr-2 h-4 w-4" /> {t('project_detail_edit_button')}
            </Button>
          </div>
          <CardDescription>{project.description || t('project_no_description_placeholder')}</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
            <Badge className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border-transparent", projectStatusColors[project.status])}>
              {t(`project_status_${project.status.replace('-', '_')}`)}
            </Badge>
            {project.focus && (
              <Badge variant="outline" className="text-xs border-primary text-primary flex items-center gap-1">
                <Star className="h-3 w-3" /> {t('project_in_focus_badge')}
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
           {project.tags && project.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <TagIcon className="h-3 w-3 mr-1"/>{tag}
                </Badge>
              ))}
            </div>
          )}
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
             <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>{t('project_detail_tasks_card_title')}</CardTitle>
                <Button size="sm" onClick={() => setIsTaskFormOpen(!isTaskFormOpen)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> {isTaskFormOpen ? t('project_detail_close_form_button') : t('project_detail_add_task_button')}
                </Button>
              </CardHeader>
            <CardContent>
              <NewTaskForm 
                onAddTask={handleAddTaskToProject} 
                isOpen={isTaskFormOpen} 
                onToggle={() => setIsTaskFormOpen(!isTaskFormOpen)}
                formTitle={t('todo_new_task_form_title_project')}
              />
              {tasks.length > 0 ? (
                isBrowser ? (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-4 overflow-x-auto pb-4 mt-6">
                      {taskStatusOrder.map(status => {
                        const tasksInGroup = groupedTasks[status];
                        return (
                          <Droppable key={status} droppableId={status}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={cn(
                                  "p-3 bg-muted/50 rounded-lg w-64 sm:w-72 lg:w-80 flex-shrink-0 transition-colors duration-150",
                                  snapshot.isDraggingOver ? "bg-primary/10" : "bg-muted/50"
                                )}
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="font-semibold text-md capitalize">{t(`task_status_${status.replace('-', '_')}`)}</h3>
                                  <Badge variant="secondary" className="text-xs">{tasksInGroup.length}</Badge>
                                </div>
                                <div className="space-y-3 min-h-[50px] max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                                  {tasksInGroup.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                      {(providedDraggable, snapshotDraggable) => (
                                        <TaskItem 
                                          task={task} 
                                          onToggleComplete={handleToggleTaskComplete} 
                                          onDelete={() => handleDeleteTask(task.id)} 
                                          onEdit={handleEditTask}
                                          isDeleting={task.id === deletingProjectTaskId}
                                          onAnimationEnd={() => task.id === deletingProjectTaskId && setDeletingProjectTaskId(null)}
                                          innerRef={providedDraggable.innerRef}
                                          draggableProps={providedDraggable.draggableProps}
                                          dragHandleProps={providedDraggable.dragHandleProps}
                                          isDragging={snapshotDraggable.isDragging}
                                        />
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                  {tasksInGroup.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">{t('project_detail_no_tasks_in_status_placeholder')}</p>}
                                </div>
                              </div>
                            )}
                          </Droppable>
                        );
                      })}
                    </div>
                  </DragDropContext>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-4 mt-6">
                    {taskStatusOrder.map(status => {
                      const tasksInGroup = groupedTasks[status];
                      return (
                        <div key={status} className="p-3 bg-muted/50 rounded-lg w-64 sm:w-72 lg:w-80 flex-shrink-0">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-md capitalize">{t(`task_status_${status.replace('-', '_')}`)}</h3>
                            <Badge variant="secondary" className="text-xs">{tasksInGroup.length}</Badge>
                          </div>
                          <div className="space-y-3 min-h-[50px] max-h-[calc(100vh-380px)] overflow-y-auto pr-1"> 
                            {tasksInGroup.map(task => (
                              <TaskItem 
                                key={task.id} 
                                task={task} 
                                onToggleComplete={handleToggleTaskComplete} 
                                onDelete={() => handleDeleteTask(task.id)} 
                                onEdit={handleEditTask}
                                isDeleting={task.id === deletingProjectTaskId}
                                onAnimationEnd={() => task.id === deletingProjectTaskId && setDeletingProjectTaskId(null)}
                              />
                            ))}
                            {tasksInGroup.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">{t('project_detail_no_tasks_in_status_placeholder')}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
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

      <Dialog open={isEditProjectModalOpen} onOpenChange={setIsEditProjectModalOpen}>
        <DialogContent data-testid="edit-project-detail-modal" className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('project_modal_edit_title')}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 flex-grow max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <Label htmlFor="editProjectName">{t('project_name_label')}</Label>
              <Input 
                id="editProjectName" 
                value={editingProjectName}
                onChange={(e) => setEditingProjectName(e.target.value)}
                placeholder={t('project_name_placeholder')}
              />
            </div>
            <div>
              <Label htmlFor="editProjectDescription">{t('common_description')} {t('common_optional_suffix')}</Label>
              <Textarea 
                id="editProjectDescription"
                value={editingProjectDescription}
                onChange={(e) => setEditingProjectDescription(e.target.value)}
                placeholder={t('project_description_placeholder')}
              />
            </div>
            <div>
              <Label htmlFor="editProjectTags">{t('common_tags')} {t('common_optional_suffix')}</Label>
              <Input
                id="editProjectTags"
                value={editingProjectTagsString}
                onChange={(e) => setEditingProjectTagsString(e.target.value)}
                placeholder={t('common_tags_placeholder')}
              />
            </div>
            <div>
              <Label htmlFor="editProjectStatus">{t('common_status')}</Label>
              <Select value={editingProjectStatus} onValueChange={(value: ProjectStatus) => setEditingProjectStatus(value)}>
                <SelectTrigger id="editProjectStatus">
                  <SelectValue placeholder={t('project_status_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {projectStatusOptions.map(option => (
                    <SelectItem key={option} value={option}>{t(`project_status_${option.replace('-', '_')}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editProjectStartDate">{t('common_start_date')} {t('common_optional_suffix')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {editingProjectStartDate ? format(editingProjectStartDate, "PPP") : <span>{t('common_pick_a_date')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={editingProjectStartDate} onSelect={setEditingProjectStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="editProjectEndDate">{t('common_end_date')} {t('common_optional_suffix')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {editingProjectEndDate ? format(editingProjectEndDate, "PPP") : <span>{t('common_pick_a_date')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={editingProjectEndDate} onSelect={setEditingProjectEndDate} disabled={(date) => editingProjectStartDate ? date < editingProjectStartDate : false} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="editProjectFocus" 
                checked={editingProjectFocus} 
                onCheckedChange={setEditingProjectFocus}
              />
              <Label htmlFor="editProjectFocus" className="flex flex-col">
                <span>{t('project_field_focus')}</span>
                <span className="font-normal text-xs text-muted-foreground">{t('project_field_focus_description')}</span>
              </Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" onClick={() => setIsEditProjectModalOpen(false)}>{t('common_cancel')}</Button></DialogClose>
            <Button onClick={handleSaveEditedProjectDetails}>{t('project_save_button')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={isMilestoneModalOpen} onOpenChange={setIsMilestoneModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('project_detail_milestone_modal_title')}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 flex-grow">
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
          <div className="py-4 space-y-4 flex-grow">
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

