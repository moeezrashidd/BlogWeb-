import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const profileContext = createContext()

export const ProfileProvider = ({children})=>{
    const [Profiles, setProfiles] = useState([])
    const [Loading, setLoading] = useState(true)
    const [Error, setError] = useState(null)
    useEffect(() => {
        async function getData() {
            try {
                const data = await axios.get("http://127.0.0.1:8000/profiles/")
                setProfiles(data.data)
            } catch (error) {
                setError(error)
            }finally{
                setLoading(false)
            }            
        }

        getData()
    }, [])


    return (
        <profileContext.Provider value={{Profiles,Loading,Error}}>
            {children}
        </profileContext.Provider>
    )

}