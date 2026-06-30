import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Login() {
const navigate = useNavigate();
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const handlesubmit = async (e) => {
    e.preventDefault();
    if(username.trim() === '' || password.trim() === '') {
        setError('Please enter a username and password');
        return;
    }
    
    try {
        const response = await axios.post('https://tradnest-backend-production.up.railway.app/api/user/login', 
          { 
            username: username, 
            password: password 
          },{
            withCredentials: true   // 🔥 VERY IMPORTANT
          });
          console.log(response);
          
        if(response.data.role === "CUSTOMER") {
          navigate('/home');
        } else {
          navigate("/admindashbord")
        }
        setError('');
        setUsername('');
        setPassword('');
    } catch (error) {
        setError(error.response.data.message || 'Invalid username or password');
        console.error('Login error:', error);
    }
}

  return (
    <div className='auth-page'>
    <div className='login-container'>
        <h2>Login</h2>
        <form onSubmit={handlesubmit} className='login-form'>
            <label htmlFor='username' className='login-label'>User Name: </label>
            <input type='text' 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder='Enter your name'
            id="username"
            className='login-input' />
            <label htmlFor='password' className='login-label'>Password: </label>
            <input type='password'
            value={password}
            id='password'
            onChange={(e) => setPassword(e.target.value)} 
            placeholder='Enter password'
            className='login-input'/>
            <button type='submit' className='login-button'>Login</button>
        </form>
        {error && <p className='login-error'>{error}</p>}
        <div className='login-link-container'>
            Don't have an account? <button onClick={()=>navigate('/signin')} className='login-link-button'>Sign Up</button>
        </div>
    </div>
    </div>
  )
}
