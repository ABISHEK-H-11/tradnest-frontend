import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Registration() {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const handlesubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post('https://tradnest-backend-production.up.railway.app/api/user/regestration', 
            { 
              username: username,
              email: email, 
              password: password,
              role: role
            });
            console.log('Login successful:', response.data);
          
          setError('');
          setUsername('');
          setEmail('');
          setPassword('');
          navigate('/login');
      } catch (error) {
          setError(error.response.data.message || 'Invalid username or password');
          console.error('Login error:', error);
      }
  }
  return (
    <div className='auth-page'>
    <div className='login-container'>
        <h2>Registration</h2>
        <form onSubmit={handlesubmit} className='login-form'>
            <label htmlFor='username' className='login-label'>User name:</label> 
            <input type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder='Enter your name'
            id="username" 
            className='login-input' required />
            <label htmlFor='email' className='login-label'>Email:</label>
            <input type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email' id="email" 
            className='login-input' required />
            <label htmlFor='password' className='login-label'>Password:</label>
            <input type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password' id="password" 
            className='login-input' required/>
            <label htmlFor='role' className='login-label'>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} id="role" className='login-input' required>
                <option value="">Select Role</option>
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
            </select>
            <button type='submit' className='login-button'>Create account</button>
        </form>
        {error && <p className='login-error'>{error}</p>}
        <div className='login-link-container'>
            Already have an account? <button type='button' onClick={() => navigate('/login')} className='login-link-button'>Login</button>
        </div>
    </div>
    </div>
  )
}
