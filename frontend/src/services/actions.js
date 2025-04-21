"use server"

import { jwtDecode } from "jwt-decode"

export async function getEmployeeContract(token) {
  // Simulate database fetch delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  if (!token) {
    throw new Error("Missing authentication token")
  }

  const decoded = jwtDecode(token)

  const userData = {
    firstName: decoded.firstName || "",
    lastName: decoded.lastName || "",
    email: decoded.email || "",
    phone: decoded.phoneNumber || "",
    joinDate: decoded.createAt
      ? new Date(decoded.createAt.replace(/(\+\d{2}):(\d{2})$/, '+$1$2'))
      : new Date(),
    role: decoded.role || "",
  }

  return {
    id: decoded.id,
    title: "Employment Contract",
    position: userData.role,
    salary: "$85,000 per annum",
    startDate: userData.joinDate.toLocaleDateString(),
    endDate: "",
    userData,
    content: `EMPLOYMENT AGREEMENT

This Employment Agreement (the "Agreement") is made and effective as of ${userData.joinDate.toLocaleDateString()}, by and between Acme Corporation ("Employer") and ${userData.firstName} ${userData.lastName} ("Employee").

1. EMPLOYMENT
Employer agrees to employ Employee as a ${userData.role}. Employee accepts employment with Employer on the terms and conditions set forth in this Agreement.

2. TERM
The term of this Agreement shall begin on ${userData.joinDate.toLocaleDateString()} and shall continue until terminated in accordance with the provisions of this Agreement.

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
