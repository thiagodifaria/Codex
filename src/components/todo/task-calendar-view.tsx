
'use client';

import React, { useState, useMemo } from 'react';
import type { Task } from '@/types/codex';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO, isSameDay, isValid } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { CalendarCheck2 } from 'lucide-react';

interface TaskCalendarViewProps {
  tasks: Task[];
  initialSelectedDate?: Date;
}

export function TaskCalendarView({ tasks, initialSelectedDate = new Date() }: TaskCalendarViewProps) {
  const { t } = useTranslation('common');
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(initialSelectedDate);

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    tasks.forEach(task => {
      if (task.dueDate && isValid(parseISO(task.dueDate))) {
        const dateKey = format(parseISO(task.dueDate), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const tasksForSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    const dateKey = format(selectedDay, 'yyyy-MM-dd');
    return tasksByDate[dateKey] || [];
  }, [selectedDay, tasksByDate]);

  const modifiers = {
    selected: selectedDay ? (date: Date) => isSameDay(date, selectedDay) : undefined,
  };

  const modifiersClassNames = {
    selected: 'day-selected', 
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-6">
      <div className="md:col-span-2">
        <Card className="shadow-md">
          <CardContent className="p-0 sm:p-2 md:p-4">
            <Calendar
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              className="rounded-md w-full"
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              components={{
                DayContent: ({ date, displayMonth }) => {
                  const dateKey = format(date, 'yyyy-MM-dd');
                  const dayHasTasks = tasksByDate[dateKey] && tasksByDate[dateKey].length > 0;
                  const isCurrentMonth = date.getMonth() === displayMonth.getMonth();
                  
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span>{format(date, 'd')}</span>
                      {dayHasTasks && isCurrentMonth && (
                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" aria-hidden="true"></span>
                      )}
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1">
        <Card className="shadow-md min-h-[200px]"> {}
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CalendarCheck2 className="mr-2 h-5 w-5 text-primary" />
              {selectedDay ? format(selectedDay, 'PPP') : t('todo_calendar_select_day_prompt')}
            </CardTitle>
            {selectedDay && tasksForSelectedDay.length > 0 && 
              <CardDescription>
                {t('todo_calendar_tasks_count', { count: tasksForSelectedDay.length })}
              </CardDescription>
            }
          </CardHeader>
          <CardContent>
            {selectedDay ? (
              tasksForSelectedDay.length > 0 ? (
                <ScrollArea className="h-[300px] lg:h-[350px]"> {}
                  <ul className="space-y-3 pr-3">
                    {tasksForSelectedDay.map(task => (
                      <li key={task.id} className="p-2.5 border rounded-md bg-muted/40 hover:bg-muted/70 transition-colors">
                        <p className="font-medium text-sm leading-tight">{task.title}</p>
                        {task.priority && (
                          <Badge 
                            variant="outline" 
                            className={`mt-1 text-xs capitalize py-0.5 px-1.5 ${
                              task.priority === 'high' || task.priority === 'highest' ? 'border-destructive text-destructive' : 
                              task.priority === 'medium' ? 'border-yellow-500 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400' :
                              'border-green-500 text-green-600 dark:border-green-400 dark:text-green-400'
                            }`}
                          >
                            {t(`task_priority_${task.priority}`)}
                          </Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground">{t('todo_calendar_no_tasks_for_day')}</p>
              )
            ) : (
              <p className="text-sm text-muted-foreground">{t('todo_calendar_select_day_prompt_long')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
