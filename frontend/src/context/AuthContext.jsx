import { createContext, useContext, useState } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user")
        return savedUser ? JSON.parse(savedUser) : null
    })

    function login(userData){
    setToken(userData.token)

    const userInfo = {
        staffId: userData.staffId,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        storeName: userData.storeName,  // ✅ ADD THIS
        role: userData.role
    }

    setUser(userInfo)

    localStorage.setItem("token", userData.token)
    localStorage.setItem("user", JSON.stringify(userInfo))
}

    function logout(){
        setToken(null)
        setUser(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }

    function getUser(){
        return user
    }

    const authData = {token, user, login, logout, getUser}

    return(
        <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}


