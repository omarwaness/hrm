"use client";

import { useEffect, useState } from "react";
import { getAllApplications } from "@/services/applicationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

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

  const handleAccept = async (applicationId) => {
    try {
      // Here you will later send an email to the applicant
      console.log("Accepting application:", applicationId);
      setActionStatus({ type: "success", message: "Application accepted successfully." });

      // Remove the accepted application from the list
      setApplications((prev) => prev.filter((app) => app._id !== applicationId));
    } catch (error) {
      console.error("Error accepting application:", error);
      setActionStatus({ type: "error", message: "Failed to accept application." });
    }
  };

  const handleDeny = async (applicationId) => {
    try {
      // Here you will later send a rejection email
      console.log("Denying application:", applicationId);
      setActionStatus({ type: "success", message: "Application denied successfully." });

      // Remove the denied application from the list
      setApplications((prev) => prev.filter((app) => app._id !== applicationId));
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
            <Alert className={`mb-4 ${actionStatus.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
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
                        href={`/uploads/cv/${app.cv}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View CV
                      </a>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50" onClick={() => handleAccept(app._id)}>
                      Accept
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeny(app._id)}>
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
