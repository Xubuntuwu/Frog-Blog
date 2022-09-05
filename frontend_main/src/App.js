import './App.scss';
import { useState } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import Post from './component/Post';
import Main from './component/Main';
import AdminLogin from './component/AdminLogin';
import Admin from './component/Admin';

function App() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [adminID, setAdminID] = useState(null);

  return (
    <div className="App">
      <header> 
        <span className='title' onClick={()=>{navigate('/')}}>The Frog Blog</span>
        {isAdmin ?
        <span className='adminlogout'><span onClick={()=>{navigate('/admin/home', {state: {'adminToken': adminToken}})}}>Admin</span><span onClick={()=>{navigate('/'); setIsAdmin(false); setAdminID(null)} }>Log Out</span></span>
        :
        <span className='login' onClick={()=>{navigate('/admin/login')}}>Login</span>}
      </header>
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/post/:id' element={<Post adminID={adminID}/>}/>
        <Route path='/admin/login' element={<AdminLogin setIsAdmin={setIsAdmin} setAdminToken={setAdminToken} setAdminID={setAdminID}/>}/>
        <Route path='/admin/home' element={<Admin adminID={adminID}/>}/>
      </Routes>
    </div>
  );
}

export default App;
