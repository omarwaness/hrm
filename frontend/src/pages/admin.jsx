import * as React from "react";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Account from "@/components/Account";
import Dashboard from "@/components/dashboard";
import Inbox from "@/components/inbox";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import Footer from "@/components/Footer";
import EmployeeList from "@/components/manager/employeeList";
import AddEmployee from "@/components/manager/addEmployee";
import UpdateEmployee from "@/components/manager/updateEmployee";
import GenerateReport from "@/components/manager/generateReport";
import SavedReports from "@/components/manager/savedReports";
// Importing the components for each section

export default function Admin() {
  const [activeComponent, setActiveComponent] = React.useState("Dashboard");

  // Function to render the active component
  const renderComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <Dashboard/>;
      case "Account":
        return <Account/>;
      case "Inbox":
        return <Inbox/>;
      case "ViewEmpolyees":
        return <EmployeeList/>;
      case "AddEmpolyee":
        return <AddEmployee/>;
      case "UpdateEmpolyee":
        return <UpdateEmployee/>;
      case "Generate":
        return <GenerateReport/>;
      case "Saved":
        return <SavedReports/>;
  };
}

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader setActiveComponent={setActiveComponent} />
        <div className="flex flex-1">
            <AdminSidebar setActiveComponent={setActiveComponent} />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              {renderComponent()}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Footer />
    </div>
  );
}
