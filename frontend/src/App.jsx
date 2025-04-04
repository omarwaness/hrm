import Page from "./pages/page"
import Login from "./pages/login"
import Jobs from "./pages/jobs"
import Employee from "./pages/employee"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import CreateAccount from "./pages/createAccount"
import ForgotPassword from "./components/forgot-password-page"
import Settings from "./pages/settings"


// This is new
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password-page" element={<ForgotPassword />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/createAccount" element={< CreateAccount/>} />
        <Route path="/settings" element={<Settings/>} />
      </Routes>
    </Router>
  )
}

export default App
