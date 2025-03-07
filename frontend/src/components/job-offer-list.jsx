import React from "react"
import JobOfferCard from "./job-offer-card"

export default function JobOfferList() {
  const jobOffers = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      salary: "$120,000 - $150,000",
      postedDate: "2025-03-01",
      description:
        "We're looking for an experienced Frontend Developer to join our team. You'll be responsible for building responsive web applications using React and Next.js.",
    },
    {
      id: "2",
      title: "UX/UI Designer",
      salary: "$90,000 - $110,000",
      postedDate: "2025-02-28",
      description:
        "Join our creative team as a UX/UI Designer. You'll collaborate with product managers and engineers to design intuitive user experiences for our digital products.",
    },
    {
      id: "3",
      title: "DevOps Engineer",
      salary: "$130,000 - $160,000",
      postedDate: "2025-02-25",
      description:
        "We're seeking a DevOps Engineer to help us build and maintain our cloud infrastructure. Experience with AWS, Kubernetes, and CI/CD pipelines is required.",
    },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Latest Job Offers</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobOffers.map((job) => (
          <JobOfferCard key={job.id} {...job} onClick={() => console.log(`Clicked on job: ${job.title}`)} />
        ))}
      </div>
    </div>
  )
}