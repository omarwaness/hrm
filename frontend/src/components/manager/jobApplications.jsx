"use client";

import { useEffect, useState } from "react";
import { getAllApplications, deleteApplication } from "@/services/applicationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getAllApplications();
        setApplications(data);
      } catch (error) {
        console.error("Error loading applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const sendEmail = async (email, subject, message) => {
    try {
      await axios.post('http://localhost:5000/api/email/send', {
        to: email,
        subject,
        message,
      });
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  };

  const handleAccept = async (application) => {
    try {
      // Send acceptance email to the applicant
      const emailSent = await sendEmail(
        application.email,
        "Job Application Accepted",
        `Congratulations! Your application for the position of ${application.job?.title || "our job opening"} has been accepted. We will contact you shortly with next steps.`
      );

      console.log("Accepting application:", application._id);
      await deleteApplication(application._id);
      if (emailSent) {
        setActionStatus({ 
          type: "success", 
          message: "Application accepted and acceptance email sent successfully." 
        });
      } else {
        setActionStatus({ 
          type: "warning", 
          message: "Application accepted but failed to send the notification email." 
        });
      }

      // Remove the accepted application from the list
      setApplications((prev) => prev.filter((app) => app._id !== application._id));
    } catch (error) {
      console.error("Error accepting application:", error);
      setActionStatus({ type: "error", message: "Failed to accept application." });
    }
  };

  const handleDeny = async (application) => {
    try {
      // Send rejection email to the applicant
      const emailSent = await sendEmail(
        application.email,
        "Response to Your Job Application",
        `Thank you for your interest in ${application.job?.title || "our job opening"}. After careful consideration, we have decided to pursue other candidates for this position. We appreciate your time and wish you the best in your job search.`
      );

      // Delete the application from the database
      await deleteApplication(application._id);
      
      console.log("Denying application:", application._id);
      
      if (emailSent) {
        setActionStatus({ 
          type: "success", 
          message: "Application denied and rejection email sent successfully." 
        });
      } else {
        setActionStatus({ 
          type: "warning", 
          message: "Application denied but failed to send the notification email." 
        });
      }

      // Remove the denied application from the list
      setApplications((prev) => prev.filter((app) => app._id !== application._id));
    } catch (error) {
      console.error("Error denying application:", error);
      setActionStatus({ type: "error", message: "Failed to deny application." });
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-lg">Loading applications...</div>;
  }

  return (
    <div className="w-full">
      <Card className="w-full shadow-md">
        <CardHeader className="bg-slate-50 dark:bg-black">
          <CardTitle className="text-2xl">Manage Job Applications</CardTitle>
          <CardDescription>Review and take action on job applications.</CardDescription>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {actionStatus.message && (
            <Alert className={`mb-4 ${
              actionStatus.type === "success" ? "bg-green-50 text-green-800" : 
              actionStatus.type === "warning" ? "bg-yellow-50 text-yellow-800" : 
              "bg-red-50 text-red-800"
            }`}>
              <div className="flex items-center">
                {actionStatus.type === "success" ? (
                  <CheckCircle className="h-6 w-6 mr-3 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 mr-3 text-red-500" />
                )}
                <AlertDescription>{actionStatus.message}</AlertDescription>
              </div>
            </Alert>
          )}

          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="border p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-lg">{app.email}</div>
                    <div className="text-sm text-muted-foreground">
                      Applied for: <span className="font-semibold">{app.job?.title || "Unknown Job"}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Applied at: {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                    <div className="mt-1">
                      <a
                        href={`http://localhost:5000/uploads/cvs/${app.cv}`}  // Replace with your backend URL
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View CV
                      </a>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    <Button 
                      variant="outline" 
                      className="border-green-500 text-green-600 hover:bg-secondary" 
                      onClick={() => handleAccept(app)}
                    >
                      Accept
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeny(app)}
                    >
                      Deny
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 p-6">
              No job applications found.
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-slate-50 p-4 flex justify-center dark:bg-black">
          <p className="text-sm text-slate-500 dark:text-slate-200">Keep applicants informed about their status.</p>
        </CardFooter>
      </Card>
    </div>
  );
}