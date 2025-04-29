"use client"

import { useState, useEffect, useRef } from "react"
import { Pencil, Save, X, User, Mail, Phone, Calendar, FileText, AlertTriangle, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import Loading from "./Loading";

const Account = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const fileInputRef = useRef(null)

    // Initialize userData with default structure
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        joinDate: new Date(),
        role: "",
        bio: "",
        profileImage: "/placeholder.svg?height=100&width=100",
    })

    // Use formData for edits, initialized from userData
    const [formData, setFormData] = useState({})

    // Fetch and decode user token
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

    // Populate userData and formData once user is decoded
    useEffect(() => {
        if (user) {
            const initialData = {
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phoneNumber || "",
                joinDate: user.createdAt ? new Date(user.createdAt) : new Date(), // Fixed typo: createAt -> createdAt
                role: user.role || "",
                bio: user.bio || "Experienced software developer with 5+ years of experience.",
                profileImage: user.profileImage || "/placeholder.svg?height=100&width=100",
            };
            setUserData(initialData);
            setFormData(initialData);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, or GIF)');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('File size exceeds 5MB limit');
            return;
        }
        
        setUploadingAvatar(true);
        
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            
            const res = await fetch(`http://localhost:5000/api/user/${user.id}/avatar`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            
            if (res.ok) {
                const data = await res.json();
                
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    
                    try {
                        const updatedUser = jwtDecode(data.token);
                        setUser(updatedUser);
                        
                        // Update the profile image in our state
                        setUserData(prev => ({
                            ...prev,
                            profileImage: updatedUser.profileImage
                        }));
                        
                        setFormData(prev => ({
                            ...prev,
                            profileImage: updatedUser.profileImage
                        }));
                        
                    } catch (decodeError) {
                        console.error("Error decoding new token:", decodeError);
                        localStorage.removeItem('token');
                        navigate('/login');
                    }
                }
            } else {
                const errorData = await res.json();
                console.error("Failed to upload avatar:", errorData.message || res.statusText);
                alert("Failed to upload avatar. Please try again.");
            }
        } catch (err) {
            console.error("Error uploading avatar:", err);
            alert("Error uploading avatar. Please try again.");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
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
              profileImage: formData.profileImage,
            }),
            credentials: 'include',
          });
      
          if (res.ok) {
            const data = await res.json();
      
            if (data.token) {
              localStorage.setItem('token', data.token);
      
              try {
                const updatedUser = jwtDecode(data.token);
                setUser(updatedUser);
                setUserData({
                  firstName: updatedUser.firstName || "",
                  lastName: updatedUser.lastName || "",
                  email: updatedUser.email || "",
                  phone: updatedUser.phoneNumber || "",
                  joinDate: updatedUser.createdAt ? new Date(updatedUser.createdAt) : new Date(), // Fixed typo: createAt -> createdAt
                  role: updatedUser.role || "",
                  bio: updatedUser.bio || "Experienced software developer with 5+ years of experience.",
                  profileImage: updatedUser.profileImage || "/placeholder.svg?height=100&width=100",
                });
              } catch (decodeError) {
                console.error("Error decoding new token:", decodeError);
                localStorage.removeItem('token');
                navigate('/login');
              }
            } else {
              console.warn("No new token received, keeping old data.");
            }
      
            setEditMode(false);
          } else {
            const errorData = await res.json();
            console.error("Failed to update user:", errorData.message || res.statusText);
            alert("Failed to update profile. Please try again.");
          }
        } catch (err) {
          console.error("Error submitting user update:", err);
          alert("Error updating profile. Please try again.");
        } finally {
          setLoading(false);
        }
      };

    const cancelEdit = () => {
        setFormData({ ...userData });
        setEditMode(false);
    };

    async function handleDeleteAccount() {
        if (!user || !user.id) return;
         setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/user/${user.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                localStorage.removeItem('token');
                setUser(null);
                navigate('/');
            } else {
                 const errorData = await res.json();
                 console.error("Failed to delete account:", errorData.message || res.statusText);
                 alert("Failed to delete account. Please try again.");
            }
        } catch (err) {
            console.error("Error deleting account:", err);
            alert("Error deleting account. Please try again.");
        } finally {
             setLoading(false);
             setShowDeleteConfirm(false);
        }
    }

    if (loading || !user) {
        return <Loading />;
    }

    return (
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
                        <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Profile Image Section */}
                                

                                {/* Form Fields Section */}
                                <div className="flex-1 space-y-6">
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="firstName">First Name</Label>
                                            {editMode ? (
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    disabled={loading}
                                                    required
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2 p-2.5 border border-border rounded-md bg-muted min-h-[40px]">
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
                                                    required
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
                                                    required
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
                                                <span className="text-sm text-foreground">{userData.role || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="joinDate">Join Date</Label>
                                            <div className="flex items-center gap-2 p-2.5 border border-border rounded-md bg-muted min-h-[40px]">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-foreground">
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
                                                className="min-h-[100px]"
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
                        </form>
                    </CardContent>
                </Card>

                {/* Delete Account Card */}
                <Card className="border-destructive">
                    <CardHeader>
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
                                        variant="outline"
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
                                    <h3 className="text-base font-semibold text-foreground">Delete account</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    variant="destructive"
                                    className="w-full sm:w-auto"
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