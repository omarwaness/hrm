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
import Loading from "../Loading";

function UpdateEmployee() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
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

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/user/');
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);

  // Filter employees as user types
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
    } else {
      setIsSearching(true);
      const filteredEmployees = employees.filter(emp => 
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredEmployees);
    }
  }, [searchQuery, employees]);

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
      phone: employee.phoneNumber || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(selectedEmployee._id) 
    
    setIsSubmitting(true);
    
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Employee data updated:', formData);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      const res = await fetch(`http://localhost:5000/api/user/${selectedEmployee._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phone, 
          role: selectedEmployee.role,
          createdAt: selectedEmployee.createdAt
        }), 
        credentials: 'include',
      })
    } catch (error) {
      console.error("Error updating employee:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get all employees in alphabetical order by last name then first name
  const getAllEmployeesSorted = () => {
    return [...employees].sort((a, b) => {
      // Handle cases where lastName might be undefined
      const lastNameA = a.lastName || '';
      const lastNameB = b.lastName || '';
      
      // First sort by last name
      const lastNameComparison = lastNameA.localeCompare(lastNameB);
      
      // If last names are the same, sort by first name
      if (lastNameComparison === 0) {
        const firstNameA = a.firstName || '';
        const firstNameB = b.firstName || '';
        return firstNameA.localeCompare(firstNameB);
      }
      return lastNameComparison;
    });
  };

  if(isLoading) {
    return <Loading />;
  }

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
                      key={emp._id} 
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
                    key={emp._id} 
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
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="Candidate">Candidate</SelectItem>
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