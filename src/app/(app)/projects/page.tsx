
"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PageWrapper from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project, ProjectStatus } from "@/types/codex";
import { PlusCircle, Briefcase, CalendarIcon as CalendarIconLucide, Edit3, Tag as TagIcon } from "lucide-react"; 
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; 
import { Switch } from "@/components/ui/switch";
import { format, parseISO, isValid, compareAsc, compareDesc } from 'date-fns';


const getDummyProjects = (t: Function): Project[] => [
  { id: 'codex-app', nameKey: "projects_dummy_proj1_name", descriptionKey: "projects_dummy_proj1_desc", status: 'active', focus: true, startDate: new Date(2024, 5, 1).toISOString(), endDate: new Date(2024, 11, 31).toISOString(), tags: ["dev", "productivity", "saas"] },
  { id: 'personal-website', nameKey: "projects_dummy_proj2_name", descriptionKey: "projects_dummy_proj2_desc", status: 'planning', focus: false, startDate: new Date(2024, 8, 1).toISOString(), tags: ["web", "portfolio"] },
  { id: 'learn-rust', nameKey: "projects_dummy_proj3_name", descriptionKey: "projects_dummy_proj3_desc", status: 'active', focus: false, tags: ["learning", "programming", "rust"], startDate: new Date(2024, 0, 10).toISOString() },
  { id: 'kitchen-reno', nameKey: "projects_dummy_proj4_name", descriptionKey: "projects_dummy_proj4_desc", status: 'completed', focus: false, startDate: new Date(2023, 0, 15).toISOString(), endDate: new Date(2023, 3, 30).toISOString(), tags: ["home", "renovation"] },
  { id: 'garden-project', name: "Backyard Garden Setup", description: "Plan and build a vegetable garden.", status: 'planning', focus: true, tags: ["home", "outdoors", "gardening"] },
];

const projectStatusOptions: ProjectStatus[] = ['planning', 'active', 'on-hold', 'completed', 'archived'];
type SortableProjectKeys = 'name' | 'startDate' | 'endDate' | 'status' | 'focus';
type SortOrder = 'asc' | 'desc';
const projectStatusOrder: ProjectStatus[] = ['planning', 'active', 'on-hold', 'completed', 'archived'];


export default function ProjectsPage() {
  const { t } = useTranslation('common');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [currentProject, setCurrentProject] = useState<Partial<Project> & { id?: string } | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>('planning');
  const [projectStartDate, setProjectStartDate] = useState<Date | undefined>();
  const [projectEndDate, setProjectEndDate] = useState<Date | undefined>();
  const [projectFocus, setProjectFocus] = useState(false);
  const [projectTagsString, setProjectTagsString] = useState("");
  
  // Filters and Sorting
  const [tagFilter, setTagFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortableProjectKeys>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');


  useEffect(() => {
    const translatedProjects = getDummyProjects(t).map(p => ({
      ...p,
      name: p.nameKey ? t(p.nameKey) : p.name || '',
      description: p.descriptionKey ? t(p.descriptionKey) : p.description || ''
    }));
    setProjects(translatedProjects);
  }, [t]);

  const resetFormStates = useCallback(() => {
    setProjectName("");
    setProjectDescription("");
    setProjectStatus('planning');
    setProjectStartDate(undefined);
    setProjectEndDate(undefined);
    setProjectFocus(false);
    setProjectTagsString("");
    setCurrentProject(null);
  }, []);
  
  const openNewProjectModal = useCallback(() => {
    resetFormStates();
    setIsModalOpen(true);
  }, [resetFormStates]);

  const openEditProjectModal = useCallback((project: Project) => {
    setCurrentProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description || "");
    setProjectStatus(project.status);
    setProjectStartDate(project.startDate && isValid(parseISO(project.startDate)) ? parseISO(project.startDate) : undefined);
    setProjectEndDate(project.endDate && isValid(parseISO(project.endDate)) ? parseISO(project.endDate) : undefined);
    setProjectFocus(project.focus);
    setProjectTagsString(project.tags?.join(', ') || "");
    setIsModalOpen(true);
  }, []);


  const handleSaveProject = useCallback(() => {
    if (!projectName.trim()) {
      alert(t('project_alert_name_required')); 
      return;
    }
    const tags = projectTagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    
    const projectData: Omit<Project, 'id' | 'milestones' | 'resources'> & { id?: string } = {
      name: projectName,
      description: projectDescription,
      status: projectStatus,
      focus: projectFocus,
      startDate: projectStartDate?.toISOString(),
      endDate: projectEndDate?.toISOString(),
      tags: tags,
    };

    if (currentProject && currentProject.id) { 
      setProjects(prev => prev.map(p => p.id === currentProject.id ? { ...p, ...projectData } as Project : p));
    } else { 
      const newProject: Project = {
        id: projectName.toLowerCase().replace(/\s+/g, '-').slice(0,50) + Date.now().toString().slice(-5), 
        milestones: [], 
        resources: [],
        ...projectData,
      } as Project;
      setProjects(prev => [newProject, ...prev]);
    }
    
    setIsModalOpen(false);
    resetFormStates();
  }, [projectName, projectDescription, projectStatus, projectFocus, projectStartDate, projectEndDate, projectTagsString, currentProject, t, resetFormStates]);

  const filteredAndSortedProjects = useMemo(() => {
    let processedProjects = [...projects];

    // Apply filters
    if (tagFilter) {
      processedProjects = processedProjects.filter(project => 
        project.tags?.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
      );
    }
    if (statusFilter !== 'all') {
      processedProjects = processedProjects.filter(project => project.status === statusFilter);
    }

    // Apply sorting
    processedProjects.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'startDate':
          const dateAStart = a.startDate ? parseISO(a.startDate) : null;
          const dateBStart = b.startDate ? parseISO(b.startDate) : null;
          if (dateAStart && dateBStart) comparison = compareAsc(dateAStart, dateBStart);
          else if (dateAStart) comparison = -1; 
          else if (dateBStart) comparison = 1;
          break;
        case 'endDate':
          const dateAEnd = a.endDate ? parseISO(a.endDate) : null;
          const dateBEnd = b.endDate ? parseISO(b.endDate) : null;
          if (dateAEnd && dateBEnd) comparison = compareAsc(dateAEnd, dateBEnd);
          else if (dateAEnd) comparison = -1; 
          else if (dateBEnd) comparison = 1;
          break;
        case 'status':
          comparison = projectStatusOrder.indexOf(a.status) - projectStatusOrder.indexOf(b.status);
          break;
        case 'focus':
          comparison = (a.focus === b.focus) ? 0 : a.focus ? -1 : 1; // true (focused) comes first
          break;
      }
      return sortOrder === 'asc' ? comparison : comparison * -1;
    });
    
    return processedProjects;
  }, [projects, tagFilter, statusFilter, sortBy, sortOrder]);

  return (
    <PageWrapper title={t('page_title_projects')}>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <Button onClick={openNewProjectModal} data-testid="create-project-btn" className="w-full sm:w-auto order-2 sm:order-1">
          <PlusCircle className="mr-2 h-5 w-5" /> {t('projects_create_new_project_button')}
        </Button>
        
        <Card className="p-3 sm:p-4 w-full order-1 sm:order-2 shadow-sm bg-card/70">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="tagFilter" className="text-xs font-medium">{t('common_filter_by_tag')}</Label>
              <div className="relative">
                <Input 
                  id="tagFilter"
                  type="text"
                  placeholder={t('common_tag_placeholder_filter')}
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="pl-8 text-sm h-9"
                />
                <TagIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <Label htmlFor="statusFilter" className="text-xs font-medium">{t('common_filter_by_status')}</Label>
              <Select value={statusFilter} onValueChange={(value: ProjectStatus | 'all') => setStatusFilter(value)}>
                <SelectTrigger id="statusFilter" className="text-sm h-9">
                  <SelectValue placeholder={t('common_all_statuses')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common_all_statuses')}</SelectItem>
                  {projectStatusOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{t(`project_status_${opt.replace('-', '_')}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sortBy" className="text-xs font-medium">{t('common_sort_by')}</Label>
              <Select value={sortBy} onValueChange={(value: SortableProjectKeys) => setSortBy(value)}>
                <SelectTrigger id="sortBy" className="text-sm h-9">
                  <SelectValue placeholder={t('common_select_sort_criterion')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">{t('project_sort_by_name')}</SelectItem>
                  <SelectItem value="startDate">{t('common_start_date')}</SelectItem>
                  <SelectItem value="endDate">{t('common_end_date')}</SelectItem>
                  <SelectItem value="status">{t('common_status')}</SelectItem>
                  <SelectItem value="focus">{t('project_field_focus')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3"> {/* Adjusted to align sort order with other fields */}
             <div className="lg:col-start-2"> {/* Placeholder div to align sort order or leave empty */}
             </div>
             <div className="lg:col-start-3">
                <Label htmlFor="sortOrder" className="text-xs font-medium">{t('common_sort_order')}</Label>
                <Select value={sortOrder} onValueChange={(value: SortOrder) => setSortOrder(value)}>
                    <SelectTrigger id="sortOrder" className="text-sm h-9">
                    <SelectValue placeholder={t('common_select_sort_order')} />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="asc">{t('common_sort_order_asc')}</SelectItem>
                    <SelectItem value="desc">{t('common_sort_order_desc')}</SelectItem>
                    </SelectContent>
                </Select>
             </div>
           </div>
        </Card>
      </div>

      {filteredAndSortedProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={() => openEditProjectModal(project)}
            />
          ))}
        </div>
      ) : (
         <Card className="flex flex-col items-center justify-center p-10 text-center min-h-[300px]">
          <Briefcase className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {tagFilter || statusFilter !== 'all' 
              ? t('common_no_projects_filter_placeholder') 
              : t('project_no_projects_placeholder')}
          </p>
        </Card>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent data-testid="project-modal" className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentProject?.id ? t('project_modal_edit_title') : t('project_modal_create_title')}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 flex-grow max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <Label htmlFor="projectName">{t('project_name_label')}</Label>
              <Input 
                id="projectName" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder={t('project_name_placeholder')}
                data-testid="project-name-input"
              />
            </div>
            <div>
              <Label htmlFor="projectDescription">{t('common_description')} {t('common_optional_suffix')}</Label>
              <Textarea 
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder={t('project_description_placeholder')}
                data-testid="project-description-input"
              />
            </div>
            <div>
              <Label htmlFor="projectTags">{t('common_tags')} {t('common_optional_suffix')}</Label>
              <Input
                id="projectTags"
                value={projectTagsString}
                onChange={(e) => setProjectTagsString(e.target.value)}
                placeholder={t('common_tags_placeholder')}
              />
            </div>
            <div>
              <Label htmlFor="projectStatus">{t('common_status')}</Label>
              <Select value={projectStatus} onValueChange={(value: ProjectStatus) => setProjectStatus(value)}>
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
                      {projectStartDate ? format(projectStartDate, "PPP") : <span>{t('common_pick_a_date')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={projectStartDate}
                      onSelect={setProjectStartDate}
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
                      {projectEndDate ? format(projectEndDate, "PPP") : <span>{t('common_pick_a_date')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={projectEndDate}
                      onSelect={setProjectEndDate}
                      disabled={(date) => projectStartDate ? date < projectStartDate : false}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="projectFocus" 
                checked={projectFocus} 
                onCheckedChange={setProjectFocus}
                data-testid="project-focus-switch"
              />
              <Label htmlFor="projectFocus" className="flex flex-col">
                <span>{t('project_field_focus')}</span>
                <span className="font-normal text-xs text-muted-foreground">{t('project_field_focus_description')}</span>
              </Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => { setIsModalOpen(false); resetFormStates(); }}>{t('common_cancel')}</Button>
            </DialogClose>
            <Button onClick={handleSaveProject} data-testid="submit-project-btn">{t('project_save_button')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageWrapper>
  );
}

