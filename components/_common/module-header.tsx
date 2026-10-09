"use client";

import Button from "@/components/_ui/button";
import CountBadge from "@/components/_ui/count-badge";
import { useUiStore } from "@/stores/ui-store";
import MenuIcon from "@/public/assets/images/_common/menu.svg";

type ModuleHeaderProps = {
  title: string;
  count?: number;
};

export default function ModuleHeader({ title, count }: ModuleHeaderProps) {
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  return (
    <header className="shrink-0 border-b border-border">
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
        <h1 className="truncate">{title}</h1>
        {count !== undefined && <CountBadge>{count}</CountBadge>}
      </div>
    </header>
  );
}
