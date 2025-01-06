import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import { Routes,Route } from "react-router-dom"


function App() {
  

  return (
    <>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<Register/>} />
      <Route path="/Home" element={<Home/>} />

    </Routes>
      
     
 </>
  )
}

export default App
