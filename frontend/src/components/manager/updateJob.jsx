"use client";

import { useState, useEffect } from "react";
import { getAllJobs, updateJob } from "@/services/jobService"; // adjust path if needed
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Search, CheckCircle } from "lucide-react";

export default function UpdateJob() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    description: "",
    requirements: "",
    responsibilities: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      const data = await getAllJobs();
      setJobs(data);
    }
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    const results = jobs.filter((job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setIsSearching(true);
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements.join("\n"),
      responsibilities: job.responsibilities.join("\n"),
    });
    setErrors({});
    setShowSuccess(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.salary) newErrors.salary = "Salary is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.requirements.trim()) newErrors.requirements = "Requirements are required.";
    if (!formData.responsibilities.trim()) newErrors.responsibilities = "Responsibilities are required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await updateJob(selectedJob._id, {
        ...formData,
        salary: Number(formData.salary),
        requirements: formData.requirements.split("\n").map((req) => req.trim()).filter(Boolean),
        responsibilities: formData.responsibilities.split("\n").map((res) => res.trim()).filter(Boolean),
      });
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAllJobsSorted = () => {
    return [...jobs].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
  };

  return (
    <div className="w-full">
      {/* Search Section */}
      <Card className="w-full mb-6 shadow-md">
        <CardHeader className="bg-slate-50 dark:bg-black">
          <CardTitle className="text-xl">Find Job</CardTitle>
          <CardDescription>
            Search for a job to update its information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by job title..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {isSearching ? (
            searchResults.length > 0 ? (
              <div className="mt-4 border rounded-md">
                <div className="p-2 bg-slate-50 dark:bg-black font-medium">Search Results</div>
                <div className="divide-y">
                  {searchResults.map((job) => (
                    <div
                      key={job._id}
                      className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center"
                      onClick={() => handleSelectJob(job)}
                    >
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground">${job.salary}</div>
                      </div>
                      <Button variant="outline" size="sm">Select</Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md dark:bg-amber-950 dark:text-amber-200">
                No jobs found matching your search.
              </div>
            )
          ) : (
            <div className="mt-4 border rounded-md">
              <div className="p-2 bg-slate-50 dark:bg-black font-medium">All Jobs</div>
              <div className="divide-y max-h-60 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {getAllJobsSorted().map((job) => (
                  <div
                    key={job._id}
                    className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center"
                    onClick={() => handleSelectJob(job)}
                  >
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-muted-foreground">${job.salary}</div>
                    </div>
                    <Button variant="outline" size="sm">Select</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Form Section */}
      {selectedJob && (
        <Card className="w-full shadow-lg border-2">
          <CardHeader className="p-6 bg-slate-50 dark:bg-black">
            <CardTitle className="text-2xl font-bold">Update Job: {selectedJob.title}</CardTitle>
            <CardDescription className="text-base mt-2">
              Update the job information below
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {showSuccess && (
              <Alert className="mb-6 bg-green-50 text-green-800 border-green-200 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-3 text-green-500" />
                  <AlertDescription className="text-lg font-medium">
                    Job information was successfully updated.
                  </AlertDescription>
                </div>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title" className={`text-base ${errors.title ? "text-red-500" : ""}`}>
                    Job Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Software Engineer"
                    className={`p-4 h-12 text-base ${errors.title ? "border-red-500" : ""}`}
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary" className={`text-base ${errors.salary ? "text-red-500" : ""}`}>
                    Salary
                  </Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    placeholder="50000"
                    className={`p-4 h-12 text-base ${errors.salary ? "border-red-500" : ""}`}
                    value={formData.salary}
                    onChange={handleChange}
                  />
                  {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className={`text-base ${errors.description ? "text-red-500" : ""}`}>
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Job description here..."
                  className={`p-4 text-base ${errors.description ? "border-red-500" : ""}`}
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className={`text-base ${errors.requirements ? "text-red-500" : ""}`}>
                  Requirements (one per line)
                </Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  placeholder="Requirement 1\nRequirement 2"
                  className={`p-4 text-base ${errors.requirements ? "border-red-500" : ""}`}
                  value={formData.requirements}
                  onChange={handleChange}
                />
                {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities" className={`text-base ${errors.responsibilities ? "text-red-500" : ""}`}>
                  Responsibilities (one per line)
                </Label>
                <Textarea
                  id="responsibilities"
                  name="responsibilities"
                  placeholder="Responsibility 1\nResponsibility 2"
                  className={`p-4 text-base ${errors.responsibilities ? "border-red-500" : ""}`}
                  value={formData.responsibilities}
                  onChange={handleChange}
                />
                {errors.responsibilities && <p className="text-red-500 text-sm mt-1">{errors.responsibilities}</p>}
              </div>

              <div className="pt-4 flex space-x-4">
                <Button
                  type="submit"
                  className="h-12 text-base font-semibold bg-primary hover:bg-primary/90 flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Job"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 text-base font-semibold flex-1"
                  onClick={() => setSelectedJob(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-slate-50 p-4 flex justify-center dark:bg-black">
            <p className="text-sm text-slate-500 dark:text-slate-200">
              All job information will be securely stored
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
