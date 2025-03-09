import { Button } from "@/components/ui/button"
import Page from "./pages/page"
import LoginPage from "./pages/login"
import Jobs from "./pages/jobs"
import Employee from "./pages/employee"
import ForgotPassword from "./components/forgot-password-page";



function App() {
  return (
    <>
      <Employee></Employee>
      <LoginPage></LoginPage>
      <ForgotPassword></ForgotPassword>

    </>
  )
}

export default App
