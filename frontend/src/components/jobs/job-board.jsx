"use client";

import { useEffect, useState } from "react";
import JobOfferCard from "./job-offer-card"; // Adjust paths if needed
import JobDetails from "./job-details";
import { getAllJobs } from "@/services/jobService";

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      const data = await getAllJobs();
      setJobs(data);
      if (data.length > 0) {
        setSelectedJobId(data[0]._id);
      }
    }
    fetchJobs();
  }, []);

  const selectedJob = jobs.find((job) => job._id === selectedJobId);

  const handleSelectJob = (id) => {
    setSelectedJobId(id);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 p-4 md:p-6">
      {/* Left side: Job list with scroll */}
      <div className="w-2/3 md:w-1/2 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 custom-scrollbar space-y-4">
        {jobs.map((job) => (
          <JobOfferCard
            key={job._id}
            id={job._id}
            title={job.title}
            salary={`$${job.salary.toLocaleString()}`}
            description={job.description}
            daysAgoText={getDaysAgo(job.postedAt)}
            formattedDate={new Date(job.postedAt).toLocaleDateString()}
            isSelected={job._id === selectedJobId}
            onSelect={handleSelectJob}
          />
        ))}
      </div>

      {/* Right side: Job details */}
      <div className="w-full md:w-1/2">
        {selectedJob ? (
          <JobDetails
            id={selectedJob._id}
            title={selectedJob.title}
            company={selectedJob.company || "Company Name"}
            location={selectedJob.location || "Remote"}
            postedAt={selectedJob.postedAt}
            salary={selectedJob.salary}
            description={selectedJob.description}
            requirements={selectedJob.requirements}
            responsibilities={selectedJob.responsibilities}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a job to view details
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function
function getDaysAgo(postedAt) {
  const postedDate = new Date(postedAt);
  const now = new Date();
  const diffTime = Math.abs(now - postedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
}
