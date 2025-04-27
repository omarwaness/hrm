"use client";

import { useState } from "react";
import { applyForJob } from "@/services/applicationService"; // Adjust path if needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ApplyToJob({ jobId }) {
  const [email, setEmail] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await applyForJob({
        email,
        jobId,
        cv: cvFile,
      });

      setSuccessMessage("Application submitted successfully!");
      setEmail("");
      setCvFile(null);
    } catch (error) {
      setErrorMessage(error.message || "Failed to apply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Apply for this Job</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>

        <div>
          <Label htmlFor="cv">Upload your CV (PDF)</Label>
          <Input
            id="cv"
            type="file"
            accept=".pdf"
            onChange={(e) => setCvFile(e.target.files[0])}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </Button>

        {successMessage && (
          <p className="text-green-600 text-center mt-4">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 text-center mt-4">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
