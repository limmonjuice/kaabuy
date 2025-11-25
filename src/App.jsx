import Sidebar from "./components/Sidebar1"
import Header from "./components/Header1"
import { useState } from "react"

const App = () =>{
  const [sidebarToggle, setSidebarToggle] = useState(true);

  function toggleSidebar(){
    setSidebarToggle(!sidebarToggle)
  }

  return (
    <div className="flex-1 flex h-screen bg-gray-100">
    <Sidebar isOpen = {sidebarToggle} />
      <div className="flex-1 flex flex-col">
        <Header onSidebarToggle = {toggleSidebar}/>
        <main className="flex-1 bg-slate-200">
          Contents here
        </main>
      </div>
    </div>
  )
}

export default App 