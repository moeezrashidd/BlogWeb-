import axios from "axios";
import { createContext, useState, useEffect } from "react";
import API_BASE_URL from "../config";

export const userContext = createContext()

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState([])
    const [Loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        async function getdata() {
            try {
                const response = await axios.get(`${API_BASE_URL}/users/`)
                console.log(response)
                setUserData(response.data)
                
                
                const storedUserId = localStorage.getItem("loggedInUserId")
                if (storedUserId) {
                    const activeUser = response.data.find(u => u.id === parseInt(storedUserId))
                    if (activeUser) setCurrentUser(activeUser)
                }

            } catch (error) {
                setError(error);

            } finally {
                setLoading(false)
            }

        }

        getdata()

    }, [])

    return (
        <userContext.Provider value={{ userData, Loading, error, currentUser, setCurrentUser }}>
            {children}
        </userContext.Provider>
    )

}