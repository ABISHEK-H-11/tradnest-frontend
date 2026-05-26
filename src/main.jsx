import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import PageTransitionLayout from './PageTransitionLayout.jsx'
import Login from './Login.jsx'
import Regestration from './Regestration.jsx'
import CustomerHomePage from './CustomerHomePage.jsx'
import CartPage from './CartPage.jsx'
import OrderPage from './OrderPage.jsx'
import './Auth.css'
import AdminDashdoard from './AdminDashdoard.jsx'

const routing = createBrowserRouter([
  {
    path: '/',
    element: <PageTransitionLayout />,
    children: [
      { 
        index: true, 
        element: <Navigate to="/login" replace /> 
      },
      { 
        path: 'login', 
        element: <Login /> 
      },
      { 
        path: 'signin', 
        element: <Regestration /> 
      },
      { 
        path: 'home', 
        element: <CustomerHomePage /> 
      },
      { 
        path: 'cart', 
        element: <CartPage /> 
      },
      { 
        path: 'orders', 
        element: <OrderPage /> 
      },
      {
        path: '/admindashbord',
        element : <AdminDashdoard/>
      }
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={routing} />
)
