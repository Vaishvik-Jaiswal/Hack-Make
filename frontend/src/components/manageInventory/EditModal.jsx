import React, { useEffect, useState } from 'react';

export default function EditModal({ product, onClose, onSave }) {
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (product) {
      setPrice(product.price);
      setDescription(product.description || '');
      setQuantity(product.quantity ?? 0);
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(product.id, {
      price,
      description,
      quantity,
      in_stock: quantity > 0 ? 1 : 0
    });
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
    >
      <div className="card shadow-lg" style={{ width: 480, borderRadius: 10 }}>
        
        {/* HEADER */}
        <div
          className="card-header text-white"
          style={{
            background: 'linear-gradient(135deg, #1a237e, #2e7d32)',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="fw-bold fs-5">
              <i className="bi bi-pencil-square me-2"></i>
              Edit Product
            </div>
            <button
              className="btn btn-sm btn-light"
              onClick={onClose}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="small opacity-75">
            Update price, description & stock quantity
          </div>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit}>
          <div className="card-body">

            {/* Price */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <i className="bi bi-currency-rupee me-1"></i>
                Price
              </label>
              <input
                type="number"
                className="form-control"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <i className="bi bi-card-text me-1"></i>
                Description
              </label>
              <textarea
                className="form-control"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Quantity */}
            <div className="mb-2">
              <label className="form-label fw-semibold">
                <i className="bi bi-box-seam me-1"></i>
                Quantity Available
              </label>
              <input
                type="number"
                className="form-control"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              {quantity === 0 && (
                <div className="form-text text-danger">
                  Product will be marked as <strong>Out of Stock</strong>
                </div>
              )}
            </div>

          </div>

          {/* FOOTER */}
          <div className="card-footer d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <i className="bi bi-check-circle me-1"></i>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
