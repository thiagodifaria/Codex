
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from '@/types/codex';
import * as Collapsible from '@radix-ui/react-collapsible';
import { useTranslation } from 'react-i18next';

interface NewTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'projectId'>) => void;
  isOpen: boolean;
  onToggle: () => void;
  formTitle?: string; 
}

const taskPriorityOptions: TaskPriority[] = ['lowest', 'low', 'medium', 'high', 'highest'];
const taskStatusOptions: TaskStatus[] = ['todo', 'in-progress', 'blocked', 'in-review', 'done'];


export function NewTaskForm({ onAddTask, isOpen, onToggle, formTitle }: NewTaskFormProps) {
  const { t } = useTranslation('common');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [tagsString, setTagsString] = useState("");

  const defaultFormTitle = t('todo_new_task_form_title_global');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert(t('common_required_field'));
      return;
    }
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    onAddTask({
      title,
      description,
      dueDate: dueDate?.toISOString(),
      priority,
      status,
      tags,
    });
    
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setPriority('medium');
    setStatus('todo');
    setTagsString("");
    onToggle(); 
  };

  return (
    <Collapsible.Root open={isOpen} onOpenChange={onToggle} className="mb-6">
      <Collapsible.Content
        className="overflow-hidden data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up"
        data-testid="new-task-form-content"
      >
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm bg-card space-y-4 mt-4">
          <h3 className="text-lg font-medium font-headline">{formTitle || defaultFormTitle}</h3>
          <div>
            <Label htmlFor="taskTitle">{t('common_title')}</Label>
            <Input
              id="taskTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('todo_task_title_placeholder')}
              required
              data-testid="task-title-input"
            />
          </div>
          
          <div>
            <Label htmlFor="taskDescription">{t('common_description')} {t('common_optional_suffix')}</Label>
            <Textarea
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('todo_task_description_placeholder')}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="taskTags">{t('common_tags')} {t('common_optional_suffix')}</Label>
            <Input
              id="taskTags"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder={t('common_tags_placeholder')}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="taskDueDate">{t('common_due_date')} {t('common_optional_suffix')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                    data-testid="task-duedate-trigger"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>{t('common_pick_a_date')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="taskPriority">{t('common_priority')}</Label>
              <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                <SelectTrigger id="taskPriority" data-testid="task-priority-select">
                  <SelectValue placeholder={t('common_priority')} />
                </SelectTrigger>
                <SelectContent>
                  {taskPriorityOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{t(`task_priority_${opt}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="taskStatus">{t('common_status')}</Label>
              <Select value={status} onValueChange={(value: TaskStatus) => setStatus(value)}>
                <SelectTrigger id="taskStatus" data-testid="task-status-select">
                  <SelectValue placeholder={t('common_status')} />
                </SelectTrigger>
                <SelectContent>
                  {taskStatusOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{t(`task_status_${opt.replace('-', '_')}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onToggle}>{t('common_cancel')}</Button>
            <Button type="submit" data-testid="submit-task-btn">{t('common_add')} {t('common_task_prefix')}</Button>
          </div>
        </form>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
