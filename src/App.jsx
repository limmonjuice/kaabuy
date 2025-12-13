import Sidebar from "./components/Sidebar1"
import Header from "./components/Header1"
import { useState } from "react"
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Transactions from "./pages/Transactions";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import POS from "./pages/POS";
import Restock from "./pages/Restock";
import Staff from "./pages/Staff";
import Auth from "./pages/Auth";
import ChangeCredentials from "./pages/ChangeCredentials";
import ProtectedRoute from "./components/ProtectedRoute";


import RoleRoute from "./components/RoleRoute";

const App = () => {
  const [sidebarToggle, setSidebarToggle] = useState(true);

  function toggleSidebar() {
    setSidebarToggle(!sidebarToggle)
  }

  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/change-credentials" element={
        <ProtectedRoute>
          <ChangeCredentials />
        </ProtectedRoute>
      } />
      <Route path="/*" element={(
        <ProtectedRoute>
          <div className="flex-1 flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarToggle} onToggle={toggleSidebar} />
            <div className="flex-1 flex flex-col ">
              <Header />
              <main className="flex-1 bg-slate-200">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/pos" element={<POS />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/restock" element={
                    <RoleRoute allowedRoles={['owner']}>
                      <Restock />
                    </RoleRoute>
                  } />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/suppliers" element={
                    <RoleRoute allowedRoles={['owner']}>
                      <Suppliers />
                    </RoleRoute>
                  } />
                  <Route path="/staff" element={
                    <RoleRoute allowedRoles={['owner']}>
                      <Staff />
                    </RoleRoute>
                  } />
                </Routes>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      )} />
    </Routes>
  )
}

export default App 