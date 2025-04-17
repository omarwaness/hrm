"use server"
import { jwtDecode } from "jwt-decode"
// This is a mock database function
// In a real application, you would connect to your database here
export async function getEmployeeContract() {
  // Simulate database fetch delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock contract data
  const user=jwtDecode(localStorage.getItem('token'))
  return {
    id: user.id,
    title: "Employment Contract",
    position: user.role,
    salary: "$85,000 per annum",
    startDate: new Date(user.createAt).toLocaleDateString()
    ,
    endDate: "",
    content: `EMPLOYMENT AGREEMENT

This Employment Agreement (the "Agreement") is made and effective as of January 15, 2023, by and between Acme Corporation ("Employer") and John Doe ("Employee").

1. EMPLOYMENT
Employer agrees to employ Employee as a Software Developer. Employee accepts employment with Employer on the terms and conditions set forth in this Agreement.

2. TERM
The term of this Agreement shall begin on January 15, 2023 and shall continue until terminated in accordance with the provisions of this Agreement.

3. COMPENSATION
As compensation for the services provided by Employee under this Agreement, Employer will pay Employee an annual salary of $85,000, payable in accordance with Employer's normal payroll procedures.

4. BENEFITS
Employee shall be entitled to participate in all benefit programs provided to employees of Employer, including health insurance, retirement plans, and paid time off.

5. CONFIDENTIALITY
Employee acknowledges that during employment, Employee will have access to confidential information. Employee agrees to maintain the confidentiality of all such information both during and after employment.

6. TERMINATION
Either party may terminate this Agreement with 30 days' written notice to the other party.

7. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the State of California.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.`,
  }
}

