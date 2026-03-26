import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/footer'
import PostCard from '../components/postCard'
import Writers from '../components/writers'
import SignUpBar from '../components/signUpBar'
import { postContext } from '../Context/postsContext'



const Home = () => {

    const { postData } = useContext(postContext)
    console.log(postData)
    const [Items, setItems] = useState(6)
    useEffect(() => {
        const changeItemCount = () => {
            if (window.innerWidth < 840) {
                setItems(4);
            } else {
                setItems(6);
            }
        }

        changeItemCount()
        window.addEventListener("resize", changeItemCount)

        return () => window.removeEventListener("resize", changeItemCount)


    }, [])


    return (
        <>
            <Navbar />
            <Hero />
            <Writers />
            <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-900  mt-6 text-center mb-4 '>Latest <span className='text-blue-600'>Posts</span></h1>

            <div className="parent flex flex-wrap justify-center gap-1 sm:gap-2 3xl:gap-4 mt-4">

                {postData.filter((post) => post.category == "latest").slice(0, Items).map((item, index) => (
                    <PostCard key={index} item={item} />
                ))}
            </div>



            <SignUpBar />
            <Footer />





        </>
    )
}

export default Home


