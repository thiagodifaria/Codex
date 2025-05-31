
"use client";

import type { JournalEntry } from "@/types/codex";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO, isValid } from 'date-fns';
import { useTranslation } from "react-i18next";
import React from 'react';

interface EntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entryId: string) => void;
}

export const EntryCard = React.memo(function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  const { t } = useTranslation('common');
  return (
    <Card data-testid={`journal-entry-${entry.id}`} className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-xl font-headline">{entry.title}</CardTitle>
        <CardDescription>{isValid(parseISO(entry.date)) ? format(parseISO(entry.date), 'PPP') : t('common_invalid_date')}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3">{entry.content.replace(/<[^>]+>/g, '').substring(0, 150) + (entry.content.replace(/<[^>]+>/g, '').length > 150 ? "..." : "")}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(entry)}>{t('common_edit')}</Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(entry.id)}>{t('common_delete')}</Button>
      </CardFooter>
    </Card>
  );
});

EntryCard.displayName = 'EntryCard';
    
