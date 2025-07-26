
"use client";

import PageWrapper from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { JournalCalendar } from "@/components/journal/journal-calendar";
import { EntryCard } from "@/components/journal/entry-card";
import type { JournalEntry } from "@/types/codex";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { format, parseISO, isValid } from 'date-fns';
import { PlusCircle, BookOpenText, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card"; 
import { useTranslation } from 'react-i18next';
import { TiptapEditor } from '@/components/shared/tiptap-editor';
import { Label } from "@/components/ui/label";

const getDummyEntries = (t: Function): JournalEntry[] => [
  { id: '1', date: new Date(2024, 6, 20).toISOString(), titleKey: "journal_dummy_entry1_title", contentKey: "journal_dummy_entry1_content", tags: ["productivity", "reflection"] },
  { id: '2', date: new Date(2024, 6, 21).toISOString(), titleKey: "journal_dummy_entry2_title", contentKey: "journal_dummy_entry2_content", tags: ["personal", "weekend"] },
  { id: '3', date: new Date().toISOString(), titleKey: "journal_dummy_entry3_title", contentKey: "journal_dummy_entry3_content", tags: ["work", "design"] },
];

export default function JournalPage() {
  const { t } = useTranslation('common');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [entries, setEntries] = useState<JournalEntry[]>(() => getDummyEntries(t).map(e => ({
    ...e,
    title: e.titleKey ? t(e.titleKey) : e.title || '',
    content: e.contentKey ? t(e.contentKey) : e.content || ''
  })));
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry> | null>(null);
  const [entryTitle, setEntryTitle] = useState("");
  const [entryContent, setEntryContent] = useState("");
  const [entryTagsString, setEntryTagsString] = useState("");
  const [tagFilter, setTagFilter] = useState('');

  const filteredEntriesByDate = useMemo(() => {
    if (selectedDate) {
      const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
      return entries.filter(entry => isValid(parseISO(entry.date)) && format(parseISO(entry.date), 'yyyy-MM-dd') === formattedSelectedDate);
    }
    return entries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedDate, entries]);

  const finalFilteredEntries = useMemo(() => {
    if (!tagFilter) {
      return filteredEntriesByDate;
    }
    return filteredEntriesByDate.filter(entry =>
      entry.tags?.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
    );
  }, [filteredEntriesByDate, tagFilter]);


  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    setIsFormVisible(false); 
  }, []);

  const handleAddNewEntry = useCallback(() => {
    setCurrentEntry({ date: selectedDate?.toISOString() || new Date().toISOString() });
    setEntryTitle("");
    setEntryContent("<p></p>"); 
    setEntryTagsString("");
    setIsFormVisible(true);
  }, [selectedDate]);

  const handleEditEntry = useCallback((entry: JournalEntry) => {
    setCurrentEntry(entry);
    setEntryTitle(entry.title);
    setEntryContent(entry.content);
    setEntryTagsString(entry.tags?.join(', ') || "");
    setIsFormVisible(true);
  }, []);

  const handleDeleteEntry = useCallback((entryId: string) => {
    setEntries(prev => prev.filter(e => e.id !== entryId));
  }, []);

  const handleSaveEntry = useCallback(() => {
    if (!entryTitle || !entryContent || entryContent === "<p></p>") { 
      alert(t('journal_alert_title_content_required')); 
      return;
    }
    const tags = entryTagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    const newEntryData: JournalEntry = {
      id: currentEntry?.id || Date.now().toString(),
      title: entryTitle,
      content: entryContent,
      date: currentEntry?.date || selectedDate?.toISOString() || new Date().toISOString(),
      tags: tags,
    };

    if (currentEntry?.id) { 
      setEntries(prev => prev.map(e => e.id === newEntryData.id ? newEntryData : e));
    } else { 
      setEntries(prev => [newEntryData, ...prev]);
    }
    setIsFormVisible(false);
    setCurrentEntry(null);
    setEntryTitle("");
    setEntryContent("");
    setEntryTagsString("");
  }, [entryTitle, entryContent, entryTagsString, currentEntry, selectedDate, t]);


  return (
    <PageWrapper title={t('page_title_journal')}>
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        <div className="md:col-span-1 space-y-6">
          <JournalCalendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
          <Button onClick={handleAddNewEntry} className="w-full" data-testid="add-new-entry-btn">
            <PlusCircle className="mr-2 h-5 w-5" /> 
            {selectedDate ? t('journal_new_entry_button_date', { date: format(selectedDate, 'MMM d') }) : t('journal_new_entry_button_today')}
          </Button>
          <div className="relative w-full">
            <Input 
              type="text"
              placeholder={t('common_filter_by_tag')}
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="pl-10"
            />
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {isFormVisible && (
             <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
             <DialogContent className="sm:max-w-2xl" data-testid="journal-entry-form">
               <DialogHeader>
                 <DialogTitle>{currentEntry?.id ? t('journal_entry_form_title_edit') : t('journal_entry_form_title_new')}</DialogTitle>
               </DialogHeader>
               <div className="space-y-4 py-4">
                 <Input 
                   placeholder={t('journal_entry_title_placeholder')} 
                   value={entryTitle}
                   onChange={(e) => setEntryTitle(e.target.value)}
                   className="text-lg font-semibold"
                   data-testid="entry-title-input"
                 />
                 <TiptapEditor
                   id="journalEntryContent"
                   value={entryContent}
                   onChange={setEntryContent}
                   placeholder={t('journal_tiptap_placeholder')}
                 />
                 <div>
                    <Label htmlFor="entryTags">{t('common_tags')} {t('common_optional_suffix')}</Label>
                    <Input
                      id="entryTags"
                      value={entryTagsString}
                      onChange={(e) => setEntryTagsString(e.target.value)}
                      placeholder={t('common_tags_placeholder')}
                    />
                  </div>
               </div>
               <DialogFooter>
                 <DialogClose asChild>
                   <Button variant="outline">{t('common_cancel')}</Button>
                 </DialogClose>
                 <Button onClick={handleSaveEntry} data-testid="save-entry-btn">{t('journal_save_entry_button')}</Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
          )}

          {finalFilteredEntries.length > 0 ? (
            <div className="space-y-4">
              {finalFilteredEntries.map(entry => (
                <EntryCard key={entry.id} entry={entry} onEdit={handleEditEntry} onDelete={handleDeleteEntry} />
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-10 text-center min-h-[200px]">
              <BookOpenText className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {tagFilter ? t('common_no_items_found_filter') : t('journal_no_entries_placeholder', { date: selectedDate ? format(selectedDate, 'PPP') : t('common_today') })}
              </p>
              {!isFormVisible && !tagFilter && (
                <Button variant="link" onClick={handleAddNewEntry} className="mt-2">
                  {t('journal_create_one_link')}
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
