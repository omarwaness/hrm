import Page from "./pages/page"
import Login from "./pages/login"
import Jobs from "./pages/jobs"
import Employee from "./pages/employee"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import CreateAccount from "./pages/createAccount"
import ForgotPassword from "./components/forgot-password-page"
import Settings from "./pages/settings"
import Admin from "./pages/admin"
import Manager from "./pages/manager"
import AboutUs from "./pages/Aboutus"


// This is new
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/manager" element={<Manager/>} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={< CreateAccount/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="AboutUs" element={<AboutUs/>}/>
      </Routes>
    </Router>
  )
}

export default App
