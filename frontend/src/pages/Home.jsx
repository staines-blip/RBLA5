import React from 'react'

import FashionForward from '../components/FashionForward/FashionForward'

import './Home.css'
import SellerStories from '../components/SellerStories/SellerStories'

const Home = () => {
  return (
    <div className="page-container">
  
    <FashionForward />
    <SellerStories/>
  
</div>

  )
}

export default Home;