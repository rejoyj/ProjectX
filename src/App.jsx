import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./Authpage";
import Dashboard from "./Dashboard";
import "./App.css"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}



