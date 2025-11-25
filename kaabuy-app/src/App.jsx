import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import { useState } from "react"
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Product";
import Settings from "./pages/Settings";

const App = () =>{
  const [sidebarToggle, setSidebarToggle] = useState(true);

  function toggleSidebar(){
    setSidebarToggle(!sidebarToggle)
  }

  return (
    <div className="flex-1 flex h-screen bg-gray-100">
    <Sidebar isOpen = {sidebarToggle} />
      <div className="flex-1 flex flex-col ">
        <Header onSidebarToggle = {toggleSidebar}/>
        <main className="flex-1 bg-slate-200">
          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/products" element={<Products/>}/>
            <Route path="/settings" element={<Settings/>}/>
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App 