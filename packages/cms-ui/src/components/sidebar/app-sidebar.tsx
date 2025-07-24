import { Roles, useAuth } from "@mikestraczek/cms-auth";
import Image from "next/image";
import Link from "next/link";
import { type NavItem } from "../../types/nav";
import { Icons } from "../icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

type AppSidebarProps = {
  logo?: string;
  title?: string;
  adminLinks?: NavItem[];
};

function AppSidebar({ logo, title, adminLinks }: AppSidebarProps) {
  const { user } = useAuth();

  const defaultLinks = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Icons.dashboard,
    },
    ...(adminLinks ?? []),
    {
      title: "Benutzer",
      url: "/admin/users",
      icon: Icons.users,
      canAccess: [Roles.SUPERADMIN],
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/admin">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              >
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src={logo ?? "/images/logo.svg"}
                    alt="logo"
                    width={50}
                    height={50}
                    className="h-6 w-6 shrink-0 rounded object-cover"
                  />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{title ?? "CMS"}</span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {adminLinks && (
          <SidebarContent>
            <NavMain items={defaultLinks} />
          </SidebarContent>
        )}
      </SidebarContent>

      {user && (
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}

AppSidebar.displayName = "AppSidebar";

export { AppSidebar };
