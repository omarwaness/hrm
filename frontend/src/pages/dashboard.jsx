import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { EmployeeSidebar } from "@/components/employee-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Users, BriefcaseBusiness, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react"

export default function Dashboard() {
  // Mock data for employees
  const employees = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Senior Developer",
      department: "Engineering",
      avatar: "/avatars/alex.jpg",
      status: "active",
      tasks: { completed: 12, total: 15 },
      hours: 37.5,
      projects: ["Website Redesign", "Mobile App"]
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "UX Designer",
      department: "Design",
      avatar: "/avatars/sarah.jpg",
      status: "active",
      tasks: { completed: 8, total: 10 },
      hours: 35,
      projects: ["Website Redesign", "Brand Guidelines"]
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Product Manager",
      department: "Product",
      avatar: "/avatars/michael.jpg",
      status: "away",
      tasks: { completed: 5, total: 8 },
      hours: 32,
      projects: ["Q3 Roadmap", "Feature Planning"]
    },
    {
      id: 4,
      name: "Emily Davis",
      role: "Marketing Specialist",
      department: "Marketing",
      avatar: "/avatars/emily.jpg",
      status: "active",
      tasks: { completed: 7, total: 9 },
      hours: 38,
      projects: ["Social Media Campaign", "Email Newsletter"]
    }
  ]

  // Mock data for department stats
  const departmentStats = [
    { name: "Engineering", headcount: 12, productivity: 92, projects: 5 },
    { name: "Design", headcount: 8, productivity: 88, projects: 3 },
    { name: "Product", headcount: 5, productivity: 85, projects: 4 },
    { name: "Marketing", headcount: 7, productivity: 90, projects: 6 }
  ]

  // Mock data for recent activities
  const recentActivities = [
    { user: "Alex Johnson", action: "completed task", item: "Fix navigation bug", time: "2 hours ago" },
    { user: "Sarah Williams", action: "uploaded", item: "New design mockups", time: "3 hours ago" },
    { user: "Michael Chen", action: "commented on", item: "Q3 Roadmap", time: "5 hours ago" },
    { user: "Emily Davis", action: "published", item: "Social media post", time: "Yesterday" }
  ]

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <EmployeeSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-6 p-6">
              {/* Dashboard Header */}
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's an overview of your team's performance.
                </p>
              </div>

              {/* Stats Overview */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">32</div>
                    <p className="text-xs text-muted-foreground">+2 since last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18</div>
                    <p className="text-xs text-muted-foreground">4 due this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Productivity</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">89%</div>
                    <p className="text-xs text-muted-foreground">+5% from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,248</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Team Members */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Monitor your team's status and productivity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employees.map(employee => (
                      <div key={employee.id} className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="hidden md:block">
                            <p className="text-sm font-medium leading-none">{employee.department}</p>
                            <div className="mt-1 flex items-center">
                              <Progress value={(employee.tasks.completed / employee.tasks.total) * 100} className="h-2 w-24" />
                              <span className="ml-2 text-xs text-muted-foreground">
                                {employee.tasks.completed}/{employee.tasks.total} tasks
                              </span>
                            </div>
                          </div>
                          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                            {employee.status === 'active' ? (
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                            ) : (
                              <AlertCircle className="mr-1 h-3 w-3" />
                            )}
                            {employee.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Department Performance and Recent Activity */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Department Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Department Performance</CardTitle>
                    <CardDescription>
                      Overview of department metrics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentStats.map((dept, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">{dept.name}</p>
                            <p className="text-sm font-medium">{dept.productivity}%</p>
                          </div>
                          <Progress value={dept.productivity} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{dept.headcount} employees</span>
                            <span>{dept.projects} projects</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest actions from your team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <CalendarDays className="mt-0.5 h-5 w-5 text-muted-foreground" />
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">{activity.user}</span>
                              {' '}{activity.action}{' '}
                              <span className="font-medium">{activity.item}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
} 