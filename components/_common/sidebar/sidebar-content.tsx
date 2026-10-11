"use client";

import { usePathname } from "next/navigation";
import Asset from "@/components/_ui/asset";
import { ScrollArea } from "@/components/_ui/scroll-area";
import SidebarNavItem from "./sidebar-nav-item";
import SidebarSection from "./sidebar-section";
import { useCompaniesStore } from "@/stores/companies-store";
import { useSettingsStore } from "@/stores/settings-store";
import { ZONE_DOTS } from "./zone-dots";
import { TEAM_ICON_COMPONENTS } from "./team-icons";
import SettingsIcon from "@/public/assets/images/_common/filter.svg";
import BuildingIcon from "@/public/assets/images/companies/sidebar/building.svg";
import ClipboardIcon from "@/public/assets/images/companies/sidebar/clipboard.svg";
import BarChartIcon from "@/public/assets/images/companies/sidebar/bar-chart.svg";
import ListIcon from "@/public/assets/images/companies/sidebar/list.svg";
import BookClosedIcon from "@/public/assets/images/companies/sidebar/book-closed.svg";
import MailIcon from "@/public/assets/images/companies/sidebar/mail.svg";
import BarChartAltIcon from "@/public/assets/images/companies/sidebar/bar-chart-10.svg";
import AlertTriangleIcon from "@/public/assets/images/companies/sidebar/alert-triangle.svg";
import UserPlusIcon from "@/public/assets/images/companies/sidebar/user-plus.svg";
import MessageQuestionIcon from "@/public/assets/images/companies/sidebar/message-question.svg";
import ClockIcon from "@/public/assets/images/companies/detail/clock.svg";

const BASE_CLIENT_COUNT = 223;

const NAV_ITEMS = [
  { href: "/", icon: BuildingIcon, label: "Clientes", withCount: true },
  { href: "/oportunidades", icon: ClipboardIcon, label: "Oportunidades" },
  { href: "/previsao", icon: BarChartIcon, label: "Previsão" },
  { href: "/relatorios", icon: BarChartAltIcon, label: "Relatórios" },
  { href: "/atividades", icon: ListIcon, label: "Atividades" },
  { href: "/contactos", icon: BookClosedIcon, label: "Contactos" },
  { href: "/campanhas", icon: MailIcon, label: "Campanhas" },
  { href: "/automacoes", icon: ClockIcon, label: "Automações" },
  { href: "/tickets", icon: MessageQuestionIcon, label: "Tickets" },
] as const;


const REPORTING_ITEMS = [
  { icon: BarChartAltIcon, label: "Previsão do 1.º Trimestre" },
  { icon: AlertTriangleIcon, label: "Oportunidades Atrasadas" },
] as const;


export default function SidebarContent() {
  const pathname = usePathname();
  const clientCount = useCompaniesStore((state) => state.companies.length);
  const teams = useSettingsStore((state) => state.teams);
  const zones = useSettingsStore((state) => state.zones);
  const setSettingsTab = useSettingsStore((state) => state.setTab);
  const setInviteOpen = useSettingsStore((state) => state.setInviteOpen);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-sidebar-border bg-sidebar-accent flex shrink-0 items-center gap-2 border-b p-3">
        <Asset
          type="image"
          src="/assets/images/_common/brand/alimenta-angola-logo.png"
          alt="Alimenta Angola"
          width={96}
          height={64}
          fit="contain"
          className="size-8 shrink-0"
        />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="lead-style block truncate font-medium tracking-[-0.01em]">
            Alimenta Angola CRM
          </span>
          <span className="caption-style text-subtle block truncate">
            Carteira de clientes
          </span>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <nav aria-label="Navegação principal">
          <SidebarSection className="border-sidebar-border border-b">
            {NAV_ITEMS.map((item) => (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
                count={
                  "withCount" in item && item.withCount
                    ? BASE_CLIENT_COUNT + clientCount
                    : undefined
                }
              />
            ))}
          </SidebarSection>

          <SidebarSection
            title="Equipas Comerciais"
            className="border-sidebar-border border-b"
          >
            {teams
              .filter((team) => team.showInSidebar)
              .map((team) => (
                <SidebarNavItem
                  key={team.id}
                  icon={TEAM_ICON_COMPONENTS[team.icon]}
                  label={team.name}
                />
              ))}
          </SidebarSection>

          <SidebarSection
            title="Relatórios"
            className="border-sidebar-border border-b"
          >
            {REPORTING_ITEMS.map((item) => (
              <SidebarNavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </SidebarSection>

          <SidebarSection title="Zonas">
            {zones
              .filter((zone) => zone.showInSidebar)
              .map((zone) => (
                <SidebarNavItem
                  key={zone.name}
                  icon={ZONE_DOTS[zone.color]}
                  label={zone.name}
                />
              ))}
          </SidebarSection>
        </nav>
      </ScrollArea>

      <SidebarSection className="border-sidebar-border shrink-0 border-t">
        <SidebarNavItem
          href="/definicoes"
          icon={SettingsIcon}
          label="Definições"
          tone="quiet"
          active={pathname === "/definicoes"}
        />
        <SidebarNavItem
          href="/definicoes"
          icon={UserPlusIcon}
          label="Convidar Equipa"
          tone="quiet"
          onClick={() => {
            setSettingsTab("acessos");
            setInviteOpen(true);
          }}
        />
        <SidebarNavItem icon={MessageQuestionIcon} label="Ajuda" tone="quiet" />
      </SidebarSection>
    </div>
  );
}
