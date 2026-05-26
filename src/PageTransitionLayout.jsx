import { Outlet, useLocation } from 'react-router-dom'

export default function PageTransitionLayout() {
  const location = useLocation()
  return (
    <div className="page-transition-wrap" key={location.pathname}>
      <Outlet />
    </div>
  )
}
