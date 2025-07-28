"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

interface JournalCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  
}

export function JournalCalendar({ selectedDate, onDateSelect }: JournalCalendarProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-2 md:p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-md"
          data-testid="journal-calendar"
        />
      </CardContent>
    </Card>
  )
}
