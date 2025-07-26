
export interface NavItem {
  title: string; 
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

export interface NavItemConfig {
  titleKey: string; 
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}


export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'in-review' | 'done';
export type TaskPriority = 'lowest' | 'low' | 'medium' | 'high' | 'highest';

export interface Task {
  id: string;
  title: string; 
  titleKey?: string; 
  description?: string; 
  descriptionKey?: string; 
  completed: boolean; 
  status: TaskStatus;
  dueDate?: string; 
  priority: TaskPriority;
  projectId?: string;
  tags?: string[]; // Added tags
}

export interface JournalEntry {
  id: string;
  date: string; 
  title: string; 
  titleKey?: string; 
  content: string; 
  contentKey?: string; 
  tags?: string[]; // Added tags
}

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';

export interface Project {
  id: string;
  name: string; 
  nameKey?: string; 
  description: string; 
  descriptionKey?: string; 
  status: ProjectStatus;
  focus: boolean; 
  startDate?: string; 
  endDate?: string; 
  milestones?: Milestone[];
  resources?: ResourceLink[];
  tags?: string[]; // Added tags
}

export interface Milestone {
  id: string;
  title: string; 
  titleKey?: string; 
  dueDate: string; 
  completed: boolean;
}

export interface ResourceLink {
  id: string;
  title: string; 
  titleKey?: string; 
  url: string;
}

export interface Goal {
  id: string;
  title: string; 
  titleKey?: string; 
  description?: string; 
  descriptionKey?: string; 
  targetDate?: string; 
  progress: number; 
  subGoals?: SubGoal[];
}

export interface SubGoal {
  id: string;
  title: string; 
  titleKey?: string; 
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string; 
  nameKey?: string; 
  frequency: 'daily' | 'weekly'; 
  lastCheckedIn?: string; 
}
