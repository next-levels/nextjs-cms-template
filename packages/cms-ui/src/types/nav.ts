import { type LucideIcon } from "lucide-react";
import { type Role } from "@mikestraczek/cms-auth";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
  canAccess?: Role[];
};
