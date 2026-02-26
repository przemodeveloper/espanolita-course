export interface TaskSet {
  id: string;
  title: string;
  tasks: { id: string; title: string }[];
  tasksCount: number;
}