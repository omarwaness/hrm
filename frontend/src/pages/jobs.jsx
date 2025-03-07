import JobBoard from "@/components/job-board"
import { JobsHeader } from "@/components/jobs-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Jobs() {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <JobsHeader />
        <div className="flex flex-1">
          <SidebarInset>
            <JobBoard></JobBoard>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
