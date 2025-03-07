"use client";

import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import JobOfferCard from "./job-offer-card";
import JobDetails from "./job-details";

const jobOffers = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    salary: "$120,000 - $150,000",
    postedDate: "2025-03-01",
    description:
      "We're looking for an experienced Frontend Developer to join our team. You'll be responsible for building responsive web applications using React and Next.js. The ideal candidate will have a strong understanding of modern JavaScript and experience with TypeScript.",
    requirements: [
      "5+ years of experience with React and modern JavaScript",
      "Experience with TypeScript and Next.js",
      "Strong understanding of web performance optimization",
      "Experience with responsive design and cross-browser compatibility",
      "Excellent problem-solving and communication skills",
    ],
    responsibilities: [
      "Build and maintain responsive web applications",
      "Collaborate with designers and backend developers",
      "Optimize applications for maximum speed and scalability",
      "Write clean, maintainable, and well-documented code",
      "Participate in code reviews and team discussions",
    ],
  },
  {
    id: "2",
    title: "UX/UI Designer",
    salary: "$90,000 - $110,000",
    postedDate: "2025-02-28",
    description:
      "Join our creative team as a UX/UI Designer. You'll collaborate with product managers and engineers to design intuitive user experiences for our digital products. We're looking for someone who can balance creativity with user-centered design principles.",
    requirements: [
      "3+ years of experience in UX/UI design",
      "Proficiency with Figma and other design tools",
      "Strong portfolio demonstrating user-centered design",
      "Experience with design systems",
      "Knowledge of accessibility standards",
    ],
    responsibilities: [
      "Create user-centered designs for web and mobile applications",
      "Develop and maintain design systems",
      "Conduct user research and usability testing",
      "Create wireframes, prototypes, and high-fidelity designs",
      "Collaborate with developers on implementation",
    ],
  },
  {
    id: "3",
    title: "DevOps Engineer",
    salary: "$130,000 - $160,000",
    postedDate: "2025-02-25",
    description:
      "We're seeking a DevOps Engineer to help us build and maintain our cloud infrastructure. Experience with AWS, Kubernetes, and CI/CD pipelines is required. You'll work closely with our development team to improve our deployment processes.",
    requirements: [
      "4+ years of DevOps experience",
      "Strong experience with AWS and Kubernetes",
      "Experience with CI/CD pipelines",
      "Knowledge of infrastructure as code",
      "Strong scripting skills (Python, Bash)",
    ],
    responsibilities: [
      "Manage and improve cloud infrastructure",
      "Implement and maintain CI/CD pipelines",
      "Monitor system performance and reliability",
      "Automate deployment processes",
      "Collaborate with development teams on infrastructure needs",
    ],
  },
];

export default function JobBoard() {
  const [selectedJobId, setSelectedJobId] = useState(jobOffers[0].id);
  const isMobile = useIsMobile();
  
  const selectedJob = jobOffers.find((job) => job.id === selectedJobId) || jobOffers[0];

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Latest Job Offers</h1>
      {isMobile ? (
        <>
          <div className="space-y-4">
            {jobOffers.map((job) => (
              <JobOfferCard 
                key={job.id} 
                {...job} 
                isSelected={job.id === selectedJobId} 
                onSelect={setSelectedJobId} 
              />
            ))}
          </div>
          {selectedJob && (
            <JobDetails
              {...selectedJob}
              isMobile={true}
              isOpen={!!selectedJobId}
              onClose={() => setSelectedJobId(null)}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/5 lg:w-5/12 space-y-4">
            {jobOffers.map((job) => (
              <JobOfferCard 
                key={job.id} 
                {...job} 
                isSelected={job.id === selectedJobId} 
                onSelect={setSelectedJobId} 
              />
            ))}
          </div>
          <div className="w-full md:w-3/5 lg:w-7/12 sticky top-4">
            <JobDetails {...selectedJob} />
          </div>
        </div>
      )}
    </div>
  );
}
