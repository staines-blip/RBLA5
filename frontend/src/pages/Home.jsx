import React from 'react'
import Hero from '../components/Hero/Hero'
import FashionForward from '../components/FashionForward/FashionForward'
import SellerStories from '../components/SellerStories/SellerStories'
import './Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <Hero/>
      <FashionForward/>
      <SellerStories/>
    </div>
  )
}

export default Home;