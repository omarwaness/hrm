import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams, useNavigate } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function UpdateJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobs, setJobs] = useState([]);
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
    salaryRange: '',
    location: '',
    department: '',
    employmentType: '',
    experienceLevel: '',
    education: '',
    skills: '',
    benefits: ''
  });

  useEffect(() => {
    // Simulate fetching jobs list
    setTimeout(() => {
      const sampleJobs = [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          salary: '$80,000 - $120,000',
          description: 'We are looking for an experienced frontend developer to join our team.',
        },
        {
          id: '2',
          title: 'Backend Developer',
          salary: '$70,000 - $100,000',
          description: 'Looking for a backend developer with Node.js experience.',
        },
        {
          id: '3',
          title: 'UI/UX Designer',
          salary: '$60,000 - $90,000',
          description: 'Join our design team to create beautiful user interfaces.',
        }
      ];
      
      setJobs(sampleJobs);
      setLoading(false);
    }, 1000);
  }, []);

  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
    const selectedJob = jobs.find(job => job.id === jobId);
    if (selectedJob) {
      setJobData({
        title: selectedJob.title,
        description: selectedJob.description,
        requirements: 'Proficiency in React, TypeScript, and modern JavaScript.',
        salaryRange: selectedJob.salary,
        location: 'New York, NY',
        department: 'Engineering',
        employmentType: 'Full-time',
        experienceLevel: 'Senior',
        education: 'Bachelor\'s degree in Computer Science or related field',
        skills: 'React, JavaScript, TypeScript, CSS',
        benefits: 'Health insurance, 401k, flexible working hours'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated job data:', jobData);
    alert('Job updated successfully!');
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-800 dark:text-slate-200">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Update Job Posting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="job-select" className="text-slate-800 dark:text-slate-200">Select Job to Update</Label>
            <Select value={selectedJobId} onValueChange={handleJobSelect}>
              <SelectTrigger id="job-select" className="w-full">
                <SelectValue placeholder="Choose a job to update" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} - {job.salary}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedJobId && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-800 dark:text-slate-200">Job Title</Label>
                <Input 
                  id="title"
                  name="title"
                  value={jobData.title}
                  onChange={handleChange}
                  placeholder="Enter job title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-800 dark:text-slate-200">Job Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  value={jobData.description}
                  onChange={handleChange}
                  placeholder="Enter detailed job description"
                  className="min-h-32"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-slate-800 dark:text-slate-200">Job Requirements</Label>
                <Textarea 
                  id="requirements"
                  name="requirements"
                  value={jobData.requirements}
                  onChange={handleChange}
                  placeholder="Enter job requirements"
                  className="min-h-24"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryRange" className="text-slate-800 dark:text-slate-200">Salary Range</Label>
                  <Input 
                    id="salaryRange"
                    name="salaryRange"
                    value={jobData.salaryRange}
                    onChange={handleChange}
                    placeholder="e.g. $80,000 - $120,000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-800 dark:text-slate-200">Location</Label>
                  <Input 
                    id="location"
                    name="location"
                    value={jobData.location}
                    onChange={handleChange}
                    placeholder="e.g. New York, NY"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-slate-800 dark:text-slate-200">Department</Label>
                  <Input 
                    id="department"
                    name="department"
                    value={jobData.department}
                    onChange={handleChange}
                    placeholder="e.g. Engineering"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentType" className="text-slate-800 dark:text-slate-200">Employment Type</Label>
                  <Input 
                    id="employmentType"
                    name="employmentType"
                    value={jobData.employmentType}
                    onChange={handleChange}
                    placeholder="e.g. Full-time, Part-time"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceLevel" className="text-slate-800 dark:text-slate-200">Experience Level</Label>
                <Input 
                  id="experienceLevel"
                  name="experienceLevel"
                  value={jobData.experienceLevel}
                  onChange={handleChange}
                  placeholder="e.g. Entry, Mid, Senior"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education" className="text-slate-800 dark:text-slate-200">Education Requirements</Label>
                <Input 
                  id="education"
                  name="education"
                  value={jobData.education}
                  onChange={handleChange}
                  placeholder="e.g. Bachelor's degree"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills" className="text-slate-800 dark:text-slate-200">Required Skills</Label>
                <Input 
                  id="skills"
                  name="skills"
                  value={jobData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, JavaScript, TypeScript"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits" className="text-slate-800 dark:text-slate-200">Benefits</Label>
                <Textarea 
                  id="benefits"
                  name="benefits"
                  value={jobData.benefits}
                  onChange={handleChange}
                  placeholder="List job benefits"
                  className="min-h-24"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Update Job
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UpdateJob
