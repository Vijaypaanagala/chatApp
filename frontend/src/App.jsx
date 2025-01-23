import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        {/* Redirect from "/" to "/Login" */}
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
