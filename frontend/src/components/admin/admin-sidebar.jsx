import * as React from "react"
import { FileText, Calendar, LogOut, Settings, Inbox } from "lucide-react"
import { Button } from "../ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"

export function AdminSidebar({ setActiveComponent, ...props }) {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent className="p-4 flex flex-col gap-2">
        <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("Inbox")}>  
          <Inbox className="mr-2 h-5 w-5" />
          Admin
        </Button>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="outline" className="justify-start w-full">
          <Settings className="mr-2 h-5 w-5" />
          Settings
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

