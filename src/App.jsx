import Sidebar from "./components/Sidebar1"
import Header from "./components/Header1"
import { useState } from "react"
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Transactions from "./pages/Transactions";
import Customers from "./pages/Customers";
import POS from "./pages/POS";
import Restock from "./pages/Restock";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () =>{
  const [sidebarToggle, setSidebarToggle] = useState(true);

  function toggleSidebar(){
    setSidebarToggle(!sidebarToggle)
  }

  return (
    <Routes>
      <Route path="/login" element={<Auth/>} />
      <Route path="/register" element={<Auth/>} />
      <Route path="/*" element={(
      <ProtectedRoute>
        <div className="flex-1 flex h-screen bg-gray-100">
        <Sidebar isOpen={sidebarToggle} onToggle={toggleSidebar} />
          <div className="flex-1 flex flex-col ">
            <Header/>
            <main className="flex-1 bg-slate-200">
              <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/pos" element={<POS/>}/>
                <Route path="/products" element={<Products/>}/>
                <Route path="/inventory" element={<Inventory/>}/>
                <Route path="/restock" element={<Restock/>}/>
                <Route path="/transactions" element={<Transactions/>}/>
                <Route path="/customers" element={<Customers/>}/>
              </Routes>
            </main>
          </div>
        </div>
      </ProtectedRoute>
      )}/>
    </Routes>
  )
}

export default App 