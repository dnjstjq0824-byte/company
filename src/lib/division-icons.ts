import {
  Boxes,
  Cloud,
  Cpu,
  Globe,
  Layers,
  Leaf,
  Network,
  Server,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const DIVISION_ICON_MAP: Record<string, LucideIcon> = {
  Boxes,
  Cloud,
  Cpu,
  Globe,
  Layers,
  Leaf,
  Network,
  Server,
  ShieldCheck,
  Sparkles,
};

export function getDivisionIcon(iconName: string): LucideIcon {
  return DIVISION_ICON_MAP[iconName] || Layers;
}
