import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

function UpdateEmployee() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    role: "",
    email: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  // Mock employee data - would be replaced with API calls in production
  const mockEmployees = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', role: 'developer' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phone: '987-654-3210', role: 'designer' },
    { id: '3', firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@example.com', phone: '555-123-4567', role: 'manager' },
    { id: '4', firstName: 'Sarah', lastName: 'Williams', email: 'sarah.williams@example.com', phone: '444-333-2222', role: 'hr' },
    { id: '5', firstName: 'David', lastName: 'Brown', email: 'david.brown@example.com', phone: '111-222-3333', role: 'marketing' },
    { id: '6', firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@example.com', phone: '777-888-9999', role: 'sales' },
    { id: '7', firstName: 'Robert', lastName: 'Miller', email: 'robert.miller@example.com', phone: '555-444-3333', role: 'developer' },
    { id: '8', firstName: 'Jennifer', lastName: 'Wilson', email: 'jennifer.wilson@example.com', phone: '222-333-4444', role: 'designer' },
    { id: '9', firstName: 'Michael', lastName: 'Taylor', email: 'michael.taylor@example.com', phone: '666-777-8888', role: 'manager' },
    { id: '10', firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.anderson@example.com', phone: '999-888-7777', role: 'hr' }
  ];

  // Filter employees as user types
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
    } else {
      setIsSearching(true);
      const filteredEmployees = mockEmployees.filter(emp => 
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredEmployees);
    }
  }, [searchQuery]);

  // The form submission is now just a fallback
  const handleSearch = (e) => {
    e.preventDefault();
    // No need to do anything as the search is handled by the useEffect
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      phone: employee.phone,
      role: employee.role,
      email: employee.email
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user edits
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
    
    if (errors.role) {
      setErrors(prev => ({
        ...prev,
        role: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.role) newErrors.role = "Role is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Employee data updated:', formData);
      setShowSuccess(true);
      setIsSubmitting(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Get all employees in alphabetical order by last name then first name
  const getAllEmployeesSorted = () => {
    return [...mockEmployees].sort((a, b) => {
      // First sort by last name
      const lastNameComparison = a.lastName.localeCompare(b.lastName);
      // If last names are the same, sort by first name
      if (lastNameComparison === 0) {
        return a.firstName.localeCompare(b.firstName);
      }
      return lastNameComparison;
    });
  };

  return (
    <div className="w-full">
      {/* Search Section */}
      <Card className="w-full mb-6 shadow-md">
        <CardHeader className="bg-slate-50 dark:bg-black">
          <CardTitle className="text-xl">Find Employee</CardTitle>
          <CardDescription>
            Search for an employee to update their information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          {/* Show search results if they exist, otherwise show all employees if not searching */}
          {isSearching ? (
            searchResults.length > 0 ? (
              <div className="mt-4 border rounded-md">
                <div className="p-2 bg-slate-50 dark:bg-black font-medium">
                  Search Results
                </div>
                <div className="divide-y">
                  {searchResults.map((emp) => (
                    <div 
                      key={emp.id} 
                      className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center"
                      onClick={() => handleSelectEmployee(emp)}
                    >
                      <div>
                        <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                        <div className="text-sm text-muted-foreground">{emp.email}</div>
                      </div>
                      <Button variant="outline" size="sm">Select</Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md dark:bg-amber-950 dark:text-amber-200">
                No employees found matching your search.
              </div>
            )
          ) : (
            <div className="mt-4 border rounded-md">
              <div className="p-2 bg-slate-50 dark:bg-black font-medium">
                All Employees
              </div>
              <div className="divide-y max-h-60 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {getAllEmployeesSorted().map((emp) => (
                  <div 
                    key={emp.id} 
                    className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center"
                    onClick={() => handleSelectEmployee(emp)}
                  >
                    <div>
                      <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                      <div className="text-sm text-muted-foreground">{emp.email}</div>
                    </div>
                    <Button variant="outline" size="sm">Select</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Form Section */}
      {selectedEmployee && (
        <Card className="w-full shadow-lg border-2">
          <CardHeader className="p-6 bg-slate-50 dark:bg-black">
            <CardTitle className="text-2xl font-bold">Update Employee: {selectedEmployee.firstName} {selectedEmployee.lastName}</CardTitle>
            <CardDescription className="text-base mt-2">
              Update the employee's information below
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {showSuccess && (
              <Alert className="mb-6 bg-green-50 text-green-800 border-green-200 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-3 text-green-500" />
                  <AlertDescription className="text-lg font-medium">
                    Employee information was successfully updated.
                  </AlertDescription>
                </div>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className={`text-base ${errors.firstName ? "text-red-500" : ""}`}>
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    className={`p-4 h-12 text-base ${errors.firstName ? "border-red-500" : ""}`}
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className={`text-base ${errors.lastName ? "text-red-500" : ""}`}>
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    className={`p-4 h-12 text-base ${errors.lastName ? "border-red-500" : ""}`}
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className={`text-base ${errors.email ? "text-red-500" : ""}`}>
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className={`p-4 h-12 text-base ${errors.email ? "border-red-500" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className={`text-base ${errors.phone ? "text-red-500" : ""}`}>
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="123-456-7890"
                    className={`p-4 h-12 text-base ${errors.phone ? "border-red-500" : ""}`}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="role" className={`text-base ${errors.role ? "text-red-500" : ""}`}>
                  Role
                </Label>
                <Select onValueChange={handleRoleChange} value={formData.role}>
                  <SelectTrigger className={`p-4 text-base h-12 ${errors.role ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="text-base">
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>
              
              <div className="pt-4 flex space-x-4">
                <Button 
                  type="submit" 
                  className="h-12 text-base font-semibold bg-primary hover:bg-primary/90 flex-1" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Employee"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  className="h-12 text-base font-semibold flex-1" 
                  onClick={() => setSelectedEmployee(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-slate-50 p-4 flex justify-center dark:bg-black">
            <p className="text-sm text-slate-500 dark:text-slate-200">All employee information will be securely stored</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default UpdateEmployee;
