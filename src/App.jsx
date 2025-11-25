import Sidebar from "./components/Sidebar1"
import Header from "./components/Header1"
import { useState } from "react"
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";

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
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App 