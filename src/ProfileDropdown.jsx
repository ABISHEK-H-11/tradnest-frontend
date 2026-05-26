import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useravatar from './useravatar.png'
export default function ProfileDropdown({username}) {
    const [isOpen, setIsOpen] = useState(false);
    const navi = useNavigate();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }
    const handleLogout = async() => {
        const reponce = await fetch('http://localhost:8080/api/user/logout',{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if(reponce.ok) {
            navi("/login")
        }
    }
  return (
    <div>
        <button className="profile-button" onClick={toggleDropdown}>
            <img  src={useravatar}
            alt="User Avatar" 
            className="user-avatar"
            onError={(e) => { e.target.src = 'fallback-logo.png'; }}/>
            <span className="username"> {username || 'Guest'}</span>
        </button>
        {isOpen && (
            <div className="dropdown-menu">
                <button type="button" className="dropdown-item-btn">Profile</button>
                <Link to="/orders" className="dropdown-item-link" onClick={() => setIsOpen(false)}>Orders</Link>
                <button type="button" className="dropdown-item-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        )}
    </div>  
  )
}
