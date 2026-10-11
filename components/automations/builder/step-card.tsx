"use client";

import Button from "@/components/_ui/button";
import Field from "@/components/_ui/field";
import { Input } from "@/components/_ui/input";
import Tag from "@/components/_ui/tag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_ui/select";
import {
  ACTION_LABELS,
  ACTION_TYPES,
  type ActionType,
  type AutomationStep,
} from "@/data/automations";
import { SMS_TEMPLATES, TEMPLATES } from "@/data/campaigns";
import { STAGES, type Stage } from "@/data/companies";
import ChevronIcon from "@/public/assets/images/_common/chevron-down.svg";
import XIcon from "@/public/assets/images/companies/detail/x.svg";

type StepCardProps = {
  step: AutomationStep;
  index: number;
  total: number;
  day: number;
  readOnly: boolean;
  onChange: (step: AutomationStep) => void;
  onMove: (delta: number) => void;
  onRemove: () => void;
};

type Option = { value: string; label: string };

function SelectField({
  id,
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: Option[];
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label} htmlFor={id}>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

const ACTION_OPTIONS = ACTION_TYPES.map((type) => ({ value: type, label: ACTION_LABELS[type] }));
const EMAIL_OPTIONS = TEMPLATES.map((template) => ({ value: template.id, label: template.name }));
const SMS_OPTIONS = SMS_TEMPLATES.map((template) => ({ value: template.id, label: template.name }));
const STAGE_OPTIONS = STAGES.map((stage) => ({ value: stage, label: stage }));

export default function StepCard({
  step,
  index,
  total,
  day,
  readOnly,
  onChange,
  onMove,
  onRemove,
}: StepCardProps) {
  const fieldId = (name: string) => `${step.id}-${name}`;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line-strong bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <Tag tone="neutral" size="sm">
            Passo {index + 1}
          </Tag>
          <span className="caption-style text-subtle tabular-nums">Dia {day}</span>
        </span>
        {!readOnly && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Mover passo para cima"
              disabled={index === 0}
              onClick={() => onMove(-1)}
            >
              <ChevronIcon aria-hidden className="size-3 rotate-180" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Mover passo para baixo"
              disabled={index === total - 1}
              onClick={() => onMove(1)}
            >
              <ChevronIcon aria-hidden className="size-3" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Remover passo" onClick={onRemove}>
              <XIcon aria-hidden className="size-3.5" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)]">
        <Field label="Esperar (dias)" htmlFor={fieldId("wait")}>
          <Input
            id={fieldId("wait")}
            type="number"
            min={0}
            inputMode="numeric"
            value={step.waitDays}
            disabled={readOnly}
            className="tabular-nums"
            onChange={(event) =>
              onChange({ ...step, waitDays: Math.max(0, Number(event.target.value) || 0) })
            }
          />
        </Field>
        <SelectField
          id={fieldId("action")}
          label="Ação"
          value={step.action}
          options={ACTION_OPTIONS}
          disabled={readOnly}
          onChange={(value) => onChange({ ...step, action: value as ActionType })}
        />
      </div>

      {step.action === "enviar-email" && (
        <SelectField
          id={fieldId("email")}
          label="Modelo de e-mail"
          value={step.emailTemplateId}
          options={EMAIL_OPTIONS}
          disabled={readOnly}
          onChange={(emailTemplateId) => onChange({ ...step, emailTemplateId })}
        />
      )}
      {step.action === "enviar-sms" && (
        <SelectField
          id={fieldId("sms")}
          label="Modelo de SMS"
          value={step.smsTemplateId}
          options={SMS_OPTIONS}
          disabled={readOnly}
          onChange={(smsTemplateId) => onChange({ ...step, smsTemplateId })}
        />
      )}
      {step.action === "criar-tarefa" && (
        <Field
          label="Título da tarefa"
          htmlFor={fieldId("task")}
          hint="A tarefa é atribuída ao gestor de conta do cliente."
          error={!readOnly && !step.taskTitle.trim() ? "Indique o título." : undefined}
        >
          <Input
            id={fieldId("task")}
            value={step.taskTitle}
            disabled={readOnly}
            onChange={(event) => onChange({ ...step, taskTitle: event.target.value })}
          />
        </Field>
      )}
      {step.action === "mudar-fase" && (
        <SelectField
          id={fieldId("stage")}
          label="Nova fase do cliente"
          value={step.stage}
          options={STAGE_OPTIONS}
          disabled={readOnly}
          onChange={(value) => onChange({ ...step, stage: value as Stage })}
        />
      )}
      {step.action === "notificar-gestor" && (
        <Field
          label="Mensagem para o gestor"
          htmlFor={fieldId("message")}
          error={!readOnly && !step.message.trim() ? "Escreva a mensagem." : undefined}
        >
          <Input
            id={fieldId("message")}
            value={step.message}
            disabled={readOnly}
            onChange={(event) => onChange({ ...step, message: event.target.value })}
          />
        </Field>
      )}
      {step.action === "adicionar-segmento" && (
        <Field
          label="Nome do segmento"
          htmlFor={fieldId("segment")}
          error={!readOnly && !step.segmentName.trim() ? "Indique o segmento." : undefined}
        >
          <Input
            id={fieldId("segment")}
            value={step.segmentName}
            disabled={readOnly}
            placeholder="Ex.: Reativados outubro"
            onChange={(event) => onChange({ ...step, segmentName: event.target.value })}
          />
        </Field>
      )}
    </div>
  );
}
