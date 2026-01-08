import React from 'react';

const BACKEND_URL = 'http://localhost:5000'; // adjust if needed

export default function DataTable({
  loading,
  products,
  onToggle,
  onEdit,
  onDelete
}) {
  if (loading) {
    return <div className="text-center p-4">Loading inventory…</div>;
  }

  if (!products.length) {
    return <div className="text-center p-4 text-muted">No products found</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Price</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Availability</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => {
              const isOutByQty = p.quantity === 0;
              const inStock = p.in_stock && !isOutByQty;

              return (
                <tr key={p.id}>
                  {/* IMAGE FIRST */}
                  <td>
                    {p.image_path ? (
                      <img
                        src={`${BACKEND_URL}${p.image_path}`}
                        alt={p.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://via.placeholder.com/56?text=No+Image';
                        }}
                        style={{
                          width: 56,
                          height: 56,
                          objectFit: 'cover',
                          borderRadius: 6,
                          border: '1px solid #dee2e6'
                        }}
                      />
                    ) : (
                      <img
                        src="https://via.placeholder.com/56?text=No+Image"
                        alt="No"
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 6,
                          border: '1px dashed #ced4da'
                        }}
                      />
                    )}
                  </td>

                  {/* PRODUCT NAME ONLY */}
                  <td className="fw-semibold">{p.name}</td>

                  {/* PRICE */}
                  <td>₹{Number(p.price).toFixed(2)}</td>

                  {/* CATEGORY */}
                  <td>{p.category}</td>

                  {/* QTY */}
                  <td>{p.quantity}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`badge ${
                        inStock ? 'bg-success' : 'bg-danger'
                      }`}
                    >
                      {inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>

                  {/* TOGGLE */}
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={inStock}
                        disabled={isOutByQty}
                        onChange={() => onToggle(p.id)}
                      />
                      {isOutByQty && (
                        <small className="text-muted ms-2">
                          Qty = 0
                        </small>
                      )}
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => onEdit(p)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(p.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
