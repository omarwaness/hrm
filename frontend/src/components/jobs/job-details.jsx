"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Calendar, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function JobDetails({
  id,
  title,
  company,
  location,
  postedAt,
  salary,
  description,
  requirements,
  responsibilities,
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Format the posted date nicely
  const formattedDate = postedAt ? new Date(postedAt).toLocaleDateString() : "";

  // Check if user is logged in
  useEffect(() => {
    let isMounted = true;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        if (isMounted) setIsLoggedIn(false);
        return;
      }

      const decodedUser = jwtDecode(token);
      if (decodedUser && isMounted) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      if (isMounted) setIsLoggedIn(false);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handleApply = () => {
    if (isLoggedIn) {
      navigate(`/apply/${id}`);
      //console.log(isLoggedIn)
    } else {
      navigate("/login"); // Redirect to the login page if not logged in
      //console.log(isLoggedIn)
    }
  };

  return (
    <div className="rounded-lg p-6 shadow-sm bg-card w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title || "Job Title"}</h2>

        <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-4">
          {company && (
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              <span>{company}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
          {postedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {salary && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-primary">
              ${salary.toLocaleString()}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              Full-time
            </Badge>
          </div>
        )}
      </div>

      {description && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Job Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{description}</p>
        </div>
      )}

      {requirements && requirements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Requirements</h3>
          <ul className="list-disc pl-5 space-y-2">
            {requirements.map((req, index) => (
              <li key={index} className="text-gray-700">{req}</li>
            ))}
          </ul>
        </div>
      )}

      {responsibilities && responsibilities.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
          <ul className="list-disc pl-5 space-y-2">
            {responsibilities.map((resp, index) => (
              <li key={index} className="text-gray-700">{resp}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <Button className="w-full" onClick={handleApply}>
          Apply Now
        </Button>
      </div>
    </div>
  );
}
