import React from 'react'
import { useParams } from 'react-router-dom'
import Posts from './posts'
import Writers from '../components/writers'

const Search = () => {
  const {text} = useParams()
  return (
    <>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 text-center mb-4">Showing Result of : <span className='text-3xl sm:text-5xl  text-blue-600'>{text} </span> </h1>
      <Posts searchText={text}/>
      <Writers searchText={text}/>

    </>
  )
}

export default Search