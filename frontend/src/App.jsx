import { Button } from "@/components/ui/button"
import Page from "./pages/page"
import Login from "./pages/login"
import Jobs from "./pages/jobs"
import Employee from "./pages/employee"
import Dashboard from "./pages/dashboard"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// This is new
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
