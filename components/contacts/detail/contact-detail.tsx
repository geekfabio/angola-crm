"use client";

import Button from "@/components/_ui/button";
import { Checkbox } from "@/components/_ui/checkbox";
import DetailSection from "@/components/_common/detail-section";
import Tag from "@/components/_ui/tag";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/_ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_ui/select";
import {
  CONSENT_CHANNEL_LABELS,
  CONTACTABILITY_STATUSES,
  type ConsentChannel,
  type ContactabilityStatus,
} from "@/data/contacts";
import { formatDateLong } from "@/lib/format";
import { useContactsStore } from "@/stores/contacts-store";
import BookClosedIcon from "@/public/assets/images/companies/sidebar/book-closed.svg";
import XIcon from "@/public/assets/images/companies/detail/x.svg";
import MailIcon from "@/public/assets/images/companies/detail/mail-04.svg";
import PhoneIcon from "@/public/assets/images/companies/detail/phone.svg";

const CHANNELS = Object.keys(CONSENT_CHANNEL_LABELS) as ConsentChannel[];

export default function ContactDetail() {
  const detailId = useContactsStore((state) => state.detailId);
  const detailOpen = useContactsStore((state) => state.detailOpen);
  const contacts = useContactsStore((state) => state.contacts);
  const closeDetail = useContactsStore((state) => state.closeDetail);
  const updateContactability = useContactsStore(
    (state) => state.updateContactability,
  );
  const toggleConsent = useContactsStore((state) => state.toggleConsent);

  const contact = contacts.find((item) => item.id === detailId);

  return (
    <Sheet
      open={detailOpen && contact !== undefined}
      onOpenChange={(open) => !open && closeDetail()}
    >
      <SheetContent side="right" className="sm:w-[480px] sm:max-w-[480px]">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <BookClosedIcon aria-hidden className="text-icon size-3.5" />
            <SheetTitle>Detalhe do Contacto</SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Dados, cliente associado e consentimento por canal
          </SheetDescription>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="-mr-1"
              aria-label="Fechar detalhe"
            >
              <XIcon aria-hidden className="text-foreground size-4" />
            </Button>
          </SheetClose>
        </SheetHeader>

        {contact && (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3 p-5 shadow-[inset_0_-1px_0_var(--line-strong)]">
              <h2 className="truncate">{contact.name}</h2>
              <span className="caption-style text-subtle">
                {contact.role} · {contact.companyName}
              </span>
              <div className="lead-style flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1">
                  <MailIcon aria-hidden className="text-soft size-3" />
                  {contact.email}
                </span>
                <span className="flex items-center gap-1">
                  <PhoneIcon aria-hidden className="text-soft size-3" />
                  {contact.phone}
                </span>
              </div>
            </div>

            <DetailSection title="Estado de contactabilidade">
              <Select
                value={contact.contactability}
                onValueChange={(value) =>
                  updateContactability(
                    contact.id,
                    value as ContactabilityStatus,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTACTABILITY_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DetailSection>

            <DetailSection title="Consentimento por canal" className="shadow-none">
              <div className="flex flex-col gap-4">
                {CHANNELS.map((channel) => {
                  const state = contact.consent[channel];
                  return (
                    <label
                      key={channel}
                      className="flex cursor-pointer items-start justify-between gap-3"
                    >
                      <span className="flex flex-col gap-1">
                        <span className="lead-style flex items-center gap-2">
                          {CONSENT_CHANNEL_LABELS[channel]}
                          <Tag
                            tone={state.granted ? "green" : "neutral"}
                            size="sm"
                          >
                            {state.granted ? "Consentido" : "Sem consentimento"}
                          </Tag>
                        </span>
                        <span className="caption-style text-subtle">
                          {formatDateLong(state.date)} · {state.origin}
                        </span>
                      </span>
                      <Checkbox
                        checked={state.granted}
                        onCheckedChange={() => toggleConsent(contact.id, channel)}
                      />
                    </label>
                  );
                })}
              </div>
            </DetailSection>
          </div>
        )}

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="subtle" size="sm">
              Fechar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
