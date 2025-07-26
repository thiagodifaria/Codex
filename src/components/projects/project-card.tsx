
"use client";

import type { Project } from "@/types/codex";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CalendarDays, Edit3, Tag as TagIcon } from "lucide-react"; // Renamed Tag to TagIcon
import { format, parseISO, isValid } from 'date-fns';
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import React from 'react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

const statusColors: Record<Project['status'], string> = {
  planning: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  'on-hold': "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  archived: "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300",
};

export const ProjectCard = React.memo(function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const { t } = useTranslation('common');
  return (
    <Card data-testid={`project-card-${project.id}`} className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-headline">{project.name}</CardTitle>
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <CardDescription className="pt-1 line-clamp-2 min-h-[2.5rem]">{project.description || t('project_no_description_placeholder')}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className={cn("border-transparent",statusColors[project.status])}>
            {t(`project_status_${project.status.replace('-', '_')}`)}
          </Badge>
          {project.focus && <Badge variant="outline" className="border-primary text-primary">{t('project_in_focus_badge')}</Badge>}
        </div>
        {(project.startDate || project.endDate) && (
          <div className="text-xs text-muted-foreground flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
            {project.startDate && isValid(parseISO(project.startDate)) && <span>{t('project_start_date_prefix')} {format(parseISO(project.startDate), 'dd MMM yyyy')}</span>}
            {project.startDate && project.endDate && isValid(parseISO(project.startDate)) && isValid(parseISO(project.endDate)) && <span className="mx-1">-</span>}
            {project.endDate && isValid(parseISO(project.endDate)) && <span>{t('project_end_date_prefix')} {format(parseISO(project.endDate), 'dd MMM yyyy')}</span>}
          </div>
        )}
        {project.tags && project.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {project.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5 bg-muted/50">
                <TagIcon className="h-3 w-3 mr-1 text-muted-foreground"/>{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1">
          <Link href={`/projects/${project.id}`}>{t('project_view_button')}</Link>
        </Button>
        <Button variant="outline" size="icon" onClick={() => onEdit(project)} aria-label={t('project_card_edit_button')}>
          <Edit3 className="h-4 w-4"/>
        </Button>
      </CardFooter>
    </Card>
  );
});

ProjectCard.displayName = 'ProjectCard';
