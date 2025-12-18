import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./Authpage";
import Dashboard from "./Dashboard";
import MemberProfile from "./MemberProfile";
import "./App.css"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/:id" element={<MemberProfile />} />
      </Routes>
    </BrowserRouter>
  );
}



