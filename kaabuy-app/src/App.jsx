import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import { useState} from "react"

const App = () =>{
  const [sidebarToggle, setSidebarToggle] = useState(true)

  function toggleSidebar(){
    setSidebarToggle(!sidebarToggle)
  }
  return(<>
    <Sidebar status = {sidebarToggle}/>
    <Header onSidebarToggle = {toggleSidebar} />
    </>
  )
}

export default App
