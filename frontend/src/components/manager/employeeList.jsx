import React, { useState } from "react";
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
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { Trash2 } from "lucide-react";

const initialEmployees = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
  },
  // Add more employees if needed for testing
  {
    id: 3,
    firstName: "Peter",
    lastName: "Jones",
    email: "peter.jones@example.com",
    phone: "555-123-4567",
  },
];

export default function EmployeeList() {
  const [employees, setEmployees] = useState(initialEmployees);

  // Simplified delete function, accepts the ID directly
  const handleDeleteEmployee = (idToDelete) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== idToDelete)
    );
    // Optional: Add a notification/toast message here confirming deletion
    console.log(`Employee with ID ${idToDelete} deleted.`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Employee Directory</h1>
        <div className="grid gap-4">
          {employees.map((employee) => (
            <Card key={employee.id} className="relative">
              {/* AlertDialog wraps the trigger and content */}
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
                      onClick={() => handleDeleteEmployee(employee.id)} // Call delete handler with the specific employee's ID
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
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium">{employee.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium">{employee.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{employee.phone}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}