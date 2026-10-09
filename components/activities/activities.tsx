import ModuleHeader from "@/components/_common/module-header";
import { ScrollArea } from "@/components/_ui/scroll-area";
import Tag from "@/components/_ui/tag";
import { ACTIVITIES, ACTIVITY_TONES } from "@/data/activities";
import { formatDateLong } from "@/lib/format";

export default function Activities() {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <ModuleHeader title="Atividades" count={ACTIVITIES.length} />
      <ScrollArea className="min-h-0 flex-1">
        <ul className="divide-y divide-border">
          {ACTIVITIES.map((activity) => (
            <li key={activity.id} className="flex flex-col gap-2 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Tag tone={ACTIVITY_TONES[activity.type]}>
                    {activity.type}
                  </Tag>
                  <span className="lead-style font-medium">
                    {activity.companyName}
                  </span>
                </div>
                <span className="caption-style text-subtle">
                  {formatDateLong(activity.date)}
                </span>
              </div>
              <p className="p-style text-soft">{activity.note}</p>
              <span className="caption-style text-subtle">
                {activity.owner}
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </section>
  );
}
