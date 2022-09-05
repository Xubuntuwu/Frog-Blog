import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function AdminLogin(props) {
  const navigate = useNavigate();

  const loginAdmin =(e) =>{
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const login = {
        username: username,
        password: password,
      };
      const params = new URLSearchParams(login);
    
    // Get Admin Token
    fetch('/api/login/admin', {
        method: 'POST',
        body: params,
        })
        .then((e)=>{
        return e.json()
        })
        .then(json=> {
            // console.log(json);
            navigate('/admin/home', {state: {'adminToken': json.token}})
            props.setIsAdmin(true);
            props.setAdminToken(json.token);
            props.setAdminID(json.id);
        })
        .catch(function(err) {
        console.log(err)
        });
  }  

  return (
    <div className="Adminlogin">
        <div className='container'>
            <form onSubmit={loginAdmin}>
                <h1> Admin Login</h1>
                <div>
                    <label>
                        Username: 
                        <input type='text' name='username' id='username' required/>
                    </label>
                </div>
                <div>
                    <label>
                        Password: 
                        <input type='password' name='password' id='password' required/>
                    </label>
                </div>
                <button type='submit'>Log In</button>
            </form>
        </div>
    </div>
  );
}

export default AdminLogin;
