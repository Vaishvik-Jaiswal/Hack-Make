import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import { Search, ShoppingCart } from 'lucide-react';
import axios from 'axios';

export const DashboardPage = ({ buyer, seller, onLogout }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const user = buyer || seller;
  const isSeller = !!seller;

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
      return;
    }
    fetchProducts();
    if (!isSeller) {
      updateCartCount();
    }
  }, [user, isSeller]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  // Update cart count when navigating back from cart
  useEffect(() => {
    const handleStorageChange = () => updateCartCount();
    const handleCartUpdate = () => updateCartCount();
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  const filteredProducts = products.filter(product => {
    const matchesName = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || product.category === category;
    return matchesName && matchesCategory;
  });

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <h1>ODOP Marketplace</h1>
          <span className="nav-title">{isSeller ? 'Seller Dashboard' : 'Buyer Dashboard'}</span>
        </div>
        <div className="nav-right">
          {isSeller ? (
            <button onClick={() => navigate('/upload')} className="upload-btn">
              Upload Product
            </button>
          ) : (
            <button onClick={() => navigate('/cart')} className="cart-btn">
              <div className="cart-icon-wrapper">
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <span className="cart-text">Cart</span>
            </button>
          )}
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {isSeller ? seller.artisan_name : buyer.name}!</h2>
          <p>
            {isSeller
              ? `${seller.shop_name} from ${seller.district}`
              : `${buyer.org_type} from ${buyer.district_name}`
            }
          </p>
        </div>

        {isSeller ? (
          <div className="seller-section">
            <div className="seller-stats">
              <div className="stat-card">
                <h3>Shop Details</h3>
                <p><strong>Shop Name:</strong> {seller.shop_name}</p>
                <p><strong>Udyam Number:</strong> {seller.udyam_number}</p>
                <p><strong>District:</strong> {seller.district}</p>
              </div>
            </div>
            <div className="seller-actions">
              <button onClick={() => navigate('/upload')} className="action-btn primary">
                Upload New Product
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="search-section">
              <div className="search-bar">
                <Search size={20} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="products-section">
              <h3>Available Products</h3>
              {loading ? (
                <p>Loading products...</p>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                      <h4>{product.name}</h4>
                      <p>{product.category}</p>
                      <p>Origin: {product.base_district}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
