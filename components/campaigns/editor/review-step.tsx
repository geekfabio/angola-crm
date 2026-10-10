"use client";

import { useState } from "react";
import Button from "@/components/_ui/button";
import Field from "@/components/_ui/field";
import { Input } from "@/components/_ui/input";
import Tag from "@/components/_ui/tag";
import { SANDBOX_ADDRESS, type Campaign } from "@/data/campaigns";
import {
  EXCLUSION_TONES,
  canSubmitForReview,
  reviewChecks,
  type Audience,
  type ExclusionReason,
} from "@/lib/campaigns";
import {
  formatDateTime,
  formatNumber,
  formatPercent,
  luandaLocalToDate,
} from "@/lib/format";
import { useCampaignsStore } from "@/stores/campaigns-store";
import { cn } from "@/lib/utils";

type ReviewStepProps = {
  campaign: Campaign;
  audience: Audience;
};

export default function ReviewStep({ campaign, audience }: ReviewStepProps) {
  const submitForReview = useCampaignsStore((state) => state.submitForReview);
  const backToDraft = useCampaignsStore((state) => state.backToDraft);
  const recordTest = useCampaignsStore((state) => state.recordTest);
  const schedule = useCampaignsStore((state) => state.schedule);
  const cancelSchedule = useCampaignsStore((state) => state.cancelSchedule);
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const checks = reviewChecks(campaign, audience.eligible.length);
  const exclusions = Object.entries(audience.exclusionCounts) as [
    ExclusionReason,
    number,
  ][];

  function handleSchedule() {
    if (!scheduledAt) {
      setScheduleError("Escolha a data e a hora de envio.");
      return;
    }
    if (luandaLocalToDate(scheduledAt).getTime() <= Date.now()) {
      setScheduleError("A data de envio tem de estar no futuro.");
      return;
    }
    setScheduleError(null);
    schedule(campaign.id, scheduledAt, audience.eligible.length);
  }

  return (
    <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-6">
        <section className="border-border flex flex-col gap-4 rounded-xl border p-5">
          <h2 className="eyebrow-style text-faint font-normal">Verificação</h2>
          <ul className="flex flex-col gap-3">
            {checks.map((check) => (
              <li key={check.key} className="flex items-center justify-between gap-3">
                <span className={cn("lead-style", !check.ok && "text-soft")}>
                  {check.label}
                </span>
                <Tag tone={check.ok ? "green" : "neutral"} size="sm">
                  {check.ok ? "Feito" : "Em falta"}
                </Tag>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-border flex flex-col gap-4 rounded-xl border p-5">
          <h2 className="eyebrow-style text-faint font-normal">Destinatários</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-[26px] leading-none font-semibold tabular-nums">
              {formatNumber(
                campaign.status === "Agendada" || campaign.status === "Enviada"
                  ? campaign.recipients
                  : audience.eligible.length,
              )}
            </span>
            <span className="caption-style text-subtle">destinatários elegíveis</span>
          </div>
          {exclusions.length > 0 ? (
            <div className="flex flex-col gap-2 rounded-lg border border-(--tag-amber-border) bg-(--tag-amber-bg) px-4 py-3">
              <span className="lead-style text-(--tag-amber-text)">
                {audience.excluded.length}{" "}
                {audience.excluded.length === 1
                  ? "contacto será excluído"
                  : "contactos serão excluídos"}{" "}
                automaticamente
              </span>
              <div className="flex flex-wrap gap-1.5">
                {exclusions.map(([reason, count]) => (
                  <Tag key={reason} tone={EXCLUSION_TONES[reason]} size="sm">
                    {reason} · {count}
                  </Tag>
                ))}
              </div>
            </div>
          ) : (
            <span className="caption-style text-subtle">
              Nenhum contacto excluído neste segmento.
            </span>
          )}
        </section>
      </div>

      <section className="border-border flex min-w-0 flex-col gap-4 self-start rounded-xl border p-5">
        <h2 className="eyebrow-style text-faint font-normal">Envio</h2>

        <div className="caption-style rounded-lg border border-line-strong bg-white/3 px-4 py-3 text-soft">
          Modo sandbox: nenhum e-mail sai deste ecrã. O envio real depende do
          fornecedor de e-mail e de <span className="font-mono">MESSAGING_LIVE=true</span>{" "}
          (ver ROADMAP, Fase 4).
        </div>

        {campaign.status === "Rascunho" && (
          <div className="flex flex-col gap-3">
            <span className="caption-style text-subtle">
              Submeta para revisão quando o conteúdo e o segmento estiverem
              prontos. Em revisão, o conteúdo fica bloqueado.
            </span>
            <Button
              variant="primary"
              size="sm"
              className="self-start"
              disabled={!canSubmitForReview(checks)}
              onClick={() => submitForReview(campaign.id)}
            >
              Submeter para revisão
            </Button>
          </div>
        )}

        {campaign.status === "Em revisão" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="lead-style">1. Envio de teste</span>
              {campaign.testSentAt ? (
                <span className="caption-style text-subtle">
                  Teste registado a {formatDateTime(campaign.testSentAt)} para{" "}
                  {SANDBOX_ADDRESS} — em sandbox, nada foi entregue.
                </span>
              ) : (
                <span className="caption-style text-subtle">
                  Obrigatório antes de agendar. Fica registado em sandbox para{" "}
                  {SANDBOX_ADDRESS}.
                </span>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="self-start"
                onClick={() => recordTest(campaign.id)}
              >
                {campaign.testSentAt ? "Repetir teste" : "Registar envio de teste"}
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <span className="lead-style">2. Agendamento</span>
              <Field
                label="Data e hora (Luanda)"
                htmlFor="campaign-schedule"
                error={scheduleError ?? undefined}
              >
                <Input
                  id="campaign-schedule"
                  type="datetime-local"
                  value={scheduledAt}
                  disabled={!campaign.testSentAt}
                  onChange={(event) => {
                    setScheduledAt(event.target.value);
                    if (scheduleError) setScheduleError(null);
                  }}
                  className="tabular-nums"
                />
              </Field>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!campaign.testSentAt || audience.eligible.length === 0}
                  onClick={handleSchedule}
                >
                  Agendar campanha
                </Button>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => backToDraft(campaign.id)}
                >
                  Voltar a rascunho
                </Button>
              </div>
            </div>
          </div>
        )}

        {campaign.status === "Agendada" && campaign.scheduledAt && (
          <div className="flex flex-col gap-3">
            <span className="lead-style">
              Agendada para {formatDateTime(campaign.scheduledAt)}
            </span>
            <span className="caption-style text-subtle">
              {formatNumber(campaign.recipients)} destinatários fixados no
              momento do agendamento.
            </span>
            <Button
              variant="secondary"
              size="sm"
              className="self-start"
              onClick={() => cancelSchedule(campaign.id)}
            >
              Cancelar agendamento
            </Button>
          </div>
        )}

        {campaign.status === "Enviada" && (
          <div className="flex flex-col gap-2">
            <span className="lead-style">
              Enviada a {formatNumber(campaign.recipients)} destinatários
            </span>
            {campaign.openRate !== undefined && (
              <span className="caption-style text-subtle">
                Taxa de abertura: {formatPercent(campaign.openRate)}. Métricas
                detalhadas chegam com a medição de campanhas.
              </span>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
