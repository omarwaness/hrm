'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

const AddJob = () => {
  const [formData, setFormData] = useState({
    jobDescription: '',
    dateAdded: '',
    salary: '',
    requirements: [],
    responsibilities: [],
  })

  const [requirementInput, setRequirementInput] = useState('')
  const [responsibilityInput, setResponsibilityInput] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addBulletItem = (type) => {
    if (type === 'requirement' && requirementInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }))
      setRequirementInput('')
    }

    if (type === 'responsibility' && responsibilityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput.trim()],
      }))
      setResponsibilityInput('')
    }
  }

  const removeBulletItem = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Job Offer Submitted:', formData)
    alert('Job offer submitted successfully!')
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Add New Job Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Description */}
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  name="jobDescription"
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  placeholder="Write a description of the job..."
                  required
                />
              </div>

              {/* Date of Addition */}
              <div className="space-y-2">
                <Label htmlFor="dateAdded">Date of Addition</Label>
                <Input
                  type="date"
                  name="dateAdded"
                  id="dateAdded"
                  value={formData.dateAdded}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  type="text"
                  name="salary"
                  id="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g., $50,000 / year"
                  required
                />
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <Label>Requirements</Label>
                <div className="flex gap-2">
                  <Input
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    placeholder="Add a requirement"
                  />
                  <Button
                    type="button"
                    className="text-xs px-3 py-1 h-auto"
                    onClick={() => addBulletItem('requirement')}
                  >
                    Add
                  </Button>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {formData.requirements.map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-5 w-5 p-1"
                        onClick={() => removeBulletItem('requirements', index)}
                      >
                        <X className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <Label>Responsibilities</Label>
                <div className="flex gap-2">
                  <Input
                    value={responsibilityInput}
                    onChange={(e) => setResponsibilityInput(e.target.value)}
                    placeholder="Add a responsibility"
                  />
                  <Button
                    type="button"
                    className="text-xs px-3 py-1 h-auto"
                    onClick={() => addBulletItem('responsibility')}
                  >
                    Add
                  </Button>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {formData.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-5 w-5 p-1"
                        onClick={() => removeBulletItem('responsibilities', index)}
                      >
                        <X className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submit */}
              <div className="flex justify-center items-center h-full">
               <Button type="submit" className="text-sm py-2 px-3">
                 Submit Job Offer
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default AddJob
