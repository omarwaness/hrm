"use client";

import { useState, useEffect } from "react";
import { getAllJobs, deleteJob } from "@/services/jobService"; // Adjust path if needed
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Loading from "../Loading";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Fetch jobs
  const initialJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialJobs();
  }, [refresh]);

  // Delete job
  const handleDeleteJob = async (idToDelete) => {
    try {
      await deleteJob(idToDelete);
      console.log("Job deleted successfully");
      setRefresh((prev) => !prev); // Refresh the list
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          Job Listings
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-200 mb-6">
          View and manage all posted job offers
        </p>

        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job._id} className="relative">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    aria-label={`Delete ${job.title}`}
                  >
                    <Trash2 size={18} />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the job posting for{" "}
                      <span className="font-medium">{job.title}</span>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteJob(job._id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 pt-10">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Title</p>
                  <p className="font-medium text-slate-900 dark:text-white">{job.title}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Salary</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    ${job.salary?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Location</p>
                  <p className="font-medium text-slate-900 dark:text-white">{job.location || "Remote"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Posted</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(job.postedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
