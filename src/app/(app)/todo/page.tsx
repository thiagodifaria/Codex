
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PageWrapper from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { NewTaskForm } from "@/components/todo/new-task-form";
import { TaskItem } from "@/components/todo/task-item";
import type { Task, TaskPriority, TaskStatus } from '@/types/codex';
import TaskCompletionAnimation from '@/components/shared/task-completion-animation';
import { PlusCircle, ListChecks, Tag, Filter, ArrowDownUp, CalendarDays } from "lucide-react"; 
import { Card } from '@/components/ui/card'; 
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import { compareAsc, compareDesc, parseISO } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { TaskCalendarView } from '@/components/todo/task-calendar-view'; 

const getDummyTasks = (t: Function): Task[] => [
  { id: '1', titleKey: "todo_dummy_task1_title", descriptionKey: "todo_dummy_task1_desc", status: 'todo', dueDate: new Date(2024, 7, 15).toISOString(), priority: 'high', tags: ['personal', 'health'] },
  { id: '2', titleKey: "todo_dummy_task2_title", status: 'done', dueDate: new Date(2024, 7, 10).toISOString(), priority: 'medium', tags: ['home'] },
  { id: '3', titleKey: "todo_dummy_task3_title", descriptionKey: "todo_dummy_task3_desc", status: 'in-progress', priority: 'medium', tags: ['travel', 'planning'], dueDate: new Date(2024, 7, 15).toISOString() },
  { id: '4', titleKey: "todo_dummy_task4_title", descriptionKey: "todo_dummy_task4_desc", status: 'blocked', dueDate: new Date(2024, 8, 1).toISOString(), priority: 'low', tags: ['work', 'research'] },
  { id: '5', title: "Design new dashboard", description: "Wireframes and mockups for v2", status: 'todo', dueDate: new Date(2024, 7, 20).toISOString(), priority: 'highest', tags: ['design', 'ux'] },
  { id: '6', title: "Write API documentation", description: "For all public endpoints", status: 'in-progress', dueDate: new Date(2024, 8, 5).toISOString(), priority: 'high', tags: ['dev', 'docs'] },
  { id: '7', title: "Review PR #123", status: 'in-review', priority: 'medium', tags: ['dev', 'code-review'], dueDate: new Date().toISOString() },
  { id: '8', title: "Plan team building event", status: 'todo', priority: 'low', tags: ['hr', 'event'], dueDate: new Date(2024, 7, 22).toISOString() },
  { id: '9', titleKey: "todo_dummy_task1_title", descriptionKey: "todo_dummy_task1_desc", status: 'todo', dueDate: new Date(2024, 7, 25).toISOString(), priority: 'high', tags: ['personal', 'urgent'] },
  { id: '10', title: "Prepare presentation slides", status: 'in-progress', priority: 'highest', tags: ['work', 'meeting'], dueDate: new Date(2024, 7, 18).toISOString() },
  { id: '11', title: "Book flight tickets", status: 'todo', dueDate: new Date(2024, 9, 1).toISOString(), priority: 'medium', tags: ['travel'] },
  { id: '12', title: "Grocery Shopping", status: 'done', priority: 'low', tags: ['home', 'personal'], dueDate: new Date(2024, 7, 12).toISOString()},
];

const taskPriorityOptions: TaskPriority[] = ['lowest', 'low', 'medium', 'high', 'highest'];
const taskStatusOptions: TaskStatus[] = ['todo', 'in-progress', 'blocked', 'in-review', 'done'];
type SortableTaskKeys = 'dueDate' | 'priority' | 'title' | 'status';
type SortOrder = 'asc' | 'desc';

export default function TodoPage() {
  const { t } = useTranslation('common');
  const [tasks, setTasks] = useState<Task[]>(() => getDummyTasks(t).map(task => ({
    ...task, 
    title: task.titleKey ? t(task.titleKey) : task.title || '',
    description: task.descriptionKey ? t(task.descriptionKey) : task.description,
    completed: task.status === 'done'
  })));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskCompletedAnim, setTaskCompletedAnim] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null); 
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  
  
  const [tagFilter, setTagFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  
  const [sortBy, setSortBy] = useState<SortableTaskKeys>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');


  const handleAddTask = useCallback((newTaskData: Omit<Task, 'id' | 'completed' | 'projectId'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
      completed: newTaskData.status === 'done',
      title: newTaskData.title, 
      description: newTaskData.description,
      tags: newTaskData.tags || []
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  }, []);

  const handleToggleComplete = useCallback((taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newStatus = task.status === 'done' ? 'todo' : 'done';
          if (newStatus === 'done' && task.status !== 'done') {
            setTaskCompletedAnim(true); 
          }
          return { ...task, status: newStatus, completed: newStatus === 'done' };
        }
        return task;
      })
    );
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setDeletingTaskId(taskId);
    setTimeout(() => {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setDeletingTaskId(null);
    }, 300); 
  }, []);
  
  const handleEditTask = useCallback((task: Task) => {
    alert(t('common_edit_task_feature_not_implemented', {taskTitle: task.title}));
    setEditingTask(task);
  }, [t]);

  const filteredAndSortedTasks = useMemo(() => {
    let processedTasks = [...tasks];

    
    if (tagFilter) {
      processedTasks = processedTasks.filter(task => 
        task.tags?.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
      );
    }
    if (statusFilter !== 'all') {
      processedTasks = processedTasks.filter(task => task.status === statusFilter);
    }
    if (priorityFilter !== 'all') {
      processedTasks = processedTasks.filter(task => task.priority === priorityFilter);
    }

    
    const priorityOrderMap: Record<TaskPriority, number> = { lowest: 4, low: 3, medium: 2, high: 1, highest: 0 };
    
    processedTasks.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'dueDate':
          const dateA = a.dueDate ? parseISO(a.dueDate) : null;
          const dateB = b.dueDate ? parseISO(b.dueDate) : null;
          if (dateA && dateB) comparison = compareAsc(dateA, dateB);
          else if (dateA) comparison = -1; 
          else if (dateB) comparison = 1;
          break;
        case 'priority':
          comparison = priorityOrderMap[a.priority] - priorityOrderMap[b.priority];
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status); 
          break;
      }
      return sortOrder === 'asc' ? comparison : comparison * -1;
    });
    
    
    if (sortBy !== 'status') {
        processedTasks.sort((a, b) => {
            if (a.status === 'done' && b.status !== 'done') return 1;
            if (a.status !== 'done' && b.status === 'done') return -1;
            return 0;
        });
    }

    return processedTasks;
  }, [tasks, tagFilter, statusFilter, priorityFilter, sortBy, sortOrder]);

  return (
    <PageWrapper title={t('page_title_todo')}>
      <Tabs defaultValue="list" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
           <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-none">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" /> 
              <span>{t('todo_list_view_tab_title')}</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> 
              <span>{t('todo_calendar_tab_title')}</span>
            </TabsTrigger>
          </TabsList>
          <Button onClick={() => { setEditingTask(null); setIsFormOpen(!isFormOpen); }} data-testid="toggle-task-form-btn" className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-5 w-5" /> {isFormOpen ? t('todo_close_form_button') : t('todo_add_new_task_button')}
          </Button>
        </div>

        <TabsContent value="list">
          <Card className="p-3 sm:p-4 w-full mb-6 shadow-sm bg-card/70">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="tagFilter" className="text-xs font-medium">{t('common_filter_by_tag')}</Label>
                <div className="relative">
                  <Input 
                    id="tagFilter"
                    type="text"
                    placeholder={t('common_tag_placeholder_filter')}
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    className="pl-8 text-sm h-9"
                  />
                  <Tag className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label htmlFor="statusFilter" className="text-xs font-medium">{t('common_filter_by_status')}</Label>
                <Select value={statusFilter} onValueChange={(value: TaskStatus | 'all') => setStatusFilter(value)}>
                  <SelectTrigger id="statusFilter" className="text-sm h-9">
                    <SelectValue placeholder={t('common_all_statuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common_all_statuses')}</SelectItem>
                    {taskStatusOptions.map(opt => (
                      <SelectItem key={opt} value={opt}>{t(`task_status_${opt.replace('-', '_')}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priorityFilter" className="text-xs font-medium">{t('common_filter_by_priority')}</Label>
                <Select value={priorityFilter} onValueChange={(value: TaskPriority | 'all') => setPriorityFilter(value)}>
                  <SelectTrigger id="priorityFilter" className="text-sm h-9">
                    <SelectValue placeholder={t('common_all_priorities')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common_all_priorities')}</SelectItem>
                    {taskPriorityOptions.map(opt => (
                      <SelectItem key={opt} value={opt}>{t(`task_priority_${opt}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <Label htmlFor="sortBy" className="text-xs font-medium">{t('common_sort_by')}</Label>
                <Select value={sortBy} onValueChange={(value: SortableTaskKeys) => setSortBy(value)}>
                  <SelectTrigger id="sortBy" className="text-sm h-9">
                    <SelectValue placeholder={t('common_select_sort_criterion')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueDate">{t('common_due_date')}</SelectItem>
                    <SelectItem value="priority">{t('common_priority')}</SelectItem>
                    <SelectItem value="title">{t('common_title')}</SelectItem>
                    <SelectItem value="status">{t('common_status')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sortOrder" className="text-xs font-medium">{t('common_sort_order')}</Label>
                <Select value={sortOrder} onValueChange={(value: SortOrder) => setSortOrder(value)}>
                  <SelectTrigger id="sortOrder" className="text-sm h-9">
                    <SelectValue placeholder={t('common_select_sort_order')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">{t('common_sort_order_asc')}</SelectItem>
                    <SelectItem value="desc">{t('common_sort_order_desc')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
          
          <NewTaskForm 
            onAddTask={handleAddTask} 
            isOpen={isFormOpen} 
            onToggle={() => setIsFormOpen(!isFormOpen)}
            formTitle={t('todo_new_task_form_title_global')}
          />

          {filteredAndSortedTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredAndSortedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  isDeleting={task.id === deletingTaskId}
                />
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-10 text-center min-h-[200px]">
              <ListChecks className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {tagFilter || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? t('common_no_tasks_filter_placeholder') 
                  : t('todo_no_tasks_placeholder')}
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <TaskCalendarView tasks={filteredAndSortedTasks} />
        </TabsContent>
      </Tabs>
      
      <TaskCompletionAnimation visible={taskCompletedAnim} onAnimationEnd={() => setTaskCompletedAnim(false)} />
    </PageWrapper>
  );
}
