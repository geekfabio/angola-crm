import ModuleHeader from "@/components/_common/module-header";
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
import { CAMPAIGNS, CHANNEL_TONES, STATUS_TONES } from "@/data/campaigns";
import { formatNumber, formatPercent } from "@/lib/format";

export default function Campaigns() {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <ModuleHeader title="Campanhas" count={CAMPAIGNS.length} />
      <ScrollArea orientation="both" className="min-h-0 flex-1">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              <TableHead>Campanha</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Destinatários</TableHead>
              <TableHead className="text-right">Taxa de Abertura</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CAMPAIGNS.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <Tag tone={CHANNEL_TONES[campaign.channel]}>
                    {campaign.channel}
                  </Tag>
                </TableCell>
                <TableCell>
                  <Tag tone={STATUS_TONES[campaign.status]}>
                    {campaign.status}
                  </Tag>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(campaign.recipients)}
                </TableCell>
                <TableCell className="text-right tabular-nums text-soft">
                  {campaign.openRate !== undefined
                    ? formatPercent(campaign.openRate)
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </section>
  );
}
