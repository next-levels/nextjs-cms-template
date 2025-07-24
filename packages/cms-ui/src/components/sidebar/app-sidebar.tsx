import Image from "next/image";
import Link from "next/link";
import { Roles, useAuth } from "@mikestraczek/cms-auth";
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
import { GlowingEffect } from "../ui/glowing-effect";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

function AppSidebar() {
  const { user } = useAuth();

  const adminLinks = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Icons.dashboard,
    },
    {
      title: "Bestellungen",
      url: "/admin/orders",
      icon: Icons.receipt,
      canAccess: [Roles.SUPERADMIN, Roles.ADMIN],
    },
    {
      title: "Benutzer",
      url: "/admin/users",
      icon: Icons.users,
      canAccess: [Roles.SUPERADMIN],
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />

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
                    src={"/images/logo.svg"}
                    alt="logo"
                    width={50}
                    height={50}
                    className="h-6 w-6 shrink-0 rounded object-cover"
                  />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Greenchild</span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarContent>
          <NavMain items={adminLinks} />
        </SidebarContent>
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

export default AppSidebar;
