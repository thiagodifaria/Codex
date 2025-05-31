
"use client";

import type { Project } from "@/types/codex";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CalendarDays } from "lucide-react";
import { format, parseISO, isValid } from 'date-fns';
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import React from 'react';

interface ProjectCardProps {
  project: Project;
}

const statusColors: Record<Project['status'], string> = {
  planning: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  'on-hold': "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  archived: "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300",
};

export const ProjectCard = React.memo(function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useTranslation('common');
  return (
    <Card data-testid={`project-card-${project.id}`} className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-headline">{project.name}</CardTitle>
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <CardDescription className="pt-1 line-clamp-2 min-h-[2.5rem]">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={cn("border-transparent",statusColors[project.status])}>
            {t(`project_status_${project.status.replace('-', '_')}`)}
          </Badge>
          {project.focus && <Badge variant="outline">{t('project_in_focus_badge')}</Badge>}
        </div>
        {(project.startDate || project.endDate) && (
          <div className="text-xs text-muted-foreground flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
            {project.startDate && isValid(parseISO(project.startDate)) && <span>{t('project_start_date_prefix')} {format(parseISO(project.startDate), 'dd MMM yyyy')}</span>}
            {project.startDate && project.endDate && isValid(parseISO(project.startDate)) && isValid(parseISO(project.endDate)) && <span className="mx-1">-</span>}
            {project.endDate && isValid(parseISO(project.endDate)) && <span>{t('project_end_date_prefix')} {format(parseISO(project.endDate), 'dd MMM yyyy')}</span>}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/projects/${project.id}`}>{t('project_view_button')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
});

ProjectCard.displayName = 'ProjectCard';
    
