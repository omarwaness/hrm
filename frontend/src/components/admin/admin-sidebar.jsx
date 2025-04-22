import * as React from "react"
import { Folder, UserPen, UserPlus, Settings, Users, Save } from "lucide-react"
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
        <div className="text-m font-semibold text-secondary-foreground mb-1 px-2 uppercase">
          Managers
        </div>
        <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("ViewEmpolyees")}>  
          <Users className="mr-2 h-5 w-5" />
          View
        </Button>
        <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("AddEmpolyee")}>  
          <UserPlus className="mr-2 h-5 w-5" />
          Add
        </Button>
        <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("UpdateEmpolyee")}>  
          <UserPen className="mr-2 h-5 w-5" />
          Update
        </Button>

        <div className="text-m font-semibold text-secondary-foreground mb-1 px-2 uppercase">
          Reports
        </div>
        <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("Generate")}>  
          <Folder className="mr-2 h-5 w-5" />
          Generate
        </Button>
        <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("Saved")}>  
          <Save className="mr-2 h-5 w-5" />
          Saved
        </Button>

      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  );
}

