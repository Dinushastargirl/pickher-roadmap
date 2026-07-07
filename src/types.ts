export interface Task {
  id: string;
  title: string;
  description: string;
  commands?: string[];
  expectedResult?: string;
  completed: boolean;
  notes?: string;
  duration?: string;
}

export interface Day {
  id: string;
  dayNum: number;
  title: string;
  objective: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  expectedOutcome: string;
  whyMatters: string;
  tasks: Task[];
}

export interface Week {
  id: string;
  weekNum: number;
  title: string;
  goal: string;
  milestones: { text: string; completed: boolean }[];
  days: Day[];
}

export interface Phase {
  id: string;
  phaseNum: number;
  title: string;
  subtitle: string;
  dateRange: string;
  status: 'Active' | 'Upcoming' | 'Locked';
  progress: number;
  objectives: string[];
  goal?: string;
  milestones?: string[];
  weeks?: Week[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Bug {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Backlog' | 'In Progress' | 'Testing' | 'Completed';
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  completed: string;
  challenges: string;
  solutions: string;
  nextSteps: string;
}

export interface DashboardState {
  checklist: ChecklistItem[];
  bugs: Bug[];
  journal: JournalEntry[];
  completedTasks: string[]; // List of task IDs that are completed
  taskNotes: Record<string, string>; // Maps taskId -> custom user notes
}
