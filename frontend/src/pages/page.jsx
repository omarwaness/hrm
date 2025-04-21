import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import Footer from "@/components/Footer"
import AppWrapper from "@/components/AppWrapper"

export default function Page() {
  return (
    <AppWrapper>
      <div className="[--header-height:calc(theme(spacing.14))] min-h-screen flex flex-col">
        <SidebarProvider>
          <div className="flex flex-1">
            <AppSidebar />
            <main className="flex-1">
              <SiteHeader />
              <div className="flex flex-col">
                <SidebarInset>
                  <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                      <div className="aspect-video rounded-xl bg-muted/50" />
                      <div className="aspect-video rounded-xl bg-muted/50" />
                      <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50" />
                  </div>
                </SidebarInset>
              </div>
            </main>
          </div>
        </SidebarProvider>
        <Footer />
      </div>
    </AppWrapper>
  )
}