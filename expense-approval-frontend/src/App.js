import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header.js";
import Footer from "./components/footer.js";
import Dashboard from "./components/dashboard.js";
import Registration from "./components/Registration.js";
import Login from "./components/login.js"; 



function App() {
  return (
    <Router>
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="min-h-[calc(100vh-100px)]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} /> 

         
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
