import React from 'react'
import Logo from './Logo'
import CartIcone from './CartIcone'
import ProfileDropdown from './ProfileDropdown'

export default function Header({ cartCount, username }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div>
          <Logo />
        </div>
        <div>
          <CartIcone count={cartCount} />
          <ProfileDropdown username={username} />
        </div>
      </div>
    </header>
  )
}
