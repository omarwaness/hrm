import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ChevronDown,
  User 
} from "lucide-react"
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"

function LeaveList() {
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  
  // Mock data for leave requests - replace with API call in production
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employeeName: "John Doe",
      employeeId: "EMP001",
      fromDate: "2024-05-15",
      toDate: "2024-05-18",
      totalDays: 4,
      reason: "I need to take a few days off for a family event. My cousin is getting married in another city, and I'll need to travel there. I'll be available on email for urgent matters, but would appreciate the time away to attend this important family gathering.",
      status: "pending",
      requestDate: "2024-05-01"
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      employeeId: "EMP002",
      fromDate: "2024-05-20",
      toDate: "2024-05-21",
      totalDays: 2,
      reason: "I have a medical appointment that requires me to take two days off. I've been experiencing some health issues lately and need to get them checked out properly. This was the earliest appointment I could get with the specialist.",
      status: "pending",
      requestDate: "2024-05-03"
    },
    {
      id: 3,
      employeeName: "Robert Johnson",
      employeeId: "EMP003",
      fromDate: "2024-05-25",
      toDate: "2024-06-01",
      totalDays: 8,
      reason: "I'm requesting leave for a vacation that I planned several months ago. I need some time to relax and recharge after the intense project work we've been doing. I've ensured all my current tasks will be completed before I leave, and I've documented my ongoing work for the team.",
      status: "pending",
      requestDate: "2024-04-28"
    }
  ])

  // Open the detail sheet when a request is clicked
  const openRequestDetail = (request) => {
    setSelectedRequest(request)
    setIsDetailOpen(true)
  }

  // Handle approval of a leave request
  const handleApprove = (id) => {
    setLeaveRequests(requests => 
      requests.map(req => 
        req.id === id ? {...req, status: 'approved'} : req
      )
    )
    // In a real app, you would make an API call here
    setIsDetailOpen(false)
  }

  // Handle denial of a leave request
  const handleDeny = (id) => {
    setLeaveRequests(requests => 
      requests.map(req => 
        req.id === id ? {...req, status: 'denied'} : req
      )
    )
    // In a real app, you would make an API call here
    setIsDetailOpen(false)
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'denied':
        return <Badge className="bg-red-100 text-red-800">Denied</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  return (
    <div className="container max-w-6xl mx-auto py-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Employee Leave Requests</CardTitle>
          <CardDescription>
            Review and manage leave requests from your team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leaveRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No leave requests to display</p>
          ) : (
            <div className="space-y-3">
              {leaveRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div 
                      className="p-4 hover:bg-muted/50 cursor-pointer"
                      onClick={() => openRequestDetail(request)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{request.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{request.employeeId}</p>
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDate(request.fromDate)} - {formatDate(request.toDate)}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{request.totalDays} days</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Requested on {formatDate(request.requestDate)}
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground truncate">
                          {request.reason}
                          <Button variant="ghost" size="sm" className="ml-1 h-6 px-1">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Sheet for Leave Request */}
      {selectedRequest && (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="sm:max-w-md w-full">
            <SheetHeader className="px-4">
              <SheetTitle>Leave Request Details</SheetTitle>
              <SheetDescription>
                Review the complete request information
              </SheetDescription>
            </SheetHeader>
            
            <div className=" space-y-5 px-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Employee</h3>
                <p className="text-base">{selectedRequest.employeeName} ({selectedRequest.employeeId})</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">From Date</h3>
                  <p className="text-base">{formatDate(selectedRequest.fromDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">To Date</h3>
                  <p className="text-base">{formatDate(selectedRequest.toDate)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Days</h3>
                <p className="text-base">{selectedRequest.totalDays} days</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Reason</h3>
                <p className="text-base mt-1 leading-relaxed whitespace-pre-line">{selectedRequest.reason}</p>
              </div>
            </div>
            
            <SheetFooter className="sm:justify-between mt-4 px-2">
              {selectedRequest.status === 'pending' && (
                <>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeny(selectedRequest.id)}
                    className="gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    Deny
                  </Button>
                  <Button 
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </Button>
                </>
              )}
              {selectedRequest.status !== 'pending' && (
                <SheetClose asChild>
                  <Button variant="outline" className="w-full">Close</Button>
                </SheetClose>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

export default LeaveList
