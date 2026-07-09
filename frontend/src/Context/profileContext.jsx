import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const profileContext = createContext()

export const ProfileProvider = ({ children }) => {
    const [Profiles, setProfiles] = useState([])
    const [Loading, setLoading] = useState(true)
    const [Error, setError] = useState(null)

    const refreshProfiles = async () => {
        try {
            const data = await axios.get("https://moeezrashidd.pythonanywhere.com/profiles/")
            setProfiles(data.data)
            return data.data
        } catch (error) {
            setError(error)
            return null
        }
    }

    const optimisticFollowUpdate = ({ actorId, targetId, willFollow }) => {
       
        const prev = Profiles

        const actorIdNum = Number(actorId)
        const targetIdNum = Number(targetId)

        setProfiles((prevProfiles) => {
            const next = prevProfiles.map((p) => {
                if (!p?.username?.id) return p
                return { ...p }
            })

    
            const actorProfile = next.find((p) => Number(p?.username?.id) === actorIdNum)
            
            const targetProfile = next.find((p) => Number(p?.username?.id) === targetIdNum)

            if (actorProfile && typeof actorProfile.following === 'number') {
                actorProfile.following = actorProfile.following + (willFollow ? 1 : -1)
            }
            if (targetProfile && typeof targetProfile.followers === 'number') {
                targetProfile.followers = targetProfile.followers + (willFollow ? 1 : -1)
            }

            return next
        })

        return prev
    }


    useEffect(() => {
        ;(async () => {
            setLoading(true)
            await refreshProfiles()
            setLoading(false)
        })()
        
    }, [])

    return (
        <profileContext.Provider value={{ Profiles, Loading, Error, refreshProfiles, setProfiles, optimisticFollowUpdate }}>
            {children}
        </profileContext.Provider>

    )

}
