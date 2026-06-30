import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from './Header'
import './CartPage.css'

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState();
    const [username, setUsername] = useState();
    const [overallPrice, setOverallPrice] = useState(0);

    const navigate = useNavigate();

    useEffect(()=> {
        const fetchCartItems = async()=> {
            try {
                const responce = await fetch("https://tradnest-backend-production.up.railway.app/api/customer/cart/items",{
                    credentials: 'include'
                });
                
                if(!responce.ok) throw new Error("Failed to fetch cart items");
                const data = await responce.json();
                if(data) {
                  console.log(data);
                  
                    setUsername(data.User.username);
                    const normalizedProducts = data?.cart?.products.map((item) => ({
                      ...item,
                      price_per_unit: parseFloat(item.price_per_unit),
                      total_price: parseFloat(item.total_price),
                    })) || [];
                    setCartItems(
                      normalizedProducts.map((item) => ({
                        ...item,
                        total_price: (item.price_per_unit * item.quantity).toFixed(2),
                      }))
                    );
                    const initialOverall = normalizedProducts.reduce(
                      (acc, item) => acc + item.price_per_unit * item.quantity,
                      0
                    );
                    setOverallPrice(initialOverall.toFixed(2));
                    setCartCount(
                      normalizedProducts.reduce((acc, item) => acc + item.quantity, 0)
                    );
                }
                
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        }
        fetchCartItems();
    },[])

    const handleRemoveItem = async (productId) => {
      console.log(productId);
        try {
          const response = await fetch("https://tradnest-backend-production.up.railway.app/api/customer/cart/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, productId }),
          });
          if (response.status === 204 || response.status == 200) {
            setCartItems((prevItems) => {
              const updatedItems = prevItems.filter((item) => item.product_id !== productId);
              const newCartCount = updatedItems.reduce(
                (acc, item) => acc + item.quantity,
                0
              );
              const newOverallPrice = updatedItems
                .reduce((acc, item) => acc + parseFloat(item.total_price || 0), 0)
                .toFixed(2);
              setCartCount(newCartCount);
              setOverallPrice(newOverallPrice);
              return updatedItems;
            });
          } else throw new Error("Failed to remove item");
        } catch (error) {
          console.error("Error removing item:", error);
        }
      };


      const handleQuantityChange = async (productId, newQuantity) => {
        try {
          if (newQuantity <= 0) {
            handleRemoveItem(productId);
            return;
          }
          const response = await fetch("https://tradnest-backend-production.up.railway.app/api/customer/cart/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, productId, quantity: newQuantity }),
          });
          if (response.ok) {
            setCartItems((prevItems) => {
              const updatedItems = prevItems.map((item) =>
                item.product_id === productId
                  ? {
                      ...item,
                      quantity: newQuantity,
                      total_price: (item.price_per_unit * newQuantity).toFixed(2),
                    }
                  : item
              );
              const newCartCount = updatedItems.reduce(
                (acc, item) => acc + item.quantity,
                0
              );
              const newOverallPrice = updatedItems
                .reduce((acc, item) => acc + parseFloat(item.total_price || 0), 0)
                .toFixed(2);
              setCartCount(newCartCount);
              setOverallPrice(newOverallPrice);
              return updatedItems;
            });
          } else throw new Error("Failed to update quantity");
        } catch (error) {
          console.error("Error updating quantity:", error);
        }
        
      };
    const shipping = (5.0 * 74).toFixed(2);
    const handleCheckout = async () => {
      try {
        const overall = parseFloat(overallPrice) || 0;
        const shippingAmount = parseFloat(shipping) || 0;
        const finalAmount = overall + shippingAmount;

        if (finalAmount <= 0) {
          alert("Cart is empty!");
          return;
        }

        const requestBody = {
          totalAmount: finalAmount,
          cartItems: cartItems.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
            price: item.price_per_unit,
          })),
        };
  
        // Create Razorpay order via backend
        const response = await fetch("https://tradnest-backend-production.up.railway.app/api/customer/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        const razorpayOrderId = data.orderId;

        // Open Razorpay checkout interface
        const options = {
          key: "rzp_test_S9kt8T3tBCtdmF", // Replace with your Razorpay Key ID
          amount: Math.round(finalAmount * 100), // Razorpay expects amount in paise
          currency: "INR",
          name: "TradeNest",
          description: "Test Transaction",
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              // Payment success, verify on backend
              const verifyResponse = await fetch("https://tradnest-backend-production.up.railway.app/api/customer/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              const result = await verifyResponse.text();
              if (verifyResponse.ok) {
                alert("Payment verified successfully!");
                navigate("/home");
              } else {
                 alert("Payment verification failed: " + result);
              }
            } catch (error) {
              console.error("Error verifying payment:", error);
              alert("Payment verification failed. Please try again.");
            }   
          },
          prefill: {
            name: username,
            email: "test@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#3399cc",
          },
        };
  
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        // alert("Payment failed. Please try again.");
        console.error("Error during checkout:", error);
      }
    };
    
  return (
    <div>
        <Header username={username} cartCount={cartCount}/>
        <div className="cart-container">
        <div className="cart-page">
          <Link to="/home" className="back-button">
            ← Shopping Continue
          </Link>

          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <p>You have {cartItems.length} items in your cart</p>
          </div>

          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product_id} className="cart-item">
                <img
                  src={item.image || "https://via.placeholder.com/80?text=No+Image"}
                  alt={item.name}
                />
                <div className="item-details">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}>
                        -
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <span className="price">₹{item.total_price}</span>
                    <button className="remove-btn" onClick={() => handleRemoveItem(item.product_id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>

        <div className="checkout-section">
          <h2>Order Summary</h2>
          <div className="checkout-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{overallPrice}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>
            <div className="summary-row">
              <span>Total Products</span>
              <span>{cartCount}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{(parseFloat(overallPrice) + parseFloat(shipping)).toFixed(2)}</span>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
    </div>
  )
}
