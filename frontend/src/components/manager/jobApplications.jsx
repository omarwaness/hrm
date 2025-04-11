import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState("all");
  const [openSheet, setOpenSheet] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  
  useEffect(() => {
    // Simulate fetching applications data
    setTimeout(() => {
      const mockApplications = [
        {
          id: "app-001",
          applicantName: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          jobTitle: "Senior Frontend Developer",
          department: "Engineering",
          applyDate: "2023-05-15",
          status: "pending",
          resume: "https://example.com/resume/johndoe.pdf",
          coverLetter: "I am excited to apply for this position...",
          experience: "5 years of experience in frontend development",
          education: "Bachelor's in Computer Science, University of Technology",
          skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML"],
          photo: "",
        },
        {
          id: "app-002",
          applicantName: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+1 (555) 234-5678",
          jobTitle: "Backend Developer",
          department: "Engineering",
          applyDate: "2023-05-16",
          status: "pending",
          resume: "https://example.com/resume/janesmith.pdf",
          coverLetter: "With my strong background in Node.js...",
          experience: "3 years of experience in backend development",
          education: "Master's in Software Engineering, State University",
          skills: ["Node.js", "Express", "MongoDB", "SQL", "API Design"],
          photo: "",
        },
        {
          id: "app-003",
          applicantName: "Robert Johnson",
          email: "robert.johnson@example.com",
          phone: "+1 (555) 345-6789",
          jobTitle: "UI/UX Designer",
          department: "Design",
          applyDate: "2023-05-17",
          status: "approved",
          resume: "https://example.com/resume/robertjohnson.pdf",
          coverLetter: "I'm passionate about creating intuitive user interfaces...",
          experience: "4 years of experience in UI/UX design",
          education: "Bachelor's in Graphic Design, Art Institute",
          skills: ["Figma", "Adobe XD", "Sketch", "UI Design", "User Research"],
          photo: "",
        },
        {
          id: "app-004",
          applicantName: "Emily Davis",
          email: "emily.davis@example.com",
          phone: "+1 (555) 456-7890",
          jobTitle: "Senior Frontend Developer",
          department: "Engineering",
          applyDate: "2023-05-18",
          status: "rejected",
          resume: "https://example.com/resume/emilydavis.pdf",
          coverLetter: "I believe my expertise in React would be valuable...",
          experience: "6 years of experience in frontend development",
          education: "Master's in Computer Science, Tech University",
          skills: ["React", "Redux", "JavaScript", "TypeScript", "CSS"],
          photo: "",
        },
      ];
      
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setOpenSheet(true);
  };

  const handleStatusChange = (newStatus) => {
    setActionType(newStatus);
    setOpenAlertDialog(true);
  };

  const confirmStatusChange = () => {
    if (!selectedApplication) return;
    
    const updatedApplications = applications.map(app => 
      app.id === selectedApplication.id 
        ? { ...app, status: actionType } 
        : app
    );
    
    setApplications(updatedApplications);
    setSelectedApplication(prev => ({ ...prev, status: actionType }));
    setOpenAlertDialog(false);
  };

  const filteredApplications = filter === "all" 
    ? applications 
    : applications.filter(app => app.status === filter);

  const getStatusBadge = (status) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Job Applications</h2>
        <div className="flex items-center gap-4">
          <Label htmlFor="filter-status">Filter by status:</Label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger id="filter-status" className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">No applications found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-6">
                  <Avatar className="h-12 w-12">
                    {application.photo ? (
                      <AvatarImage src={application.photo} alt={application.applicantName} />
                    ) : (
                      <AvatarFallback>
                        {application.applicantName.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{application.applicantName}</h3>
                      <div>{getStatusBadge(application.status)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{application.email} • {application.phone}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Applied for: {application.jobTitle}</p>
                      <p className="text-sm text-muted-foreground">Applied on: {application.applyDate}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t px-6 py-4 flex justify-end">
                  <Button variant="outline" onClick={() => handleViewApplication(application)}>
                    View Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Application Detail Sheet */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          {selectedApplication && (
            <>
              <SheetHeader className="pb-4">
                <SheetTitle className="text-2xl">Application Details</SheetTitle>
                <SheetDescription>
                  Review application for {selectedApplication.jobTitle}
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {selectedApplication.photo ? (
                      <AvatarImage src={selectedApplication.photo} alt={selectedApplication.applicantName} />
                    ) : (
                      <AvatarFallback className="text-lg">
                        {selectedApplication.applicantName.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedApplication.applicantName}</h3>
                    <p className="text-muted-foreground">{selectedApplication.email}</p>
                    <p className="text-muted-foreground">{selectedApplication.phone}</p>
                  </div>
                  <div className="ml-auto">
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>
                
                <div className="grid gap-4 border rounded-lg p-4">
                  <h4 className="font-semibold">Application Summary</h4>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Position:</span>
                      <span className="font-medium">{selectedApplication.jobTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department:</span>
                      <span>{selectedApplication.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Applied On:</span>
                      <span>{selectedApplication.applyDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Cover Letter</h4>
                  <div className="border rounded-lg p-4">
                    <p className="whitespace-pre-line">{selectedApplication.coverLetter}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Experience</h4>
                  <div className="border rounded-lg p-4">
                    <p>{selectedApplication.experience}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Education</h4>
                  <div className="border rounded-lg p-4">
                    <p>{selectedApplication.education}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Skills</h4>
                  <div className="border rounded-lg p-4 flex flex-wrap gap-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Resume</h4>
                  <div className="border rounded-lg p-4">
                    <a 
                      href={selectedApplication.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download Resume
                    </a>
                  </div>
                </div>
              </div>
              
              <SheetFooter className="border-t pt-4">
                <div className="flex w-full justify-between">
                  {selectedApplication.status === "pending" && (
                    <>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleStatusChange("rejected")}
                      >
                        Reject Application
                      </Button>
                      <Button 
                        onClick={() => handleStatusChange("approved")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve Application
                      </Button>
                    </>
                  )}
                  {selectedApplication.status !== "pending" && (
                    <>
                      <div></div>
                      <Button 
                        variant="outline" 
                        onClick={() => handleStatusChange("pending")}
                      >
                        Reset to Pending
                      </Button>
                    </>
                  )}
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <AlertDialogContent onClose={() => setOpenAlertDialog(false)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approved" 
                ? "Approve Application" 
                : actionType === "rejected" 
                  ? "Reject Application" 
                  : "Reset Application Status"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approved" 
                ? "Are you sure you want to approve this application? This will mark the applicant as approved and potentially trigger notification emails." 
                : actionType === "rejected" 
                  ? "Are you sure you want to reject this application? This will mark the applicant as rejected and potentially trigger notification emails."
                  : "Are you sure you want to reset this application to pending status?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlertDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              {actionType === "approved" 
                ? "Approve" 
                : actionType === "rejected" 
                  ? "Reject" 
                  : "Reset"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default JobApplications
