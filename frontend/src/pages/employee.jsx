import * as React from "react";
import { EmployeeSidebar } from "@/components/employee/employee-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Contract from "@/components/employee/contract";
import LeaveRequest from "@/components/employee/leave-request";
import Resignation from "@/components/employee/resignation";
import Account from "@/components/Account";
import Dashboard from "@/components/dashboard";
import Inbox from "@/components/inbox";
import Footer from "@/components/Footer";
// Importing the components for each section

export default function Employee() {
  const [activeComponent, setActiveComponent] = React.useState("Dashboard");
  
  // Function to render the active component
  const renderComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <Dashboard/>;
      case "Inbox":
        return <Inbox/>;
      case "Contract":
        return <Contract />;
      case "LeaveRequest":
        return <LeaveRequest />;
      case "ResignationForm":
        return <Resignation />;
      case "Account":
        return <Account/>;
      default:
        return <Dashboard/>;
    }
  };

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader setActiveComponent={setActiveComponent} />
        <div className="flex flex-1">
          <EmployeeSidebar setActiveComponent={setActiveComponent} />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              {renderComponent()}
            </div>
          </SidebarInset>
        </div>
        <Footer />

        
      </SidebarProvider>
      
    </div>
  );
}
