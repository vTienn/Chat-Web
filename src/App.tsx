

import './App.css'

import Login from './components/Login/index.tsx'
import ChatRoom from './components/ChatRoom/index.tsx'
import {Route,BrowserRouter, Routes } from 'react-router-dom'
import AuthProvider from './Context/AuthProvider.tsx'
import ModalAddRoom from './components/ChatRoom/Modals/ModalAddRoom.tsx'
import AddMember from './components/ChatRoom/Modals/AddMember.tsx'
function App() {


  return (
    <BrowserRouter>
    <AuthProvider>
       <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/' element={<ChatRoom/>}/>

  </Routes>
  <ModalAddRoom />
  <AddMember />
    </AuthProvider>
 
    </BrowserRouter>
  )
}

export default App
