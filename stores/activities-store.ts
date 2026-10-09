import { create } from "zustand";
import { ACTIVITIES, type Activity } from "@/data/activities";
import { TASKS, type Task, type TaskStatus } from "@/data/tasks";
import { DEFAULT_FILTERS } from "@/lib/activities";

export type ActivitiesView = "lista" | "calendario" | "tarefas" | "rota";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonth() {
  return today().slice(0, 7);
}

type ActivitiesState = {
  activities: Activity[];
  tasks: Task[];
  type: string;
  owner: string;
  companyId: string;
  window: string;
  search: string;
  view: ActivitiesView;
  calendarMonth: string;
  newActivityOpen: boolean;
  newTaskOpen: boolean;
  setType: (type: string) => void;
  setOwner: (owner: string) => void;
  setCompanyId: (companyId: string) => void;
  setWindow: (window: string) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
  setView: (view: ActivitiesView) => void;
  setCalendarMonth: (month: string) => void;
  shiftCalendarMonth: (delta: number) => void;
  setNewActivityOpen: (open: boolean) => void;
  addActivity: (activity: Activity) => void;
  setNewTaskOpen: (open: boolean) => void;
  addTask: (task: Task) => void;
  moveTaskStatus: (id: string, status: TaskStatus) => void;
};

export const useActivitiesStore = create<ActivitiesState>((set) => ({
  activities: ACTIVITIES,
  tasks: TASKS,
  ...DEFAULT_FILTERS,
  view: "lista",
  calendarMonth: currentMonth(),
  newActivityOpen: false,
  newTaskOpen: false,

  setType: (type) => set({ type }),
  setOwner: (owner) => set({ owner }),
  setCompanyId: (companyId) => set({ companyId }),
  setWindow: (window) => set({ window }),
  setSearch: (search) => set({ search }),
  resetFilters: () => set({ ...DEFAULT_FILTERS }),
  setView: (view) => set({ view }),
  setCalendarMonth: (calendarMonth) => set({ calendarMonth }),
  shiftCalendarMonth: (delta) =>
    set((state) => {
      const [year, month] = state.calendarMonth.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1 + delta, 1));
      return {
        calendarMonth: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
      };
    }),

  setNewActivityOpen: (newActivityOpen) => set({ newActivityOpen }),
  addActivity: (activity) =>
    set((state) => ({
      activities: [activity, ...state.activities],
      newActivityOpen: false,
    })),

  setNewTaskOpen: (newTaskOpen) => set({ newTaskOpen }),
  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
      newTaskOpen: false,
    })),
  moveTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status } : task,
      ),
    })),
}));
