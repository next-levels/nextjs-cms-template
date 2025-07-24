"use client";

import { redirect } from "next/navigation";

import { useAuth } from "@mikestraczek/cms-auth";
import AppSidebar, {
  Icons,
  ModeToggle,
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@mikestraczek/cms-ui";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Icons.spinner className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center justify-between gap-2 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />

              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
            </div>

            <ModeToggle />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
