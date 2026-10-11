import { create } from "zustand";
import { ACTIVITIES, type Activity, type ActivityType } from "@/data/activities";
import { CURRENT_USER } from "@/data/companies";
import { TASKS, type Task, type TaskStatus } from "@/data/tasks";
import { DEFAULT_FILTERS } from "@/lib/activities";
import { recordEvent } from "./audit-store";

const ACTIVITY_PHRASES: Record<ActivityType, string> = {
  Visita: "registou uma visita a",
  Chamada: "registou uma chamada com",
  "E-mail": "registou um e-mail para",
  Reunião: "registou uma reunião com",
  Entrega: "registou uma entrega a",
  Reclamação: "registou uma reclamação de",
};

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

export const useActivitiesStore = create<ActivitiesState>((set, get) => ({
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
  addActivity: (activity) => {
    set((state) => ({
      activities: [activity, ...state.activities],
      newActivityOpen: false,
    }));
    recordEvent({
      action: ACTIVITY_PHRASES[activity.type],
      target: { module: "Atividades", id: activity.id, label: activity.companyName },
      companyId: activity.companyId,
      toast: { title: "Atividade registada", description: `${activity.type} · ${activity.companyName}`, tone: "success" },
    });
  },

  setNewTaskOpen: (newTaskOpen) => set({ newTaskOpen }),
  addTask: (task) => {
    set((state) => ({
      tasks: [task, ...state.tasks],
      newTaskOpen: false,
    }));
    recordEvent({
      action: "criou a tarefa",
      target: { module: "Atividades", id: task.id, label: task.title },
      notify: task.assignee === CURRENT_USER.name ? false : "update",
      changes: [{ field: "Responsável", to: task.assignee }],
      toast: { title: "Tarefa criada", description: task.title, tone: "success" },
    });
  },
  moveTaskStatus: (id, status) => {
    const task = get().tasks.find((item) => item.id === id);
    if (!task || task.status === status) return;
    set((state) => ({
      tasks: state.tasks.map((item) => (item.id === id ? { ...item, status } : item)),
    }));
    recordEvent({
      action: status === "Feita" ? "concluiu a tarefa" : "alterou o estado da tarefa",
      target: { module: "Atividades", id, label: task.title },
      notify: false,
      changes: [{ field: "Estado", from: task.status, to: status }],
    });
  },
}));
