"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component, otherwise use a regular <textarea>
import { CheckCircle } from "lucide-react";
import { createJob } from "@/services/jobService";

export default function AddJob() {
  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    description: "",
    requirements: [""],
    responsibilities: [""],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    setServerError("");
  };

  const handleArrayChange = (index, field, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  const handleAddField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const handleRemoveField = (field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.salary.trim()) newErrors.salary = "Salary is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.requirements.some(req => req.trim() !== "")) newErrors.requirements = "At least one requirement is required";
    if (!formData.responsibilities.some(res => res.trim() !== "")) newErrors.responsibilities = "At least one responsibility is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await createJob({
        title: formData.title.trim(),
        salary: parseInt(formData.salary),
        description: formData.description.trim(),
        requirements: formData.requirements.filter(req => req.trim() !== ""),
        responsibilities: formData.responsibilities.filter(res => res.trim() !== ""),
      });

      setShowSuccess(true);
      setFormData({
        title: "",
        salary: "",
        description: "",
        requirements: [""],
        responsibilities: [""],
      });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-center">Add New Job</CardTitle>
        <CardDescription className="text-center text-sm">
          Fill in the job details.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {showSuccess && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <AlertDescription>
                Job created successfully.
              </AlertDescription>
            </div>
          </Alert>
        )}

        {serverError && (
          <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title && "border-red-500"}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              className={errors.salary && "border-red-500"}
            />
            {errors.salary && <p className="text-xs text-red-500 mt-1">{errors.salary}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description && "border-red-500"}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label>Requirements</Label>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={req}
                  onChange={(e) => handleArrayChange(index, "requirements", e.target.value)}
                  placeholder={`Requirement ${index + 1}`}
                />
                {formData.requirements.length > 1 && (
                  <Button type="button" size="sm" variant="destructive" onClick={() => handleRemoveField("requirements", index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" size="sm" variant="outline" onClick={() => handleAddField("requirements")}>
              Add Requirement
            </Button>
            {errors.requirements && <p className="text-xs text-red-500 mt-1">{errors.requirements}</p>}
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <Label>Responsibilities</Label>
            {formData.responsibilities.map((res, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={res}
                  onChange={(e) => handleArrayChange(index, "responsibilities", e.target.value)}
                  placeholder={`Responsibility ${index + 1}`}
                />
                {formData.responsibilities.length > 1 && (
                  <Button type="button" size="sm" variant="destructive" onClick={() => handleRemoveField("responsibilities", index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" size="sm" variant="outline" onClick={() => handleAddField("responsibilities")}>
              Add Responsibility
            </Button>
            {errors.responsibilities && <p className="text-xs text-red-500 mt-1">{errors.responsibilities}</p>}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Job"}
          </Button>

        </form>
      </CardContent>

      <CardFooter className="text-center text-xs text-gray-500">
        All job data will be securely stored.
      </CardFooter>
    </Card>
  );
}
