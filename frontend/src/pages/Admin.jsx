import React from 'react'
import './Admin.css'
import Sidebar from '../components/Sidebar/Sidebar'
import {Routes,Route} from 'react-router-dom'
import ListProduct from '../components/ListProduct/ListProduct'
import AddProduct from '../components/AddProduct/AddProduct'
import Marquee from './Marquee'


const Admin = () => {
  return (
    <div className="admin">
        <Sidebar/>
        <Routes>
            <Route path='/addproduct' element={<AddProduct/>}/>
            <Route path='/listproduct' element={<ListProduct/>}/>
            <Route path='/Marquee' element={<Marquee/>}/>
        </Routes>
    </div>
  )
}

export default Admin