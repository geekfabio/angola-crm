"use client";

import Button from "@/components/_ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/_ui/dialog";
import { ScrollArea } from "@/components/_ui/scroll-area";
import {
  BLANK_TEMPLATE,
  TEMPLATES,
  type CampaignTemplate,
} from "@/data/campaigns";
import { useCampaignsStore } from "@/stores/campaigns-store";
import { cn } from "@/lib/utils";

function TemplateThumb({ template }: { template: CampaignTemplate }) {
  const banner = template.blocks.find((block) => block.type === "banner");
  const heading = template.blocks.find((block) => block.type === "heading");
  const hasButton = template.blocks.some((block) => block.type === "button");

  return (
    <div aria-hidden className="bg-brand-paper flex h-[132px] flex-col overflow-hidden rounded-md">
      <div className="bg-brand h-1" />
      <div className="flex flex-1 flex-col gap-2 p-3">
        {banner && banner.type === "banner" && (
          <div
            className={cn(
              "truncate rounded px-2 py-2 text-center text-[10px] leading-none font-bold",
              banner.tone === "brand"
                ? "bg-brand text-brand-paper"
                : "bg-brand-accent text-brand-ink",
            )}
          >
            {banner.title}
          </div>
        )}
        {heading && heading.type === "heading" && (
          <div className="text-brand-ink truncate text-[10px] leading-none font-semibold">
            {heading.text.replace(/\{\{\s*\w+\s*\}\}/g, "…")}
          </div>
        )}
        <div className="bg-brand-ink/10 h-1.5 w-full rounded-full" />
        <div className="bg-brand-ink/10 h-1.5 w-4/5 rounded-full" />
        <div className="bg-brand-ink/10 h-1.5 w-3/5 rounded-full" />
        {hasButton && <div className="bg-brand mx-auto mt-auto h-3 w-14 rounded-sm" />}
      </div>
    </div>
  );
}

export default function TemplateLibraryDialog() {
  const open = useCampaignsStore((state) => state.libraryOpen);
  const setOpen = useCampaignsStore((state) => state.setLibraryOpen);
  const createFromTemplate = useCampaignsStore((state) => state.createFromTemplate);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[880px]">
        <DialogHeader>
          <DialogTitle>Biblioteca de modelos</DialogTitle>
          <DialogDescription>
            Modelos de e-mail com a marca Alimenta Angola. Escolha um para abrir
            no editor como rascunho.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70dvh]">
          <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...TEMPLATES, BLANK_TEMPLATE].map((template) => (
              <div
                key={template.id}
                className="border-border flex flex-col gap-3 rounded-xl border p-3"
              >
                <TemplateThumb template={template} />
                <div className="flex flex-col gap-1">
                  <span className="lead-style font-medium">{template.name}</span>
                  <span className="caption-style text-subtle">
                    {template.description}
                  </span>
                </div>
                <Button
                  variant={template.id === BLANK_TEMPLATE.id ? "secondary" : "primary"}
                  size="sm"
                  className="mt-auto self-start"
                  onClick={() => createFromTemplate(template.id)}
                >
                  Usar modelo
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
