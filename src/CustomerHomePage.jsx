import React, { useEffect, useState } from 'react'
import Header from './Header'
import CategoryNavigation from './CategoryNavigation'
import ProductList from './ProductList'
import Footer from './Footer';
import axios from 'axios';

export default function CustomerHomePage() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState('');
  const [cartError, setCartError] = useState(false); // State for cart fetch error
  const [isCartLoading, setIsCartLoading] = useState(true); // State for cart loading


  useEffect(() => {
    fetchProducts();
    if (username) {
      fetchCartCount(); // Fetch cart count only if username is available
    }
  }, [username]); // Re-run cart count fetch if username changes

const fetchProducts = async (category = '') => {
    try {
     
      const response = await fetch(
         `http://localhost:8080/api/customer/products${category ? `?category=${category}` : '?category=Shirts'}`, 
        { credentials: 'include' }, 
      );
      
      const data = await response.json();
      if(data)
     { 
      setUsername(data.User?.name || "guest"); 
      console.log(data);
      // Extract username
      setProducts(data.products || []);
    }else{
      setProducts([]);

    }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
};

  const fetchCartCount = async () => {
    setIsCartLoading(true); // Set loading state
    try {
      const response = await fetch(`http://localhost:8080/api/customer/cart/count`, {
        credentials: 'include', // Include authToken as a cookie
      });
      const count = await response.json();

      setCartCount(count);
      setCartError(false); // Reset error state if successful
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartError(true); // Set error state
    } finally {
      setIsCartLoading(false); // Remove loading state
    }
  };

  const handleCategoryClick = (category) => {
    fetchProducts(category);
  };

  const handleAddToCart = async (productId) => {
    if (!username) {
      console.error('Username is required to add items to the cart');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/customer/cart/add', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ username, productId }), // Include username and productId in the request
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 200 || response.status === 201) {
        fetchCartCount(); // Update cart count
      } else {
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <div>
        <Header
          cartCount={isCartLoading ? '...' : cartError ? 'Error' : cartCount}
          username={username}
        />
        <nav>
          <CategoryNavigation onCategoryClick={handleCategoryClick} />
        </nav>
        <main>
          <ProductList products={products} onAddToCart={handleAddToCart}/>
        </main>
        <footer>
          <Footer/>
        </footer>
    </div>
  )
}
