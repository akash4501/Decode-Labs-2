import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/ToastContainer";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-slate-50">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </div>
        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
