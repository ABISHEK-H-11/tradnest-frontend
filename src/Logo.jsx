import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoImg from "./logo.png";


export default function Logo() {
  const navi = useNavigate();
  return (
    <div className='logo-container' onClick={()=> navi("/home")}>
      <img src={LogoImg} 
      alt="Logo" 
      className="logo-image" // Updated class name
      onError={(e) => { e.target.src = 'fallback-logo.png'; }}/>
      <span className="logo-text">TradeNest</span>
    </div>
  );
}
