"use client";

import { useMemo } from "react";
import Button from "@/components/_ui/button";
import { ScrollArea } from "@/components/_ui/scroll-area";
import Tag from "@/components/_ui/tag";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/_ui/table";
import {
  CHANNEL_LABELS,
  CHANNEL_TONES,
  STATUS_TONES,
  type Campaign,
} from "@/data/campaigns";
import { buildAudience } from "@/lib/campaigns";
import {
  formatDateShort,
  formatDateTime,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import { useCampaignsStore } from "@/stores/campaigns-store";
import { useCompaniesStore } from "@/stores/companies-store";
import { useContactsStore } from "@/stores/contacts-store";

type CampaignsTableProps = {
  campaigns: Campaign[];
};

function isLive(campaign: Campaign) {
  return (
    campaign.channel === "Email" &&
    (campaign.status === "Rascunho" || campaign.status === "Em revisão")
  );
}

export default function CampaignsTable({ campaigns }: CampaignsTableProps) {
  const openEditor = useCampaignsStore((state) => state.openEditor);
  const companies = useCompaniesStore((state) => state.companies);
  const contacts = useContactsStore((state) => state.contacts);

  const liveRecipients = useMemo(() => {
    const counts = new Map<string, number>();
    for (const campaign of campaigns) {
      if (isLive(campaign)) {
        counts.set(
          campaign.id,
          buildAudience(campaign.audience, companies, contacts).eligible.length,
        );
      }
    }
    return counts;
  }, [campaigns, companies, contacts]);

  return (
    <ScrollArea orientation="both" className="min-h-0 flex-1">
      <Table className="min-w-[860px]">
        <TableHeader>
          <TableRow>
            <TableHead>Campanha</TableHead>
            <TableHead>Canal</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Destinatários</TableHead>
            <TableHead className="text-right">Taxa de Abertura</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => {
            const editable = campaign.channel === "Email";
            return (
              <TableRow
                key={campaign.id}
                onClick={editable ? () => openEditor(campaign.id) : undefined}
                className={editable ? "hover:bg-card/60 cursor-pointer" : undefined}
              >
                <TableCell className="max-w-[320px]">
                  <span className="flex min-w-0 flex-col gap-1">
                    {editable ? (
                      <Button
                        variant="link"
                        size="none"
                        className="justify-start truncate no-underline"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditor(campaign.id);
                        }}
                      >
                        {campaign.name}
                      </Button>
                    ) : (
                      <span className="truncate font-medium">{campaign.name}</span>
                    )}
                    <span className="caption-style text-subtle truncate">
                      {editable
                        ? campaign.subject || "Sem assunto"
                        : "Edição de SMS ainda não disponível"}
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <Tag tone={CHANNEL_TONES[campaign.channel]}>
                    {CHANNEL_LABELS[campaign.channel]}
                  </Tag>
                </TableCell>
                <TableCell>
                  <Tag tone={STATUS_TONES[campaign.status]}>{campaign.status}</Tag>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(liveRecipients.get(campaign.id) ?? campaign.recipients)}
                </TableCell>
                <TableCell className="text-soft text-right tabular-nums">
                  {campaign.openRate !== undefined
                    ? formatPercent(campaign.openRate)
                    : "—"}
                </TableCell>
                <TableCell className="text-soft tabular-nums">
                  {campaign.status === "Agendada" && campaign.scheduledAt
                    ? formatDateTime(campaign.scheduledAt)
                    : formatDateShort(campaign.updatedAt)}
                </TableCell>
              </TableRow>
            );
          })}
          {campaigns.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="caption-style text-subtle py-10 text-center">
                Sem campanhas para os filtros escolhidos.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
