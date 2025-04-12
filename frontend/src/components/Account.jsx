"use client"

import { useState } from "react"
import { Pencil, Save, X, User, Mail, Phone, Calendar, FileText, AlertTriangle, Trash2 } from "lucide-react"

const Account = () => {
  // Static user data
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2021-05-15",
    role: "Employee", // Role field (unchangeable)
    bio: "Experienced software developer with 5+ years of experience in web development and cloud technologies.", // Bio field
    profileImage: "/placeholder.svg?height=100&width=100",
  })

  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ ...userData })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setUserData({ ...formData })
    setEditMode(false)
  }

  const cancelEdit = () => {
    setFormData({ ...userData })
    setEditMode(false)
  }

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    alert("Account deletion would be processed here")
    setShowDeleteConfirm(false)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            <p className="text-gray-500 text-sm">Manage your personal details and contact information</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center gap-4 lg:w-1/5">
                <div className="h-32 w-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow">
                  <img
                    src={userData.profileImage || "/placeholder.svg"}
                    alt={`${userData.firstName} ${userData.lastName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                {editMode && (
                  <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 w-full">Change Photo</button>
                )}
              </div>

              {/* Form Fields Section */}
              <div className="flex-1">
                <form className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      {editMode ? (
                        <input
                          id="firstName"
                          name="firstName"
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-800">{userData.firstName}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      {editMode ? (
                        <input
                          id="lastName"
                          name="lastName"
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-800">{userData.lastName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      {editMode ? (
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-800">{userData.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      {editMode ? (
                        <input
                          id="phone"
                          name="phone"
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-800">{userData.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Role and Join Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-800">{userData.role}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
                        Join Date
                      </label>
                      <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-800">{new Date(userData.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio Field */}
                  <div className="space-y-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    {editMode ? (
                      <textarea
                        id="bio"
                        name="bio"
                        rows="4"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Write a short bio about yourself"
                      ></textarea>
                    ) : (
                      <div className="flex gap-2 p-3 border rounded-md bg-gray-50">
                        <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                        <span className="text-gray-800">{userData.bio}</span>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 bg-white-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-red-800">Alert!</h2>
            <p className="text-red-600 text-sm">Actions in this section cannot be undone</p>
          </div>

          <div className="p-6">
            {showDeleteConfirm ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Are you sure you want to delete your account?</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>This action cannot be undone. All of your data will be permanently removed.</p>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Yes, delete my account
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
                  <h3 className="text-lg font-medium text-gray-900">Delete account</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account