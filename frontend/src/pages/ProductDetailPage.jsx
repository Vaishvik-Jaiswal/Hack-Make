import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetailPage.css';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import axios from 'axios';

export const ProductDetailPage = ({ buyer }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`/api/products/${id}/sellers`);
      setProduct(response.data.data.product);
      setSellers(response.data.data.sellers);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (seller) => {
    const cartItem = {
      productId: product.id,
      productName: product.name,
      sellerId: seller.id,
      sellerName: seller.name,
      price: seller.price,
      quantity: 1,
    };
    const newCart = [...cart, cartItem];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert('Added to cart!');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-detail-container">
      <nav className="detail-nav">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <button onClick={() => navigate('/cart')} className="cart-btn">
          <ShoppingCart size={20} />
          Cart ({cart.length})
        </button>
      </nav>

      <div className="product-detail-content">
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="category">{product.category}</p>
          <p className="description">{product.description}</p>
          <p className="district">Origin District: {product.base_district}</p>
        </div>

        <div className="sellers-section">
          <h2>Sellers in {product.base_district}</h2>
          <div className="sellers-list">
            {sellers.map(seller => (
              <div key={seller.id} className="seller-card">
                <div className="seller-info">
                  <h3>{seller.name}</h3>
                  <div className="rating">
                    <Star size={16} fill="gold" color="gold" />
                    {seller.rating}
                  </div>
                  <p>Price: ₹{seller.price}</p>
                  <p>Stock: {seller.stock}</p>
                </div>
                <button
                  onClick={() => addToCart(seller)}
                  className="add-to-cart-btn"
                  disabled={seller.stock === 0}
                >
                  {seller.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;