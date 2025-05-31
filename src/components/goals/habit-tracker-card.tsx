
import type { Habit } from "@/types/codex";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarClock } from "lucide-react";
import { format, parseISO, formatDistanceToNow, isValid as isValidDate } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface HabitTrackerCardProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, date: string) => void; 
  currentDate: string; 
}

export function HabitTrackerCard({ habits, onToggleHabit, currentDate }: HabitTrackerCardProps) {
  const { t } = useTranslation('common');
  return (
    <Card data-testid="habit-tracker-card" className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center">
          <CalendarClock className="h-6 w-6 mr-2 text-primary"/> {t('habit_tracker_card_title')}
        </CardTitle>
        <CardDescription>{t('habit_tracker_card_description', { date: format(parseISO(currentDate), 'PPP') })}</CardDescription>
      </CardHeader>
      <CardContent>
        {habits.length > 0 ? (
          <ul className="space-y-3">
            {habits.map(habit => {
              const isCheckedForCurrentDate = habit.lastCheckedIn && isValidDate(parseISO(habit.lastCheckedIn)) && format(parseISO(habit.lastCheckedIn), 'yyyy-MM-dd') === currentDate;
              
              return (
                <li key={habit.id} className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <Checkbox 
                    id={`habit-${habit.id}-${currentDate}`} 
                    checked={isCheckedForCurrentDate} 
                    onCheckedChange={() => onToggleHabit(habit.id, currentDate)}
                    aria-label={t('habit_check_in_aria_label', { habitName: habit.name, date: currentDate })}
                    className="mt-0.5" 
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={`habit-${habit.id}-${currentDate}`}
                      className={`text-sm font-medium cursor-pointer ${isCheckedForCurrentDate ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {habit.name}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {t('habit_tracker_frequency_prefix')} {t(`habit_frequency_${habit.frequency}`)}
                      {habit.lastCheckedIn && isValidDate(parseISO(habit.lastCheckedIn)) && (
                        <>
                          {' '}({t('habit_tracker_last_checked_prefix')} {formatDistanceToNow(parseISO(habit.lastCheckedIn), { addSuffix: true })})
                        </>
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">{t('habit_tracker_no_habits_placeholder')}</p>
        )}
      </CardContent>
    </Card>
  );
}

    