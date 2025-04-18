import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  ChevronDown,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import Loading  from "../Loading"; // Assuming you have a Loading component

const LeaveRequestList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const leave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/leave/');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log(data);
      setLeaveRequests(data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      // Potentially set an error state here to display an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    leave();
  }, []);

  const openRequestDetail = (request) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleApprove = async (id) => {
    try {
      // Replace with your actual API endpoint and request details
      const response = await fetch(`http://localhost:5000/api/leave/${id}/approve`, {
        method: "PUT",  // Or PATCH, depending on your API
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ /* Your request body if needed */ }),
      });
      if (!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setLeaveRequests(requests =>
        requests.map(req =>
          req._id === id ? { ...req, status: 'approved' } : req
        )
      );
        leave()
      // In a real app, you would make an API call here
      setIsDetailOpen(false);
    } catch (e){
      console.log(e)
    }

  };

  const handleDeny = async (id) => {
    try {
      // Replace with your actual API endpoint and request details
      const response = await fetch(`http://localhost:5000/api/leave/${id}/deny`, {
        method: "PUT",  // Or PATCH, depending on your API
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ /* Your request body if needed */ }),
      });
      if (!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      setLeaveRequests(requests =>
        requests.map(req =>
          req._id === id ? { ...req, status: 'denied' } : req
        )
      );
      leave()

      setIsDetailOpen(false);
      // In a real app, you would make an API call here

    } catch (e){
      console.log(e)
    }

  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'denied':
        return <Badge className="bg-red-100 text-red-800">Denied</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container max-w-6xl mx-auto py-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Employee Leave Requests</CardTitle>
          <CardDescription className="text-base text-slate-600 dark:text-slate-200">
            Review and manage leave requests from your team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leaveRequests.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-6">No leave requests to display</p>
          ) : (
            <div className="space-y-3">
              {leaveRequests.map((request) => (
                <Card key={request._id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div
                      className="p-4 hover:bg-muted/50 cursor-pointer"
                      onClick={() => openRequestDetail(request)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{request.employeeName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{request.employeeId}</p>
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <span className="text-sm text-slate-900 dark:text-white">
                            {formatDate(request.fromDate)} - {formatDate(request.toDate)}
                          </span>
                        </div>
                        <div className="text-sm text-slate-900 dark:text-white">
                          <span className="font-medium">{request.totalDays} days</span>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Requested on {formatDate(request.requestDate)}
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
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
              <SheetTitle className="text-xl font-bold text-slate-900 dark:text-white">Leave Request Details</SheetTitle>
              <SheetDescription className="text-base text-slate-600 dark:text-slate-200">
                Review the complete request information
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Employee</h3>
                <p className="text-base text-slate-900 dark:text-white">{selectedRequest.employeeName} ({selectedRequest.employeeId})</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">From Date</h3>
                  <p className="text-base text-slate-900 dark:text-white">{formatDate(selectedRequest.fromDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">To Date</h3>
                  <p className="text-base text-slate-900 dark:text-white">{formatDate(selectedRequest.toDate)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Days</h3>
                <p className="text-base text-slate-900 dark:text-white">{selectedRequest.totalDays} days</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Status</h3>
                <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Reason</h3>
                <p className="text-base mt-1 leading-relaxed whitespace-pre-line text-slate-900 dark:text-white">{selectedRequest.reason}</p>
              </div>
            </div>

            <SheetFooter className="sm:justify-between mt-4 px-2">
              {selectedRequest.status === 'pending' && (
                <>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeny(selectedRequest._id)}
                    className="gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    Deny
                  </Button>
                  <Button 
                    onClick={() => handleApprove(selectedRequest._id)}
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
  );
};

export default LeaveRequestList;
