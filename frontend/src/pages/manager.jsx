import * as React from "react";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Contract from "@/components/employee/contract";
import LeaveRequest from "@/components/employee/leave-request";
import Resignation from "@/components/employee/resignation";
import Account from "@/components/Account";
import Dashboard from "@/components/dashboard";
import Inbox from "@/components/inbox";
import { ManagerSidebar } from "@/components/manager/manager-sidebar";
import EmployeeList from "@/components/manager/employeeList";
import AddEmployee from "@/components/manager/addEmployee";
import UpdateEmployee from "@/components/manager/updateEmployee";
import LeaveList from "@/components/manager/leaveList";
import GenerateReport from "@/components/manager/generateReport";
import SavedReports from "@/components/manager/savedReports";
import JobList from "@/components/manager/jobList";
import AddJob from "@/components/manager/addJob";
import UpdateJob from "@/components/manager/updateJob";
import JobApplications from "@/components/manager/jobApplications";

// Importing the components for each section

export default function Manager() {
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
      case "Leave":
        return <LeaveList/>;
      case "Generate":
        return <GenerateReport/>;
      case "Saved":
        return <SavedReports/>;
      case "View":
        return <JobList/>;
      case "Add":
        return <AddJob/>;
      case "Update":
        return <UpdateJob/>;
      case "Application":
        return <JobApplications/>;
      default:
        return <Dashboard/>;
    }
  };

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader setActiveComponent={setActiveComponent} />
        <div className="flex flex-1">
            <ManagerSidebar setActiveComponent={setActiveComponent} />
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
