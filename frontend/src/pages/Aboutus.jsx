import * as React from "react";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AboutUsComponent from "@/components/AboutUsComponent";
function AboutUs(){
    return(
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader  />
        <div className="flex flex-1">
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <AboutUsComponent/>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
    )
}
export default AboutUs;