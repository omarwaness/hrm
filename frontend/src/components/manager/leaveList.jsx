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
import Loading from "../Loading";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const LeaveRequestList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [socket, setSocket] = useState(null);

  // Socket.io connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus({ type: "error", message: "User not authenticated" });
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      setStatus({ type: "error", message: "Invalid token" });
      return;
    }

    const userEmail = decoded.email;
    const socketIo = io("http://localhost:5001", {
      query: { email: userEmail },
      transports: ["websocket", "polling"],
    });

    socketIo.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socketIo.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err);
      setStatus({ type: "error", message: "Real-time connection error" });
    });

    setSocket(socketIo);

    return () => socketIo.disconnect();
  }, []);

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/leave/');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setLeaveRequests(data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const openRequestDetail = (request) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/leave/${id}/approved`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      // Update UI and refetch
      setLeaveRequests(requests =>
        requests.map(req =>
          req._id === id ? { ...req, status: 'approved' } : req
        )
      );
      await fetchLeaveRequests();

      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const sender = decoded.email;
      const receiver = selectedRequest.sender;
      const content = "Your leave request has been approved";

      await fetch("http://localhost:5000/api/message/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ sender, receiver, content }),
      });

      if (socket) {
        socket.emit("newMessage", { sender, receiver, content });
      }

      setIsDetailOpen(false);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleDeny = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/leave/${id}/deny`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      setLeaveRequests(requests =>
        requests.map(req =>
          req._id === id ? { ...req, status: 'denied' } : req
        )
      );
      await fetchLeaveRequests();
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const sender = decoded.email;
      const receiver = selectedRequest.sender;
      const content = "Your leave request has been denided";

      await fetch("http://localhost:5000/api/message/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ sender, receiver, content }),
      });

      if (socket) {
        socket.emit("newMessage", { sender, receiver, content });
      }
      setIsDetailOpen(false);


    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: err.message });
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

  let totalDays = 0;
  if (selectedRequest) {
    totalDays = Math.round(
      Math.abs(
        (new Date(selectedRequest.toDate) - 
         new Date(selectedRequest.fromDate)
        ) / (1000 * 60 * 60 * 24)
      )
    );
  }

  if (isLoading) return <Loading />;

  return (
    <div className="container max-w-6xl mx-auto py-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Employee Leave Requests
          </CardTitle>
          <CardDescription className="text-base text-slate-600 dark:text-slate-200">
            Review and manage leave requests from your team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leaveRequests.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-6">
              No leave requests to display
            </p>
          ) : (
            <div className="space-y-3">
              {leaveRequests.map((request) => {
                const requestDays = Math.round(
                  (new Date(request.toDate) - new Date(request.fromDate)) / (1000 * 60 * 60 * 24)
                );
                
                return (
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
                              <p className="font-medium text-slate-900 dark:text-white">
                                {request.employeeName}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {request.employeeId}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              request.status === "pending"
                                ? "secondary"
                                : request.status === "approved"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            <span className="text-sm text-slate-900 dark:text-white">
                              {formatDate(request.fromDate)} - {formatDate(request.toDate)}
                            </span>
                          </div>
                          <div className="text-sm text-slate-900 dark:text-white">
                            <span className="font-medium">{Math.abs(requestDays)} days</span>
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Requested on {formatDate(request.createdAt)}
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRequest && (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="sm:max-w-md w-full">
            <SheetHeader className="px-4">
              <SheetTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Leave Request Details
              </SheetTitle>
              <SheetDescription className="text-base text-slate-600 dark:text-slate-200">
                Review the complete request information
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Employee
                </h3>
                <p className="text-base text-slate-900 dark:text-white">
                  {selectedRequest.sender} ({selectedRequest._id})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    From Date
                  </h3>
                  <p className="text-base text-slate-900 dark:text-white">
                    {formatDate(selectedRequest.fromDate)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    To Date
                  </h3>
                  <p className="text-base text-slate-900 dark:text-white">
                    {formatDate(selectedRequest.toDate)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Total Days
                </h3>
                <p className="text-base text-slate-900 dark:text-white">
                  {totalDays} days
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Status
                </h3>
                <div className="mt-1">
                  <Badge
                    variant={
                      selectedRequest.status === "pending"
                        ? "secondary"
                        : selectedRequest.status === "approved"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Reason
                </h3>
                <p className="text-base mt-1 leading-relaxed whitespace-pre-line text-slate-900 dark:text-white">
                  {selectedRequest.reason}
                </p>
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