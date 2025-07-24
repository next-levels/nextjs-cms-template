"use client";

import { MoreHorizontal, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useMemo } from "react";
import { useAuth } from "~/context/auth";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import type { Role } from "~/types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
  canAccess?: Role[];
};

type NavMainProps = {
  items: NavItem[];
};

export function NavMain({ items }: NavMainProps) {
  const { user } = useAuth();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <NavItem
            key={item.title}
            item={item}
            canAccess={item.canAccess}
            userRole={user?.role}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

type NavItemProps = {
  item: NavItem;
  canAccess?: Role[];
  userRole?: Role;
};

function NavItem({ item, canAccess, userRole }: NavItemProps) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  const isActive = useMemo(() => {
    if (item.url === "/admin") {
      return pathname === item.url;
    }

    if (item.items) {
      return item.items.some((subItem) => pathname.includes(subItem.url));
    }

    return pathname.includes(item.url);
  }, [pathname, item.url, item.items]);

  if (canAccess && (!userRole || !canAccess?.includes(userRole))) {
    return null;
  }

  if (item.items?.length) {
    return (
      <DropdownMenu key={item.title}>
        <SidebarMenuItem>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              isActive={isActive}
              tooltip={item.title}
            >
              {item.icon && <item.icon />}
              {item.title} <MoreHorizontal className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "end" : "start"}
            className="min-w-56 rounded-lg"
          >
            {item.items.map((subItem) => (
              <DropdownMenuItem
                asChild
                key={subItem.title}
                isActive={pathname === subItem.url}
              >
                <Link href={subItem.url}>{subItem.title}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </SidebarMenuItem>
      </DropdownMenu>
    );
  }

  return (
    <SidebarMenuItem key={item.title}>
      <Link href={item.url}>
        <SidebarMenuButton tooltip={item.title} isActive={isActive}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
}
