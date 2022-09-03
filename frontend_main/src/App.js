import './App.scss';
import { useEffect, useState } from 'react';
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Post from './component/Post';
import Main from './component/Main';

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <header onClick={()=>{navigate('/')}}><span className='title'>The Fog Blog</span></header>
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/post/:id' element={<Post/>}/>
      </Routes>
    </div>
  );
}

export default App;
