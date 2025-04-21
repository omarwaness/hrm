"use client"

import { useState, useEffect } from "react"
import { Pencil, Save, X, User, Mail, Phone, Calendar, FileText, AlertTriangle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import Loading from "./Loading";
const Account = () => {
  const navigate = useNavigate()
  const [loading,setLoading]=useState(false)
  // Add user data initialization with error handling
  const [user, setUser] = useState(null)
  
  // Safe user data initialization
  useEffect(() => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }
      
      const decodedUser = jwtDecode(token)
      setUser(decodedUser)
    } catch (error) {
      console.error("Error decoding token:", error)
      localStorage.removeItem('token')
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }, [navigate])
  
  // Initialize userData only after user has been loaded
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    joinDate: new Date(),
    role: "",
    bio: "Experienced software developer with 5+ years of experience in web development and cloud technologies.",
    profileImage: "/placeholder.svg?height=100&width=100",
  })
  
  // Update userData when user is loaded
  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        joinDate: user.createAt ? new Date(user.createAt.replace(/(\+\d{2}):(\d{2})$/, '+$1$2')) : new Date(),
        role: user.role || "",
        bio: "Experienced software developer with 5+ years of experience in web development and cloud technologies.",
        profileImage: "/placeholder.svg?height=100&width=100",
      })
    }
  }, [user])

  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({})
  
  // Update formData when userData changes
  useEffect(() => {
    setFormData({ ...userData })
  }, [userData])
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    
    try {
      const res = await fetch(`http://localhost:5000/api/user/${user.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phone, 
          role: user.role,
          createdAt: user.createAt
        }), 
        credentials: 'include',
      })
      
      if(res.ok) {
        // Properly handle the JSON response
        const data = await res.json()
        localStorage.removeItem('token')
        localStorage.setItem('token', data.token)
        
        try {
          const newUser = jwtDecode(data.token)
          setUser(newUser)
        } catch (err) {
          console.error("Error decoding new token:", err)
        }
        
        // Update local state with the new data
        setUserData({ ...formData })
        setEditMode(false)
      }
    } catch(err) {
      console.log(err)
    }
  }

  const cancelEdit = () => {
    setFormData({ ...userData })
    setEditMode(false)
  }

  async function handleDeleteAccount() {
    if (!user) return
    
    try {
      const res = await fetch(`http://localhost:5000/api/user/${user.id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        localStorage.removeItem('token');
        navigate('/')
      }
    } catch(err) {
      console.log(err)
    }
  }
  
  // Show loading state while user data is being fetched
  if (loading) {
    return <Loading />
  }
  
  // Redirect if no user (handled in useEffect, but this is a safeguard)
  if (!user && !loading) {
    return null
  }
 
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Account</h1>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md shadow-sm hover:bg-accent transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md shadow-sm hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="bg-card shadow-sm rounded-lg overflow-hidden border border-border">
          <div className="border-b border-border bg-muted px-6 py-4">
            <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
            <p className="text-muted-foreground text-sm">Manage your personal details and contact information</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center gap-4 lg:w-1/5">
                <div className="h-32 w-32 rounded-full bg-muted overflow-hidden border-4 border-background shadow">
                  <img
                    src={userData.profileImage || "/placeholder.svg"}
                    alt={`${userData.firstName} ${userData.lastName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                {editMode && (
                  <button className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent w-full">Change Photo</button>
                )}
              </div>

              {/* Form Fields Section */}
              <div className="flex-1">
                <form className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                        First Name
                      </label>
                      {editMode ? (
                        <input
                          id="firstName"
                          name="firstName"
                          className="w-full p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-input"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 border border-border rounded-md bg-muted">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <span className="text-foreground">{userData.firstName}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                        Last Name
                      </label>
                      {editMode ? (
                        <input
                          id="lastName"
                          name="lastName"
                          className="w-full p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-input"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 border border-border rounded-md bg-muted">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <span className="text-foreground">{userData.lastName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-foreground">
                        Email
                      </label>
                      {editMode ? (
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="w-full p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-input"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 border border-border rounded-md bg-muted">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <span className="text-foreground">{userData.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                        Phone Number
                      </label>
                      {editMode ? (
                        <input
                          id="phone"
                          name="phone"
                          className="w-full p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-input"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 border border-border rounded-md bg-muted">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <span className="text-foreground">{userData.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Role and Join Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="role" className="block text-sm font-medium text-foreground">
                        Role
                      </label>
                      <div className="flex items-center gap-2 p-3 border border-border rounded-md bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="text-foreground">{userData.role}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="joinDate" className="block text-sm font-medium text-foreground">
                        Join Date
                      </label>
                      <div className="flex items-center gap-2 p-3 border border-border rounded-md bg-muted">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="text-foreground">{new Date(userData.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-foreground">
                      Bio
                    </label>
                    {editMode ? (
                      <textarea
                        id="bio"
                        name="bio"
                        rows="4"
                        className="w-full p-3 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-input"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Write a short bio about yourself"
                      ></textarea>
                    ) : (
                      <div className="flex gap-2 p-3 border border-border rounded-md bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                        <span className="text-foreground">{userData.bio}</span>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-card shadow-sm rounded-lg overflow-hidden border border-border">
          <div className="border-b border-border bg-muted px-6 py-4">
            <h2 className="text-xl font-semibold text-destructive">Alert!</h2>
            <p className="text-destructive/80 text-sm">Actions in this section cannot be undone</p>
          </div>
          <div className="p-6">
            {showDeleteConfirm ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-destructive">Are you sure you want to delete your account?</h3>
                    <div className="mt-2 text-sm text-destructive/80">
                      <p>This action cannot be undone. All of your data will be permanently removed.</p>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteAccount}
                      >
                        Yes, delete my account
                      </Button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="inline-flex items-center px-3 py-2 border border-border shadow-sm text-sm leading-4 font-medium rounded-md text-foreground bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Delete account</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account