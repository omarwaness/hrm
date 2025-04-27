"use client"

import { useState, useEffect } from "react"
import { Pencil, Save, X, User, Mail, Phone, Calendar, FileText, AlertTriangle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Import Input
import { Textarea } from "@/components/ui/textarea" // Import Textarea
import { Label } from "@/components/ui/label" // Import Label
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card" // Import Card components
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom' // Assuming react-router-dom is used, adjust if using Next.js router
import Loading from "./Loading"; // Assuming Loading component exists

const Account = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true) // Start with loading true
    const [user, setUser] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    // Initialize userData with default structure
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        joinDate: new Date(),
        role: "",
        bio: "", // Initialize empty, populate later
        profileImage: "/placeholder.svg?height=100&width=100", // Default placeholder
    })

    // Use formData for edits, initialized from userData
    const [formData, setFormData] = useState({})

    // Fetch and decode user token
    useEffect(() => {
        let isMounted = true; // Prevent state updates on unmounted component
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
        return () => { isMounted = false }; // Cleanup function
    }, [navigate]);

    // Populate userData and formData once user is decoded
    useEffect(() => {
        if (user) {
            const initialData = {
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phoneNumber || "", // Ensure key matches API expectation
                // Handle potential date string format issues more robustly
                joinDate: user.createAt ? new Date(user.createAt) : new Date(),
                role: user.role || "",
                // Example Bio - Ideally this would come from user data if available
                bio: user.bio || "Experienced software developer with 5+ years of experience.",
                profileImage: user.profileImage || "/placeholder.svg?height=100&width=100",
            };
            setUserData(initialData);
            setFormData(initialData); // Initialize formData
        }
    }, [user]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user || !user.id) {
          console.error("User or User ID is missing");
          return;
        }
      
        setLoading(true);
      
        try {
          const res = await fetch(`http://localhost:5000/api/user/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phoneNumber: formData.phone,
              bio: formData.bio,
            }),
            credentials: 'include',
          });
      
          if (res.ok) {
            const data = await res.json();
      
            if (data.token) {
              // ✅ New token received — save it
              localStorage.setItem('token', data.token);
      
              try {
                const updatedUser = jwtDecode(data.token);
      
                // ✅ Update user state with the new token
                setUser(updatedUser);
      
                // ✅ Also update form data from new user info if needed
                setUserData({
                  firstName: updatedUser.firstName || "",
                  lastName: updatedUser.lastName || "",
                  email: updatedUser.email || "",
                  phone: updatedUser.phoneNumber || "",
                  joinDate: updatedUser.createAt ? new Date(updatedUser.createAt) : new Date(),
                  role: updatedUser.role || "",
                  bio: updatedUser.bio || "Experienced software developer with 5+ years of experience.",
                  profileImage: updatedUser.profileImage || "/placeholder.svg?height=100&width=100",
                });
      
              } catch (decodeError) {
                console.error("Error decoding new token:", decodeError);
                // Fallback: clear token and redirect to login
                localStorage.removeItem('token');
                navigate('/login');
              }
            } else {
              console.warn("No new token received, keeping old data.");
            }
      
            setEditMode(false); // Exit edit mode
      
          } else {
            const errorData = await res.json();
            console.error("Failed to update user:", errorData.message || res.statusText);
          }
        } catch (err) {
          console.error("Error submitting user update:", err);
        } finally {
          setLoading(false);
        }
      };
      


    const cancelEdit = () => {
        setFormData({ ...userData }); // Reset form data to original user data
        setEditMode(false);
    };

    async function handleDeleteAccount() {
        if (!user || !user.id) return;
         setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/user/${user.id}`, {
                method: 'DELETE',
                credentials: 'include', // Include credentials if needed for auth
            });

            if (res.ok) {
                localStorage.removeItem('token');
                setUser(null); // Clear user state
                navigate('/'); // Navigate to home or login page
            } else {
                 const errorData = await res.json();
                 console.error("Failed to delete account:", errorData.message || res.statusText);
                 // Optionally: show error message
            }
        } catch (err) {
            console.error("Error deleting account:", err);
             // Optionally: show error message
        } finally {
             setLoading(false);
             setShowDeleteConfirm(false); // Hide confirmation modal regardless of outcome
        }
    }

    // Loading state or if user data hasn't loaded yet
    if (loading || !user) {
        return <Loading />; // Show loading indicator
    }

    return (
        // Reduced max-width and centered layout, similar to LeaveRequest
        <div className="flex min-h-screen flex-col p-4 bg-background">
            <div className="mx-auto w-full max-w-4xl space-y-8 py-10">

                {/* Page Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Account</h1>
                    {!editMode ? (
                        <Button onClick={() => setEditMode(true)} variant="outline">
                            <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button onClick={cancelEdit} variant="outline">
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            {/* Use the form's submit handler via Button type="submit" linked to the form */}
                            <Button type="submit" form="profile-form" disabled={loading}>
                                <Save className="mr-2 h-4 w-4" /> {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Personal Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Manage your personal details and contact information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Link the Save button to this form */}
                        <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Profile Image Section */}
                                <div className="flex flex-col items-center gap-4 lg:w-1/4 lg:items-start">
                                     <Label>Profile Picture</Label>
                                    <div className="h-32 w-32 rounded-full bg-muted overflow-hidden border-4 border-background shadow">
                                        <img
                                            src={userData.profileImage || "/placeholder.svg"}
                                            alt={`${userData.firstName} ${userData.lastName}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    {editMode && (
                                        // Use Button component
                                        <Button type="button" variant="outline" className="w-full" disabled> {/* Disabled as functionality isn't implemented */}
                                             Change Photo
                                        </Button>
                                    )}
                                </div>

                                {/* Form Fields Section */}
                                <div className="flex-1 space-y-6">
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5"> {/* Adjusted spacing for label/input */}
                                            <Label htmlFor="firstName">First Name</Label>
                                            {editMode ? (
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    disabled={loading}
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2 p-2.5 border border-border rounded-md bg-muted min-h-[40px]"> {/* Matched Input height */}
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-foreground">{userData.firstName}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            {editMode ? (
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    disabled={loading}
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2 p-2.5 border border-border rounded-md bg-muted min-h-[40px]">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-foreground">{userData.lastName}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contact Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="email">Email</Label>
                                            {editMode ? (
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                     disabled={loading}
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2 p-2.5 border border-border rounded-md bg-muted min-h-[40px]">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-foreground">{userData.email}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            {editMode ? (
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                     disabled={loading}
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2 p-2.5 border border-border rounded-md bg-muted min-h-[40px]">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-foreground">{userData.phone || 'N/A'}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Role and Join Date (Read Only) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="role">Role</Label>
                                            <div className="flex items-center gap-2 p-2.5 border border-border rounded-md bg-muted min-h-[40px]">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-foreground">{userData.role}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="joinDate">Join Date</Label>
                                            <div className="flex items-center gap-2 p-2.5 border border-border rounded-md bg-muted min-h-[40px]">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-foreground">
                                                     {/* Added check for valid date */}
                                                     {userData.joinDate instanceof Date && !isNaN(userData.joinDate)
                                                         ? userData.joinDate.toLocaleDateString()
                                                         : 'N/A'}
                                                 </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bio Field */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="bio">Bio</Label>
                                        {editMode ? (
                                            <Textarea
                                                id="bio"
                                                name="bio"
                                                rows={4}
                                                className="min-h-[100px]" // Consistent sizing
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                placeholder="Write a short bio about yourself"
                                                 disabled={loading}
                                            />
                                        ) : (
                                             <div className="flex gap-2 p-2.5 border border-border rounded-md bg-muted min-h-[100px]">
                                                 <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                                                 <span className="text-sm text-foreground">{userData.bio || 'No bio provided.'}</span>
                                             </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                             {/* Form submission button moved to header, but form tag wraps content */}
                        </form>
                    </CardContent>
                </Card>

                {/* Delete Account Card */}
                <Card className="border-destructive"> {/* Highlight card border */}
                     <CardHeader>
                          {/* Use CardTitle and optionally CardDescription */}
                         <CardTitle className="text-destructive flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5"/> Alert
                         </CardTitle>
                          <CardDescription className="text-destructive/90">
                               Critical actions that require confirmation.
                          </CardDescription>
                     </CardHeader>
                    <CardContent>
                        {showDeleteConfirm ? (
                             <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 space-y-3">
                                  <div className="flex items-start gap-3">
                                       <div className="flex-shrink-0 text-destructive pt-0.5">
                                            <AlertTriangle className="h-5 w-5" />
                                       </div>
                                       <div>
                                            <h3 className="text-sm font-medium text-destructive">Are you sure you want to delete your account?</h3>
                                            <p className="mt-1 text-sm text-destructive/80">
                                                 This action cannot be undone. All of your data will be permanently removed.
                                            </p>
                                       </div>
                                  </div>
                                  <div className="flex justify-end space-x-3">
                                       <Button
                                            type="button"
                                            variant="outline" // Secondary action style
                                            onClick={() => setShowDeleteConfirm(false)}
                                             disabled={loading}
                                       >
                                            Cancel
                                       </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={handleDeleteAccount}
                                             disabled={loading}
                                        >
                                            {loading ? 'Deleting...' : 'Yes, delete my account'}
                                        </Button>
                                  </div>
                             </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-semibold text-foreground">Delete account</h3> {/* Slightly less prominent than CardTitle */}
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    variant="destructive"
                                    className="w-full sm:w-auto" // Full width on small screens
                                     disabled={loading}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

export default Account;