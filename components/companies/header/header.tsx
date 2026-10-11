"use client";

import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/_ui/tabs";
import ModuleHeader from "@/components/_common/module-header";
import { CURRENT_USER } from "@/data/companies";
import { useCompaniesStore } from "@/stores/companies-store";
import ActiveDot from "@/public/assets/images/companies/header/active-dot.svg";

const TABS = [
  { value: "companies", label: "Clientes" },
  { value: "deals", label: "Oportunidades" },
  { value: "forecast", label: "Previsão" },
];

export default function CompaniesHeader() {
  const activeTab = useCompaniesStore((state) => state.activeTab);
  const setActiveTab = useCompaniesStore((state) => state.setActiveTab);
  const openProfile = useCompaniesStore((state) => state.openProfile);

  return (
    <ModuleHeader
      title="Clientes"
      badge={
        <span className="caption-style bg-muted hidden shrink-0 items-center gap-0.5 rounded-full border border-[#363636] py-[3px] pr-[5px] pl-[3px] sm:inline-flex">
          <ActiveDot aria-hidden className="size-3" />
          Ativo
        </span>
      }
      actions={
        <Button
          variant="secondary"
          size="none"
          className="caption-style h-[30px] gap-1.5 py-[5px] pr-[7px] pl-[5px] font-normal"
          aria-label={`Abrir perfil de ${CURRENT_USER.name}`}
          onClick={() => openProfile(CURRENT_USER.name)}
        >
          <Avatar src={CURRENT_USER.avatar} alt="" />
          <span className="hidden sm:inline">{CURRENT_USER.name}</span>
        </Button>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-border border-b px-4">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </ModuleHeader>
  );
}
