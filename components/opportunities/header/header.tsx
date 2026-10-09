"use client";

import Button from "@/components/_ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/_ui/tabs";
import { useOpportunitiesStore } from "@/stores/opportunities-store";
import { useUiStore } from "@/stores/ui-store";
import MenuIcon from "@/public/assets/images/_common/menu.svg";

type OpportunitiesHeaderProps = {
  count: number;
};

export default function OpportunitiesHeader({
  count,
}: OpportunitiesHeaderProps) {
  const view = useOpportunitiesStore((state) => state.view);
  const setView = useOpportunitiesStore((state) => state.setView);
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
        <h1 className="truncate">Oportunidades</h1>
        <span className="caption-style bg-muted inline-flex h-4 min-w-6 shrink-0 items-center justify-center rounded-full border-[0.5px] border-[#414141] px-1 text-center text-chip shadow-[0px_0px_0px_0.5px_#0e0e0e]">
          {count}
        </span>
      </div>

      <Tabs value={view} onValueChange={(value) => setView(value as typeof view)}>
        <TabsList className="border-border border-b px-4">
          <TabsTrigger value="kanban">Quadro</TabsTrigger>
          <TabsTrigger value="tabela">Tabela</TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
}
