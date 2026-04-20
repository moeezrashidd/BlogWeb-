import axios from "axios";
import { createContext, useState, useEffect } from "react";


export const userContext = createContext()

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState([])
    const [Loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function getdata() {
            try {
                const response = await axios.get("http://127.0.0.1:8000/users/")
                console.log(response)
                setUserData(response.data)

            } catch (error) {
                setError(error);

            } finally {
                setLoading(false)
            }

        }

        getdata()


    }, [])

    return (
        <userContext.Provider value={{ userData, Loading, error }}>
            {children}
        </userContext.Provider>
    )

}