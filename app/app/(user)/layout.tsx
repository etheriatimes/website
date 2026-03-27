import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { UserSidebar } from "@/components/user/user-sidebar"
import { UserHeader } from "@/components/user/user-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset>
        <UserHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
