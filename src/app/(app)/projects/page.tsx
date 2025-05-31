
"use client";

import React, { useState, useCallback } from 'react';
import PageWrapper from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project, ProjectStatus } from "@/types/codex";
import { PlusCircle, Briefcase, CalendarIcon as CalendarIconLucide } from "lucide-react"; 
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; 
import { format } from 'date-fns';


const getDummyProjects = (t: Function): Project[] => [
  { id: 'codex-app', nameKey: "projects_dummy_proj1_name", descriptionKey: "projects_dummy_proj1_desc", status: 'active', focus: true, startDate: new Date(2024, 5, 1).toISOString(), endDate: new Date(2024, 11, 31).toISOString() },
  { id: 'personal-website', nameKey: "projects_dummy_proj2_name", descriptionKey: "projects_dummy_proj2_desc", status: 'planning', focus: false, startDate: new Date(2024, 8, 1).toISOString() },
  { id: 'learn-rust', nameKey: "projects_dummy_proj3_name", descriptionKey: "projects_dummy_proj3_desc", status: 'active', focus: false },
  { id: 'kitchen-reno', nameKey: "projects_dummy_proj4_name", descriptionKey: "projects_dummy_proj4_desc", status: 'completed', focus: false, startDate: new Date(2023, 0, 15).toISOString(), endDate: new Date(2023, 3, 30).toISOString() },
];

const projectStatusOptions: ProjectStatus[] = ['planning', 'active', 'on-hold', 'completed', 'archived'];


export default function ProjectsPage() {
  const { t } = useTranslation('common');
  const [projects, setProjects] = useState<Project[]>(() => getDummyProjects(t).map(p => ({
    ...p,
    name: p.nameKey ? t(p.nameKey) : '',
    description: p.descriptionKey ? t(p.descriptionKey) : ''
  })));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectStatus, setNewProjectStatus] = useState<ProjectStatus>('planning');
  const [newProjectStartDate, setNewProjectStartDate] = useState<Date | undefined>();
  const [newProjectEndDate, setNewProjectEndDate] = useState<Date | undefined>();


  const handleCreateProject = useCallback(() => {
    if (!newProjectName.trim()) {
      alert(t('project_alert_name_required')); 
      return;
    }
    const newProject: Project = {
      id: newProjectName.toLowerCase().replace(/\s+/g, '-').slice(0,50) + Date.now().toString().slice(-5), 
      name: newProjectName,
      description: newProjectDescription,
      status: newProjectStatus,
      focus: false, 
      startDate: newProjectStartDate?.toISOString(),
      endDate: newProjectEndDate?.toISOString(),
      milestones: [], 
      resources: [],
    };
    setProjects(prev => [newProject, ...prev]);
    setIsModalOpen(false);
    setNewProjectName("");
    setNewProjectDescription("");
    setNewProjectStatus('planning');
    setNewProjectStartDate(undefined);
    setNewProjectEndDate(undefined);
  }, [newProjectName, newProjectDescription, newProjectStatus, newProjectStartDate, newProjectEndDate, t]);

  return (
    <PageWrapper title={t('page_title_projects')}>
      <div className="flex justify-end mb-6">
        <Button onClick={() => setIsModalOpen(true)} data-testid="create-project-btn">
          <PlusCircle className="mr-2 h-5 w-5" /> {t('projects_create_new_project_button')}
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
         <Card className="flex flex-col items-center justify-center p-10 text-center min-h-[300px]">
          <Briefcase className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('project_no_projects_placeholder')}</p>
        </Card>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent data-testid="create-project-modal" className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('project_modal_create_title')}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 flex-grow">
            <div>
              <Label htmlFor="projectName">{t('project_name_label')}</Label>
              <Input 
                id="projectName" 
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder={t('project_name_placeholder')}
                data-testid="project-name-input"
              />
            </div>
            <div>
              <Label htmlFor="projectDescription">{t('common_description')} {t('common_optional_suffix')}</Label>
              <Textarea 
                id="projectDescription"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder={t('project_description_placeholder')}
                data-testid="project-description-input"
              />
            </div>
            <div>
              <Label htmlFor="projectStatus">{t('common_status')}</Label>
              <Select value={newProjectStatus} onValueChange={(value: ProjectStatus) => setNewProjectStatus(value)}>
                <SelectTrigger id="projectStatus" data-testid="project-status-select">
                  <SelectValue placeholder={t('project_status_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {projectStatusOptions.map(option => (
                    <SelectItem key={option} value={option}>{t(`project_status_${option.replace('-', '_')}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectStartDate">{t('common_start_date')} {t('common_optional_suffix')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                      data-testid="project-startdate-trigger"
                    >
                      <CalendarIconLucide className="mr-2 h-4 w-4" />
                      {newProjectStartDate ? format(newProjectStartDate, "PPP") : <span>{t('common_pick_a_date')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newProjectStartDate}
                      onSelect={setNewProjectStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="projectEndDate">{t('common_end_date')} {t('common_optional_suffix')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                      data-testid="project-enddate-trigger"
                    >
                      <CalendarIconLucide className="mr-2 h-4 w-4" />
                      {newProjectEndDate ? format(newProjectEndDate, "PPP") : <span>{t('common_pick_a_date')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newProjectEndDate}
                      onSelect={setNewProjectEndDate}
                      disabled={(date) => newProjectStartDate ? date < newProjectStartDate : false}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t('common_cancel')}</Button>
            </DialogClose>
            <Button onClick={handleCreateProject} data-testid="submit-create-project-btn">{t('project_save_button')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageWrapper>
  );
}
    
