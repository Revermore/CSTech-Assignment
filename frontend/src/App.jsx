import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./UserContext.jsx";

import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminSignupForm from "./pages/AdminSignupForm.jsx";
import AgentForm from "./pages/AgentForm.jsx";
import LoginForm from "./pages/LoginForm.jsx";
import UploadFilePage from "./pages/UploadFile.jsx";
import AgentDashboard from "./pages/AgentDashboard.jsx";
import AdminTaskView from "./pages/AdminTaskView.jsx";

function DashboardLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/add-agent" element={<AgentForm />} />
          <Route path="/upload" element={<UploadFilePage />} />
          <Route path="/view" element={<AdminTaskView/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
function AgentLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<AgentDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<AdminSignupForm />} />
          <Route path="/" element={<LoginForm />} />

          {/* Dashboard Layout (protected in future) */}
          <Route path="/dashboard/*" element={<DashboardLayout />} />
          <Route path="/agent-dashboard/*" element={<AgentLayout />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
