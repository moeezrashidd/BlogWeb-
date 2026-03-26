import React from 'react'
import Posts from './pages/posts'
import Categories from './pages/categories'
import Navbar from './components/Navbar'
import About from "./pages/about"
import Contact from "./pages/contact"
import FullPost from './pages/fullPost'
import {BrowserRouter as Router, Routes, Route, } from 'react-router-dom'
import Home from "./pages/home"
import SignIn from './pages/signIn'
import SignUp from './pages/signUp'
import Footer from './components/footer'
import Account from './pages/account'
import SignUpBar from './components/signUpBar'
import Search from './pages/search'
import AddPost from './pages/addPost'
const App = () => {
  return (
      <main className="min-h-screen  px-4 sm:px-12 lg:px-18 bg-gray-50">
    <Router>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/posts" element={<> <Navbar /><Posts /><SignUpBar /> <Footer /></>}/>
            <Route path="/posts/:category" element={<> <Navbar /><Posts /><SignUpBar /><Footer /></>}/>
            <Route path="/categories" element={<> <Navbar /><Categories /><Footer /></>}/>
            <Route path="/about" element={<> <Navbar /><About /><SignUpBar /><Footer /></>}/>
            <Route path="/contact" element={<> <Navbar /><Contact /><SignUpBar /> <Footer /></>}/>
            <Route path="/post/:id/:title" element={<> <Navbar /><FullPost /><SignUpBar /> <Footer /></>}/>
            <Route path="/account/:id/:username" element={<><Navbar /><Account /><SignUpBar /><Footer /></>}/>
            <Route path="/signIn" element={<SignIn />}/>
            <Route path="/signUp" element={<SignUp />}/>
            <Route path="/search/:text" element={<><Navbar /><Search /> <SignUpBar /><Footer /></>}/>
            <Route path="/addPost" element={<><Navbar /><AddPost /><Footer /></>}/>
        </Routes>

    </Router>
      </main>
  )
}

export default App
