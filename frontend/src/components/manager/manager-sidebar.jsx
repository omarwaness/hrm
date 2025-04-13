import * as React from "react"
import { Settings, Inbox, Users, UserPlus, UserPen, TreePalm, Files, FilePlus, FileUser, FileSearch2, Folder, Save, Send } from "lucide-react"
import { Button } from "../ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar"

export function ManagerSidebar({ setActiveComponent, ...props }) {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent className="p-4 flex flex-col gap-2">
        <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("Message")}>  
          <Send className="mr-2 h-5 w-5" />
          Message
        </Button>

        <div className="text-m font-semibold text-secondary-foreground mb-1 px-2 uppercase">
          Employees
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
        <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("Leave")}>  
          <TreePalm className="mr-2 h-5 w-5" />
          Leave
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

        <div className="text-m font-semibold text-secondary-foreground mb-1 px-2 uppercase">
          Job Offers
        </div>
        <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("View")}>  
          <Files className="mr-2 h-5 w-5" />
          View
        </Button>
        <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("Add")}>  
          <FilePlus className="mr-2 h-5 w-5" />
          Add
        </Button>
        <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("Update")}>  
          <FileSearch2 className="mr-2 h-5 w-5" />
          Update
        </Button>
        <Button variant="ghost" className="justify-start" onClick={() => setActiveComponent("Application")}>  
          <FileUser className="mr-2 h-5 w-5" />
          Applications
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
