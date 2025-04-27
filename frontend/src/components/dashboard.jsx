import React, { useEffect, useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { User, CalendarDays, Briefcase } from "lucide-react";

function Dashboard() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    joinDate: new Date(),
    role: "",
    bio: "",
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const decodedUser = jwtDecode(token);
      if (isMounted) {
        setUser(decodedUser);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
    return () => { isMounted = false };
  }, [navigate]);

  useEffect(() => {
    if (user) {
      const initialData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        joinDate: user.createAt ? new Date(user.createAt) : new Date(),
        role: user.role || "",
        bio: user.bio || "Experienced professional.",
      };
      setUserData(initialData);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
    // Main container still uses flex-col to stack sections vertically
    <div className="flex flex-col flex-1 p-6 gap-6">

      {/* Welcome Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, {userData.firstName}!
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome to the HRM portal. Here's what's happening in the company.
          </p>
        </div>
      </div>

      {/* --- Row 1: Role and Joined Cards --- */}
      {/* Use Grid layout for these two cards */}
      {/* - grid-cols-1: Stack on small screens */}
      {/* - md:grid-cols-2: Side-by-side (2 columns) on medium screens and up */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Role Card */}
        <Card> {/* No col-span needed here, it takes 1 of 2 columns */}
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            </div>
            <Briefcase className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.role}</div>
            <p className="text-xs text-muted-foreground">Active status</p>
          </CardContent>
        </Card>

        {/* Joined Details Card */}
        <Card> {/* No col-span needed here, it takes 1 of 2 columns */}
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Joined</CardTitle>
            </div>
            <User className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userData.joinDate instanceof Date && !isNaN(userData.joinDate)
                ? userData.joinDate.toLocaleDateString()
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Phone: {userData.phone || 'N/A'}</p>
          </CardContent>
        </Card>
      </div> {/* End of the first row grid */}
    </div> 
    <div>
      {/* --- Row 2: Calendar Card --- */}
      {/* This card sits below the grid above */}
      <Card className="w-full"> {/* Ensure it takes full width */}
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Calendar</CardTitle>
          </div>
          <CalendarDays className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {/* Center calendar or adjust padding as needed */}
          <div className="flex justify-center">
             <Calendar className="p-0" />
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

export default Dashboard;