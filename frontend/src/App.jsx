import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import { Routes,Route } from "react-router-dom"


function App() {
  

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/signup" element={<Register/>} />
      <Route path="/Login" element={<Login/>} />

    </Routes>
      
     
 </>
  )
}

export default App
