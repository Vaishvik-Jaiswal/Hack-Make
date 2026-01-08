import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ToastProvider, useToast } from './manageInventory/Toasts';
import SummaryCards from './manageInventory/SummaryCards';
import FilterBar from './manageInventory/FilterBar';
import DataTable from './manageInventory/DataTable';
import EditModal from './manageInventory/EditModal';
import { useNavigate } from 'react-router-dom';

export default function ManageInventoryComponent({ seller }) {
  return (
    <ToastProvider>
      <Inventory seller={seller} />
    </ToastProvider>
  );
}

function Inventory({ seller }) {
  const navigate = useNavigate();
  const { add } = useToast();
  const vendorId = seller?.id;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [editing, setEditing] = useState(null);

  const fetchProducts = async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      const res = await api.get(`/products/vendor/${vendorId}`);
      setProducts(res.data.data.products || []);
    } catch {
      add('Failed to load products', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [vendorId]);

  const handleToggle = async (id) => {
    const product = products.find(p => p.id === id);
    const newValue = product.in_stock ? 0 : 1;

    setProducts(list =>
      list.map(p => p.id === id ? { ...p, in_stock: newValue } : p)
    );

    try {
      await api.patch(`/products/${id}/availability`, {
        vendor_id: vendorId,
        in_stock: newValue
      });
      add('Availability updated');
    } catch {
      add('Toggle failed', 'error');
      fetchProducts();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await api.delete(`/products/${id}?vendor_id=${vendorId}`);
      setProducts(list => list.filter(p => p.id !== id));
      add('Product deleted');
    } catch {
      add('Delete failed', 'error');
    }
  };

  const handleSave = async (id, data) => {
    try {
      const res = await api.put(`/products/${id}`, {
        ...data,
        vendor_id: vendorId
      });
      setProducts(list =>
        list.map(p => p.id === id ? res.data.data.product : p)
      );
      setEditing(null);
      add('Product updated');
    } catch {
      add('Update failed', 'error');
    }
  };

  const filtered = products.filter(p =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
    (!category || p.category === category)
  );

  return (
  <div
    className="min-vh-100"
    style={{
      background: 'linear-gradient(135deg, #eef2ff 0%, #e6f4ea 100%)',
      position: 'relative'
    }}
  >
    {/* FULL PAGE WATERMARK */}
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundImage:
          'url("https://upload.wikimedia.org/wikipedia/commons/1/17/Ashoka_Chakra.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '360px',
        opacity: 0.035,
        pointerEvents: 'none',
        zIndex: 0
      }}
    />

    {/* PAGE CONTENT */}
    <div className="container py-4 position-relative" style={{ zIndex: 1 }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/seller/dashboard')}
        className="btn btn-outline-primary btn-sm d-inline-flex align-items-center mb-3"
      >
        <i className="bi bi-arrow-left-circle me-2"></i>
        Back to Dashboard
      </button>

      {/* Header */}
      <div
        className="mb-4 p-4 rounded shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #1a237e, #2e7d32)',
          color: '#fff'
        }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h3 className="mb-1 fw-bold">
              <i className="bi bi-clipboard-data me-2"></i>
              Inventory Management
            </h3>
            <div className="small opacity-75">
              One District One Product (ODOP) – Madhya Pradesh
            </div>
          </div>

          <i className="bi bi-ashoka-chakra fs-2"></i>
        </div>
      </div>

      {/* Summary */}
      <SummaryCards products={products} />

      {/* Filters */}
      <FilterBar
        search={search}
        onSearch={setSearch}
        category={category}
        onCategory={setCategory}
        categories={[...new Set(products.map(p => p.category))]}
      />

      {/* Table */}
      <DataTable
        loading={loading}
        products={filtered}
        onToggle={handleToggle}
        onEdit={setEditing}
        onDelete={handleDelete}
      />

      {/* Edit Modal */}
      {editing && (
        <EditModal
          product={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  </div>
);

}
