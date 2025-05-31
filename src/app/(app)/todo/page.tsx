
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { NewTaskForm } from "@/components/todo/new-task-form";
import { TaskItem } from "@/components/todo/task-item";
import type { Task } from '@/types/codex';
import TaskCompletionAnimation from '@/components/shared/task-completion-animation';
import { PlusCircle, ListChecks } from "lucide-react";
import { Card } from '@/components/ui/card'; 
import { useTranslation } from 'react-i18next';


const getDummyTasks = (t: Function): Task[] => [
  { id: '1', titleKey: "todo_dummy_task1_title", descriptionKey: "todo_dummy_task1_desc", status: 'todo', dueDate: new Date(2024, 7, 15).toISOString(), priority: 'high' },
  { id: '2', titleKey: "todo_dummy_task2_title", status: 'done', dueDate: new Date(2024, 7, 10).toISOString(), priority: 'medium' },
  { id: '3', titleKey: "todo_dummy_task3_title", descriptionKey: "todo_dummy_task3_desc", status: 'in-progress', priority: 'medium' },
  { id: '4', titleKey: "todo_dummy_task4_title", descriptionKey: "todo_dummy_task4_desc", status: 'blocked', dueDate: new Date(2024, 8, 1).toISOString(), priority: 'low' },
];

export default function TodoPage() {
  const { t } = useTranslation('common');
  const [tasks, setTasks] = useState<Task[]>(() => getDummyTasks(t).map(task => ({
    ...task, 
    title: task.titleKey ? t(task.titleKey) : '',
    description: task.descriptionKey ? t(task.descriptionKey) : task.description,
    completed: task.status === 'done'
  })));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskCompletedAnim, setTaskCompletedAnim] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null); 
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const handleAddTask = useCallback((newTaskData: Omit<Task, 'id' | 'completed' | 'projectId'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
      completed: newTaskData.status === 'done',
      title: newTaskData.title, // Already provided by form
      description: newTaskData.description
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

  const sortedTasks = React.useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;
      
      if (a.dueDate && b.dueDate) {
        const dateDiff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        if (dateDiff !== 0) return dateDiff;
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      }

      const priorityOrder: Record<Task['priority'], number> = { 
        lowest: 0, high: 1, medium: 2, low: 3, // Corrected order: highest should be 0, lowest 4
      };
      const priorityOrderCorrected: Record<Task['priority'], number> = { 
        highest: 0, high: 1, medium: 2, low: 3, lowest: 4 
      };
      return priorityOrderCorrected[a.priority] - priorityOrderCorrected[b.priority];
    });
  }, [tasks]);

  return (
    <PageWrapper title={t('page_title_todo')}>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => { setEditingTask(null); setIsFormOpen(!isFormOpen); }} data-testid="toggle-task-form-btn">
          <PlusCircle className="mr-2 h-5 w-5" /> {isFormOpen ? t('todo_close_form_button') : t('todo_add_new_task_button')}
        </Button>
      </div>
      
      <NewTaskForm 
        onAddTask={handleAddTask} 
        isOpen={isFormOpen} 
        onToggle={() => setIsFormOpen(!isFormOpen)}
        formTitle={t('todo_new_task_form_title_global')}
      />

      {sortedTasks.length > 0 ? (
        <div className="space-y-3">
          {sortedTasks.map(task => (
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
          <p className="text-muted-foreground">{t('todo_no_tasks_placeholder')}</p>
        </Card>
      )}
      <TaskCompletionAnimation visible={taskCompletedAnim} onAnimationEnd={() => setTaskCompletedAnim(false)} />
    </PageWrapper>
  );
}
    
