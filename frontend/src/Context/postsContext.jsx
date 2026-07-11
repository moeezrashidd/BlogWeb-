import { createContext, useState , useEffect } from "react";
import axios from "axios"

export const postContext = createContext()

export const PostProvider = ({ children }) => {
    const [postData, setPostData] = useState([])
    const [Error, setError] = useState(null)
    const [Loading, setLoading] = useState(true)

    useEffect(() => {
        async function getdata() {
            try {
                const posts = await axios.get("https://moeezrashidd.pythonanywhere.com/posts/")
                setPostData(posts.data)
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }
        getdata()

    }, [])
    console.log(postData)




    return (
        <postContext.Provider value={{ postData, setPostData, Error, Loading }} >
            {children}
        </postContext.Provider>
    )
}
