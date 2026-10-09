import ModuleHeader from "@/components/_common/module-header";
import { ScrollArea } from "@/components/_ui/scroll-area";
import Tag from "@/components/_ui/tag";
import SegmentBar from "@/components/_common/segment-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/_ui/table";
import { TAG_TONES } from "@/data/companies";
import { OPPORTUNITIES } from "@/data/opportunities";
import { formatDateShort, formatMoney } from "@/lib/format";

export default function Opportunities() {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <ModuleHeader title="Oportunidades" count={OPPORTUNITIES.length} />
      <ScrollArea orientation="both" className="min-h-0 flex-1">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Fase</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Probabilidade</TableHead>
              <TableHead>Data prevista de fecho</TableHead>
              <TableHead>Gestor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {OPPORTUNITIES.map((opportunity) => (
              <TableRow key={opportunity.id}>
                <TableCell className="font-medium">
                  {opportunity.companyName}
                </TableCell>
                <TableCell className="text-soft">
                  {opportunity.contactName}
                </TableCell>
                <TableCell>
                  <Tag tone={TAG_TONES[opportunity.stage]}>
                    {opportunity.stage}
                  </Tag>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatMoney(opportunity.value)}
                </TableCell>
                <TableCell className="text-right">
                  <span className="flex items-center justify-end gap-2 tabular-nums">
                    <SegmentBar
                      percent={opportunity.probability}
                      className="w-[60px]"
                    />
                    <span className="w-[4ch]">{opportunity.probability}%</span>
                  </span>
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatDateShort(opportunity.expectedCloseDate)}
                </TableCell>
                <TableCell className="text-soft">{opportunity.owner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </section>
  );
}
