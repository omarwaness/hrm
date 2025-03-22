import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Users, 
  Briefcase, 
  Calendar,
  GraduationCap,
  Clock,
  Bell,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"

function Dashboard() {

  // Mock data for company announcements
  const announcements = [
    {
      title: "Company Meeting",
      description: "Annual company meeting next Friday at 10 AM",
      date: "Mar 15, 2024",
      priority: "high"
    },
    {
      title: "New Health Benefits",
      description: "Updated health insurance coverage starting next month",
      date: "Apr 1, 2024",
      priority: "medium"
    },
    {
      title: "Office Maintenance",
      description: "Building maintenance scheduled for this weekend",
      date: "Mar 16, 2024",
      priority: "low"
    }
  ]

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      title: "Team Building Event",
      date: "Mar 20, 2024",
      type: "Company Event"
    },
    {
      title: "Training Session",
      date: "Mar 22, 2024",
      type: "Professional Development"
    },
    {
      title: "Holiday",
      date: "Mar 25, 2024",
      type: "Public Holiday"
    }
  ]

  return (
    <div className="flex flex-1">
      <div className="flex flex-1 flex-col gap-6 p-6">
              {/* Dashboard Header */}
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Company Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome to the HRM portal. Here's what's happening in the company.
                </p>
              </div>

              {/* Company Overview Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">Core business units</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">245</div>
                    <p className="text-xs text-muted-foreground">Across all departments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">Active job listings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Training Programs</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">Active courses</p>
                  </CardContent>
                </Card>
              </div>

              {/* Important Announcements */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Announcements</CardTitle>
                  <CardDescription>
                    Important updates and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.map((announcement, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <Bell className="mt-0.5 h-5 w-5 text-muted-foreground" />
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{announcement.title}</p>
                            <Badge variant={
                              announcement.priority === "high" ? "destructive" : 
                              announcement.priority === "medium" ? "default" : 
                              "secondary"
                            }>
                              {announcement.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{announcement.description}</p>
                          <p className="text-xs text-muted-foreground">{announcement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events and Quick Links */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>
                      Schedule for the next few weeks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingEvents.map((event, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.date}</p>
                            <Badge variant="outline">{event.type}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                    <CardDescription>
                      Frequently accessed resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Employee Handbook
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        Leave Management
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Clock className="mr-2 h-4 w-4" />
                        Time Tracking
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        Directory
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
    </div>
  )
}

export default Dashboard
