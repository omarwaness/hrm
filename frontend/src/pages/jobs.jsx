import * as React from "react";
import JobBoard from "@/components/jobs/job-board"
import { JobsHeader } from "@/components/jobs/jobs-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import Footer from "@/components/Footer"
import {jwtDecode} from 'jwt-decode'
import {useNavigate} from'react-router-dom';


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
      <Footer />
    </div>
  )
}
