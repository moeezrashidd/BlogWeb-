import React, { useState, useEffect } from 'react'
import { sliderData } from '../Context/data'
import {Link} from "react-router-dom"
import { FcNext, FcPrevious } from "react-icons/fc";
const Hero = () => {
    const [Current, setCurrent] = useState(0)
    const length = sliderData.length

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [length]);
    const handleNext = () => {
        setCurrent((pre)=>(
            pre ===length-1 ? 0 : pre +1
        ))


    }
    const handlePrevious = () => {
        setCurrent((pre)=>(
            pre === 0 ? length-1 : pre - 1
        ))


    }

    return (
        <div className='Slider relative w-full h-[80vh]  border overflow-hidden flex justify-center items-center '>
            {sliderData.map((item, index) => {

                return <div
                    className={`slide w-full h-full bg-cover bg-center absolute transition-opacity duration-700 ease-in-out ${index === Current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                    style={{ backgroundImage: `url(${item.img})` }}
                    key={index}
                >
                    <div className="text  w-full h-full  sm:w-[45%] flex flex-col justify-evenly sm:items-start items-center px-14 sm:pr-0">

                        <h1 className='text-white sm:text-5xl lg:text-6xl text-4xl font-bold  text-center sm:text-left'>{item.title}</h1>
                        <p className='text-white text-xl text-center sm:text-left '>{item.desc}</p>
                        <span className='bg-blue-600 text-white text-2xl border-2 border-blue-600 hover:border-white w-36 py-1 flex justify-center items-center cursor-pointer rounded-lg '><Link to={`/posts/${encodeURIComponent(item.category)}`}>Read Posts</Link></span>
                    </div>
                </div>
            })}


            <div className="controlls z-50 flex justify-between w-full ">
                <div className="previous text-5xl font-extrabold hover:bg-[#00000080] rounded-full flex justify-center items-center py-3" onClick={handlePrevious}><FcPrevious /></div>
                <div className="next text-5xl font-extrabold hover:bg-[#00000080] rounded-full flex justify-center items-center py-3" onClick={handleNext}><FcNext /></div>
            </div>


            <div className="dots z-40 absolute bottom-0 flex gap-2 mb-4 justify-center items-center">
                {sliderData.map(( element ,index)=>{
                    return <div className={`dot  rounded-full cursor-pointer ${index === Current ? "bg-blue-600 sm:w-5 sm:h-5 w-3 h-3" : "bg-gray-100 sm:w-4 sm:h-4 w-2 h-2"}`} key={index} ></div>
                })}
            </div>
        </div>


    )
}

export default Hero
