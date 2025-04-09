import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { EmployeeSidebar } from "@/components/employee-sidebar"
import { InboxComponent } from "@/components/inbox/inbox-component"

export default function Inbox() {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <EmployeeSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-6 p-6">
              {/* Inbox Header */}
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
                <p className="text-muted-foreground">
                  Manage your messages, notifications, and requests
                </p>
              </div>
              <InboxComponent />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
} 