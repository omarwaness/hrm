import React, { useState } from 'react';
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

function AddEmployee() {
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
      console.log('Employee data submitted:', formData);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        role: "",
        email: ""
      });
      
      setIsSubmitting(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-2">
      <CardHeader className="p-8 bg-slate-50 dark:bg-black">
        <CardTitle className="text-3xl font-bold text-center text-slate-900 dark:text-white">Add New Employee</CardTitle>
        <CardDescription className="text-center text-base mt-2 text-slate-600 dark:text-slate-200">
          Enter the details of the new employee to add them to the system.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        {showSuccess && (
          <Alert className="mb-8 bg-green-50 text-green-800 border-green-200 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 mr-3 text-green-500" />
              <AlertDescription className="text-lg font-medium">
                Employee {formData.firstName} {formData.lastName} was successfully added.
              </AlertDescription>
            </div>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="firstName" className={`text-lg ${errors.firstName ? "text-red-500" : ""}`}>
                First Name
              </Label>
              <Input 
                id="firstName"
                name="firstName"
                placeholder="John" 
                value={formData.firstName}
                onChange={handleChange}
                className={`p-6 text-lg h-14 ${errors.firstName ? "border-red-500" : ""}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="lastName" className={`text-lg ${errors.lastName ? "text-red-500" : ""}`}>
                Last Name
              </Label>
              <Input 
                id="lastName"
                name="lastName"
                placeholder="Doe" 
                value={formData.lastName}
                onChange={handleChange}
                className={`p-6 text-lg h-14 ${errors.lastName ? "border-red-500" : ""}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="email" className={`text-lg ${errors.email ? "text-red-500" : ""}`}>
              Email
            </Label>
            <Input 
              id="email"
              name="email"
              type="email" 
              placeholder="john.doe@example.com" 
              value={formData.email}
              onChange={handleChange}
              className={`p-6 text-lg h-14 ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="phone" className={`text-lg ${errors.phone ? "text-red-500" : ""}`}>
              Phone Number
            </Label>
            <Input 
              id="phone"
              name="phone"
              placeholder="(123) 456-7890" 
              value={formData.phone}
              onChange={handleChange}
              className={`p-6 text-lg h-14 ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="role" className={`text-lg ${errors.role ? "text-red-500" : ""}`}>
              Role
            </Label>
            <Select onValueChange={handleRoleChange} value={formData.role}>
              <SelectTrigger className={`p-6 text-lg h-14 ${errors.role ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="text-lg">
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
          
          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Employee"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="bg-slate-50 p-6 flex justify-center dark:bg-black">
        <p className="text-sm text-slate-500 dark:text-slate-200">All employee information will be securely stored</p>
      </CardFooter>
    </Card>
  );
}

export default AddEmployee;