import React, { useEffect, useState } from 'react'
import Header from './Header'
import './OrderPage.css'

export default function OrderPage() {

  const [username, setUsername] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [OrderItems, setOrderItems] = useState([]);
  const [cartError, setCartError] = useState(false); // State for cart fetch error
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (username) {
      fetchCartCount();
    }
  }, [username]);
  const fetchOrders = async () => {
    try {
      const response = await fetch('https://tradnest-backend-production.up.railway.app/api/customer/order/details', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      console.log(data);
      
      setOrderItems(data.orders?.products || []);
      setUsername(data.username || 'Guest'); // Extract username
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    setIsCartLoading(true); // Set loading state
    try {
      const response = await fetch(`https://tradnest-backend-production.up.railway.app/api/customer/cart/count`, {
        credentials: 'include',
      });
      const count = await response.json();
      setCartCount(count );
      console.log(count + " order");
      
      setCartError(false); // Reset error state if successful
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartError(true); // Set error state
    } finally {
      setIsCartLoading(false); // Remove loading state
    }
  };
  return (
    <div>
      <div className="customer-homepage">
      <Header cartCount={cartCount} 
      username={username}/>
      <main className="main-content">
        <h1 className="form-title">Your Orders</h1>
        {loading && (
          <div className="orders-loading">
            <div className="orders-loading-spinner" aria-hidden />
            <p>Loading your orders...</p>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && OrderItems.length === 0 && (
          <div className="orders-empty">
            <div className="orders-empty-icon" aria-hidden />
            <p className="orders-empty-title">No orders yet</p>
            <p className="orders-empty-text">Start shopping and your orders will show up here.</p>
          </div>
        )}
        {!loading && !error && OrderItems.length > 0 && (
          <div className="orders-list">
            {OrderItems.map((order, index) => (
              <div key={index} className="order-card">
                <div className="order-card-header">
                  <h3>Order Id : {order.order_id}</h3>
                </div>
                <div className="order-card-body">
                  <img
                    src={order.image_url}
                    alt={order.name}
                    className="order-product-image"
                  />
                  <div className="order-details">
                    <h3 className="product-name">ProductName : {order.name}</h3>
                    <h3>Description : {order.description}</h3>
                    <h3>Quantity : {order.quantity}</h3>
                    <h3>Price per Unit : ₹{Number(order.price_per_unit).toFixed(2)}</h3>
                    <h3>Total Price : ₹{Number(order.total_price).toFixed(2)}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      </div>
    </div>
  )
}
