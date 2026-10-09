"use client";

import { useRef, useState, type FormEvent } from "react";
import Button from "@/components/_ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/_ui/dialog";
import Field from "@/components/_ui/field";
import FormSection from "@/components/_common/form-section";
import { Input } from "@/components/_ui/input";
import { Textarea } from "@/components/_ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_ui/select";
import { COMPANIES, OWNERS, ZONES } from "@/data/companies";
import { ACTIVITY_TYPES, type Activity, type ActivityType } from "@/data/activities";
import { useActivitiesStore } from "@/stores/activities-store";
import PlusIcon from "@/public/assets/images/_common/plus.svg";

function today() {
  return new Date().toISOString().slice(0, 10);
}

type FormState = {
  type: ActivityType;
  companyId: string;
  contactName: string;
  owner: string;
  zone: (typeof ZONES)[number];
  date: string;
  note: string;
};

const EMPTY_FORM: FormState = {
  type: ACTIVITY_TYPES[0],
  companyId: COMPANIES[0].id,
  contactName: "",
  owner: OWNERS[0].name,
  zone: ZONES[0],
  date: today(),
  note: "",
};

export default function NewActivityDialog() {
  const open = useActivitiesStore((state) => state.newActivityOpen);
  const setOpen = useActivitiesStore((state) => state.setNewActivityOpen);
  const addActivity = useActivitiesStore((state) => state.addActivity);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [noteError, setNoteError] = useState<string | null>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const note = form.note.trim();
    if (!note) {
      setNoteError("Descreva o registo.");
      noteRef.current?.focus();
      return;
    }

    const company = COMPANIES.find((item) => item.id === form.companyId);
    if (!company) return;

    const activity: Activity = {
      id: `act-${Date.now()}`,
      type: form.type,
      companyId: company.id,
      companyName: company.name,
      contactName: form.contactName.trim() || undefined,
      owner: form.owner,
      zone: form.zone,
      date: form.date || today(),
      note,
    };

    addActivity(activity);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[520px]"
        onCloseAutoFocus={() => {
          setForm(EMPTY_FORM);
          setNoteError(null);
        }}
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Novo Registo</DialogTitle>
            <DialogDescription>
              Regista uma visita, chamada ou outra interação. Aparece na
              lista e no calendário de imediato.
            </DialogDescription>
          </DialogHeader>

          <FormSection title="Interação">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tipo" htmlFor="activity-type">
                <Select
                  value={form.type}
                  onValueChange={(value) => update("type", value as ActivityType)}
                >
                  <SelectTrigger id="activity-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Data" htmlFor="activity-date">
                <Input
                  id="activity-date"
                  type="date"
                  value={form.date}
                  onChange={(event) => update("date", event.target.value)}
                  className="tabular-nums"
                />
              </Field>
            </div>

            <Field label="Cliente" htmlFor="activity-company">
              <Select
                value={form.companyId}
                onValueChange={(value) => update("companyId", value)}
              >
                <SelectTrigger id="activity-company">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPANIES.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contacto" htmlFor="activity-contact">
                <Input
                  id="activity-contact"
                  value={form.contactName}
                  onChange={(event) => update("contactName", event.target.value)}
                  placeholder="Nome do contacto"
                  autoComplete="off"
                />
              </Field>
              <Field label="Zona" htmlFor="activity-zone">
                <Select
                  value={form.zone}
                  onValueChange={(value) =>
                    update("zone", value as (typeof ZONES)[number])
                  }
                >
                  <SelectTrigger id="activity-zone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ZONES.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Gestor" htmlFor="activity-owner">
              <Select
                value={form.owner}
                onValueChange={(value) => update("owner", value)}
              >
                <SelectTrigger id="activity-owner">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OWNERS.map((owner) => (
                    <SelectItem key={owner.name} value={owner.name}>
                      {owner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Nota"
              htmlFor="activity-note"
              required
              error={noteError ?? undefined}
            >
              <Textarea
                ref={noteRef}
                id="activity-note"
                value={form.note}
                onChange={(event) => {
                  update("note", event.target.value);
                  if (noteError) setNoteError(null);
                }}
                placeholder="Descreva a interação"
                aria-invalid={noteError ? true : undefined}
                className="aria-invalid:border-danger"
                rows={3}
                autoFocus
              />
            </Field>
          </FormSection>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="subtle" size="sm">
                Cancelar
              </Button>
            </DialogClose>
            <Button variant="primary" size="sm" type="submit">
              <PlusIcon aria-hidden className="size-3" />
              Criar Registo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
