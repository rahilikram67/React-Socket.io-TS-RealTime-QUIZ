import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Login from './pages/Login/Login';
import Admin from './pages/Admin/Admin';
import Student from './pages/Student/Student';
import LoginContext from './hooks/loginContext';
import { useState } from 'react';
import Results from './pages/Results/Results';
function App() {
  const [login, setLogin] = useState("")
  return <LoginContext.Provider value={{ login, setLogin }}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/student" element={<Student />} />
        <Route path="/results" element={<Results />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  </LoginContext.Provider>
}

export default App;
