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
import { CONSENT_TONES, CONTACTS } from "@/data/contacts";

export default function Contacts() {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <ModuleHeader title="Contactos" count={CONTACTS.length} />
      <ScrollArea orientation="both" className="min-h-0 flex-1">
        <Table className="min-w-[780px]">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Consentimento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CONTACTS.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell className="text-soft">{contact.role}</TableCell>
                <TableCell className="text-soft">
                  {contact.companyName}
                </TableCell>
                <TableCell className="tabular-nums">{contact.phone}</TableCell>
                <TableCell className="text-soft">{contact.email}</TableCell>
                <TableCell>
                  <Tag tone={CONSENT_TONES[contact.consent]}>
                    {contact.consent}
                  </Tag>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </section>
  );
}
