
"use client";

import type { Task, TaskPriority, TaskStatus } from '@/types/codex';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Circle, CheckCircle2, XCircle, AlertTriangle, Eye, Tag, GripVertical } from 'lucide-react'; // Added GripVertical
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import React from 'react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void; 
  isDeleting?: boolean;
  onAnimationEnd?: () => void; 
  // Props for Draggable
  innerRef?: React.Ref<HTMLDivElement>;
  draggableProps?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  dragHandleProps?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  isDragging?: boolean;
}

const priorityClasses: Record<TaskPriority, string> = {
  lowest: "border-sky-400",
  low: "border-green-500",
  medium: "border-yellow-500",
  high: "border-orange-500",
  highest: "border-red-600",
};

const priorityTextColors: Record<TaskPriority, string> = {
  lowest: "text-sky-500",
  low: "text-green-600",
  medium: "text-yellow-600",
  high: "text-orange-600",
  highest: "text-red-700",
};

const statusIcons: Record<TaskStatus, React.ElementType> = {
  todo: Circle,
  'in-progress': Eye,
  blocked: XCircle,
  'in-review': AlertTriangle,
  done: CheckCircle2,
};

const statusColors: Record<TaskStatus, string> = {
  todo: "text-muted-foreground",
  'in-progress': "text-blue-500",
  blocked: "text-red-500",
  'in-review': "text-yellow-500",
  done: "text-green-500",
};


export const TaskItem = React.memo(function TaskItem({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onEdit, 
  isDeleting, 
  onAnimationEnd: onAnimationEndProp,
  innerRef,
  draggableProps,
  dragHandleProps,
  isDragging
}: TaskItemProps) {
  const { t } = useTranslation('common');
  const StatusIcon = statusIcons[task.status];

  const handleAnimationEnd = () => {
    if (isDeleting && onAnimationEndProp) {
      onAnimationEndProp();
    }
  };

  return (
    <div 
      ref={innerRef}
      {...draggableProps}
      className={cn(
        "flex items-start gap-2 p-3 pr-2 border-l-4 rounded-r-md bg-card shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden min-w-0 group", 
        priorityClasses[task.priority],
        task.status === 'done' && !isDeleting ? "opacity-70" : "",
        isDeleting ? 'animate-fade-out-and-collapse' : '',
        isDragging ? 'shadow-2xl opacity-90 scale-105' : ''
      )}
      data-testid={`task-item-${task.id}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div {...dragHandleProps} className="py-1 cursor-grab group-hover:opacity-100 opacity-50 transition-opacity">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <Checkbox
        id={`task-${task.id}`}
        checked={task.status === 'done'}
        onCheckedChange={() => onToggleComplete(task.id)}
        aria-label={t('todo_task_item_mark_complete_aria_label', { taskTitle: task.title, status: task.status === 'done' ? t('common_incomplete') : t('common_complete') })}
        className="mt-1"
        disabled={isDeleting}
      />
      <div className="flex-1 space-y-1 min-w-0"> 
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            "text-sm font-medium leading-none cursor-pointer block truncate", 
            task.status === 'done' && !isDeleting ? "line-through text-muted-foreground" : "text-foreground"
          )}
        >
          {task.title}
        </label>
        {task.description && (
          <p className={cn(
            "text-xs text-muted-foreground line-clamp-2",
            task.status === 'done' && !isDeleting ? "line-through" : ""
          )}>
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {task.dueDate && (
            <span className={cn("text-muted-foreground", task.status === 'done' && !isDeleting ? "line-through" : "")}>
              {t('todo_task_item_due_date_prefix')} {format(parseISO(task.dueDate), 'dd MMM yyyy')}
            </span>
          )}
          <Badge 
            variant="outline" 
            className={cn(
              "capitalize py-0.5 px-1.5 text-xs", 
              priorityTextColors[task.priority], 
              priorityClasses[task.priority],
              task.status === 'done' && !isDeleting ? "opacity-70" : ""
              )}
          >
            {t(`task_priority_${task.priority}`)}
          </Badge>
          <Badge 
            variant="secondary" 
            className={cn(
              "py-0.5 px-1.5 text-xs flex items-center gap-1",
              statusColors[task.status],
              task.status === 'done' && !isDeleting ? "bg-muted" : ""
              )}
          >
            <StatusIcon className="h-3 w-3" />
            {t(`task_status_${task.status.replace('-', '_')}`)}
          </Badge>
        </div>
        {task.tags && task.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {task.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5 bg-muted/50">
                <Tag className="h-3 w-3 mr-1 text-muted-foreground"/>{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-0 items-center ml-auto">
        <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="h-8 w-8" aria-label={t('todo_task_item_edit_aria_label')} disabled={isDeleting}>
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-8 w-8" aria-label={t('todo_task_item_delete_aria_label')} disabled={isDeleting}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';
