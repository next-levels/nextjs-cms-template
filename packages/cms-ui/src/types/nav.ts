import { LucideIcon } from "lucide-react";
import { Role } from "@mikestraczek/cms-auth";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
  canAccess?: Role[];
};

export { type NavItem };
