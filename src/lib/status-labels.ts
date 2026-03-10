import type { ProjectStatus, TaskStatus } from '@/types/codex';

export function getTaskStatusTranslationKey(status: TaskStatus) {
  return `task_status_${status.replace(/-/g, '_')}`;
}

export function getProjectStatusTranslationKey(status: ProjectStatus) {
  return `project_status_${status.replace(/-/g, '_')}`;
}
