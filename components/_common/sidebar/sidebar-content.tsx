"use client";

import { usePathname } from "next/navigation";
import Asset from "@/components/_ui/asset";
import { ScrollArea } from "@/components/_ui/scroll-area";
import SidebarNavItem from "./sidebar-nav-item";
import SidebarSection from "./sidebar-section";
import { useCompaniesStore } from "@/stores/companies-store";
import BuildingIcon from "@/public/assets/images/companies/sidebar/building.svg";
import ClipboardIcon from "@/public/assets/images/companies/sidebar/clipboard.svg";
import BarChartIcon from "@/public/assets/images/companies/sidebar/bar-chart.svg";
import ListIcon from "@/public/assets/images/companies/sidebar/list.svg";
import BookClosedIcon from "@/public/assets/images/companies/sidebar/book-closed.svg";
import MailIcon from "@/public/assets/images/companies/sidebar/mail.svg";
import MessageQuestionIcon from "@/public/assets/images/companies/sidebar/message-question.svg";

const BASE_CLIENT_COUNT = 223;

const NAV_ITEMS = [
  { href: "/", icon: BuildingIcon, label: "Clientes", withCount: true },
  { href: "/oportunidades", icon: ClipboardIcon, label: "Oportunidades" },
  { href: "/previsao", icon: BarChartIcon, label: "Previsão" },
  { href: "/atividades", icon: ListIcon, label: "Atividades" },
  { href: "/contactos", icon: BookClosedIcon, label: "Contactos" },
  { href: "/campanhas", icon: MailIcon, label: "Campanhas" },
] as const;

export default function SidebarContent() {
  const pathname = usePathname();
  const clientCount = useCompaniesStore((state) => state.companies.length);

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
          <SidebarSection>
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
        </nav>
      </ScrollArea>

      <SidebarSection className="border-sidebar-border shrink-0 border-t">
        <SidebarNavItem
          icon={MessageQuestionIcon}
          label="Ajuda"
          tone="quiet"
        />
      </SidebarSection>
    </div>
  );
}
