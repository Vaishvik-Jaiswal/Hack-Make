import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';


export const CartPage = ({ buyer }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cart'));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  // Defensive fallback: if cart is not an array, reset to empty array
  useEffect(() => {
    if (!Array.isArray(cart)) {
      setCart([]);
      localStorage.setItem('cart', JSON.stringify([]));
    }
  }, [cart]);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    // Dispatch custom event to update cart count in dashboard
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    updateCart(newCart);
  };

  const placeOrder = () => {
    alert('Order placed successfully!');
    updateCart([]);
    navigate('/dashboard');
  };

  return (
    <div className="cart-container">
      <nav className="cart-nav">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </nav>

      <div className="cart-content">
        <h1>Your Shopping Cart</h1>

        {!Array.isArray(cart) || cart.length === 0 ? (
          <div className="empty-cart">
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
            <p>Your cart is empty</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              Add some amazing ODOP products to get started!
            </p>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              <div className="cart-items-header">
                <h2>Cart Items ({cart.length})</h2>
              </div>
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-image">
                    {item.productName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="item-details">
                    <h3>{item.productName || 'Unknown Product'}</h3>
                    <p>Seller: {item.sellerName || 'Unknown'}</p>
                    <p className="item-price">₹{typeof item.price === 'number' && !isNaN(item.price) ? item.price.toFixed(2) : '0.00'}</p>
                    <div className="item-quantity">
                      <span>Quantity:</span>
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="quantity-display">{item.quantity || 1}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="remove-btn">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-header">
                <h2>Order Summary</h2>
              </div>
              <div className="summary-row">
                <span>Subtotal ({cart.length} items):</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>GST (18%):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button
                onClick={placeOrder}
                className="place-order-btn"
                disabled={cart.length === 0}
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;