import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

const initialJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    salaryRange: "$60,000 - $80,000",
    requirements: "React, Tailwind CSS, REST APIs",
    responsibilities: "Build and maintain UI components",
    createdAt: "2025-04-10",
  },
  {
    id: 2,
    title: "Backend Developer",
    salaryRange: "$70,000 - $90,000",
    requirements: "Node.js, Express, MongoDB",
    responsibilities: "Develop and manage server-side logic",
    createdAt: "2025-04-08",
  },
  {
    id: 3,
    title: "Project Manager",
    salaryRange: "$80,000 - $100,000",
    requirements: "Agile, Scrum, Communication Skills",
    responsibilities: "Lead project planning and coordination",
    createdAt: "2025-04-05",
  },
];

export default function JobList() {
  const [jobs, setJobs] = useState(initialJobs);

  const handleDeleteJob = (idToDelete) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== idToDelete));
    console.log(`Job with ID ${idToDelete} deleted.`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Job Listings</h1>
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="relative">
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
                      This action cannot be undone. This will permanently delete the job listing for{" "}
                      <span className="font-medium">{job.title}</span>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteJob(job.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-10">
                <div>
                  <p className="text-sm text-gray-500">Job Title</p>
                  <p className="font-medium">{job.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salary Range</p>
                  <p className="font-medium">{job.salaryRange}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Requirements</p>
                  <p className="font-medium">{job.requirements}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Responsibilities</p>
                  <p className="font-medium">{job.responsibilities}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Created</p>
                  <p className="font-medium">{job.createdAt}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
