"use client";

import Button from "@/components/_ui/button";
import CountBadge from "@/components/_ui/count-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/_ui/tabs";
import { useActivitiesStore, type ActivitiesView } from "@/stores/activities-store";
import { useUiStore } from "@/stores/ui-store";
import MenuIcon from "@/public/assets/images/_common/menu.svg";

type ActivitiesHeaderProps = {
  count: number;
};

export default function ActivitiesHeader({ count }: ActivitiesHeaderProps) {
  const view = useActivitiesStore((state) => state.view);
  const setView = useActivitiesStore((state) => state.setView);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  return (
    <header className="shrink-0">
      <div className="flex items-center gap-2 px-4 py-[14px]">
        <Button
          variant="secondary"
          size="icon"
          className="lg:hidden"
          aria-label="Abrir navegação"
          onClick={() => setSidebarOpen(true)}
        >
          <MenuIcon aria-hidden className="size-3.5" />
        </Button>
        <h1 className="truncate">Atividades</h1>
        <CountBadge>{count}</CountBadge>
      </div>

      <Tabs
        value={view}
        onValueChange={(value) => setView(value as ActivitiesView)}
      >
        <TabsList className="border-border overflow-x-auto border-b px-4">
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
          <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
          <TabsTrigger value="rota">Rota do Dia</TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
}
