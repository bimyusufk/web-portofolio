import { Brain, Cloud, Code2, Database, Layers, Terminal, Users, type LucideIcon } from "lucide-react";

import { Card, CardBody } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Tag } from "@/components/ui/chip";
import type { SkillGroupData } from "@/lib/types";

const icons: Record<string, LucideIcon> = {
  code: Code2,
  layers: Layers,
  database: Database,
  brain: Brain,
  users: Users,
  terminal: Terminal,
  cloud: Cloud,
};

/** Kartu kelompok keahlian, mengikuti pola kartu produk cloud.google.com. */
export function SkillGrid({ groups }: { groups: SkillGroupData[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => {
        const Icon = icons[group.icon ?? "code"] ?? Code2;

        return (
          <Card key={group._id}>
            <CardBody className="p-5">
              <div className="flex items-center gap-3">
                <IconTile icon={Icon} size="sm" />
                <h3 className="text-subtitle text-ink">{group.category}</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
