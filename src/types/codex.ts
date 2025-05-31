
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
  title: string; // Direct title from user input or from titleKey
  titleKey?: string; // For dummy data translation
  description?: string; // Direct description from user input or from descriptionKey
  descriptionKey?: string; // For dummy data translation
  completed: boolean; 
  status: TaskStatus;
  dueDate?: string; 
  priority: TaskPriority;
  projectId?: string;
}

export interface JournalEntry {
  id: string;
  date: string; 
  title: string; // Direct title or from titleKey
  titleKey?: string; // For dummy data translation
  content: string; // Direct content or from contentKey
  contentKey?: string; // For dummy data translation
}

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';

export interface Project {
  id: string;
  name: string; // Direct name or from nameKey
  nameKey?: string; // For dummy data translation
  description: string; // Direct description or from descriptionKey
  descriptionKey?: string; // For dummy data translation
  status: ProjectStatus;
  focus: boolean; 
  startDate?: string; 
  endDate?: string; 
  milestones?: Milestone[];
  resources?: ResourceLink[];
}

export interface Milestone {
  id: string;
  title: string; // Direct title or from titleKey
  titleKey?: string; // For dummy data translation
  dueDate: string; 
  completed: boolean;
}

export interface ResourceLink {
  id: string;
  title: string; // Direct title or from titleKey
  titleKey?: string; // For dummy data translation
  url: string;
}

export interface Goal {
  id: string;
  title: string; // Direct title or from titleKey
  titleKey?: string; // For dummy data translation
  description?: string; // Direct description or from descriptionKey
  descriptionKey?: string; // For dummy data translation
  targetDate?: string; 
  progress: number; 
  subGoals?: SubGoal[];
}

export interface SubGoal {
  id: string;
  title: string; // Direct title or from titleKey
  titleKey?: string; // For dummy data translation
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string; // Direct name or from nameKey
  nameKey?: string; // For dummy data translation
  frequency: 'daily' | 'weekly'; 
  lastCheckedIn?: string; 
}
