import * as React from "react";
import { EmployeeSidebar } from "@/components/employee-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Contract from "@/components/contract";
import LeaveRequest from "@/components/leave-request";
import Resignation from "@/components/resignation";

// Importing the components for each section

export default function Employee() {
  const [activeComponent, setActiveComponent] = React.useState("Contract");

  // Function to render the active component
  const renderComponent = () => {
    switch (activeComponent) {
      case "Contract":
        return <Contract/>;
      case "LeaveRequest":
        return <LeaveRequest/>;
      case "ResignationForm":
        return <Resignation/>;
      default:
        return <Contract/>;
    }
  };

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <EmployeeSidebar setActiveComponent={setActiveComponent} />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              {renderComponent()}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
