import React, { useState ,useEffect} from "react";
import { Card, CardContent } from "@/components/ui/card"; // Assuming Card is installed
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; 
import Loading from "../Loading";
import { Trash2 } from "lucide-react";

export default function EmployeeList() {
  const [isLoading,setIsLoading]=useState(false)
  const [employees, setEmployees] = useState([]);
  const initialEmployees = async () => {
    
   setIsLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/user/');
      
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }finally{
      setIsLoading(false)
    }
  };
  
  useEffect(() => {
    initialEmployees();
  }, []);
  

  // Simplified delete function, accepts the ID directly
  const handleDeleteEmployee = async (idToDelete) =>  { 
    console.log('cc')
  try {
    const res = await fetch(`http://localhost:5000/api/user/${idToDelete}`, {
      method: 'DELETE',
    });
    
    if (res.ok) {
      console.log('delted')
    }
  } catch(err) {
    console.log(err)
  }}
  if(isLoading)
    return <Loading />
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Employee Directory</h1>
        <p className="text-base text-slate-600 dark:text-slate-200 mb-6">View and manage employee records</p>
        <div className="grid gap-4">
          {employees.map((employee) => (
            <Card key={employee.id} className="relative">
              {}
              <AlertDialog>
                {/* The Button is now the trigger */}
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    aria-label={`Delete ${employee.firstName} ${employee.lastName}`} // Good for accessibility
                  >
                    <Trash2 size={18} />
                  </Button>
                </AlertDialogTrigger>

                {/* Content of the confirmation dialog */}
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the record for{" "}
                      <span className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </span>
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    {/* Cancel button automatically closes the dialog */}
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {/* Action button performs the deletion */}
                    <AlertDialogAction
                      onClick={() => handleDeleteEmployee(employee._id)} // Call delete handler with the specific employee's ID
                      className="bg-red-600 hover:bg-red-700" // Use destructive variant styling often associated with delete
                      // or use variant="destructive" if your Button component supports it directly in AlertDialogAction
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Rest of the Card content */}
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 pt-10"> {/* Added pt-10 to avoid overlap with button */}
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">First Name</p>
                  <p className="font-medium text-slate-900 dark:text-white">{employee.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Last Name</p>
                  <p className="font-medium text-slate-900 dark:text-white">{employee.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                  <p className="font-medium text-slate-900 dark:text-white">{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                  <p className="font-medium text-slate-900 dark:text-white">{employee.phoneNumber}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}