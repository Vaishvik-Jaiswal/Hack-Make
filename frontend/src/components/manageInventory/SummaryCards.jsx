import React from 'react';

export default function SummaryCards({ products = [] }) {
  const total = products.length;

const inStock = products.filter(
  p => p.in_stock && p.quantity > 0
).length;

const outStock = products.filter(
  p => p.quantity === 0 || !p.in_stock
).length;


  const Card = ({ title, value, icon, color }) => (
    <div className="col-md-4">
      <div className="card shadow-sm h-100">
        <div className="card-body d-flex align-items-center">
          <div className={`rounded-circle p-3 me-3 bg-${color} bg-opacity-10`}>
            <i className={`bi ${icon} text-${color} fs-4`}></i>
          </div>
          <div>
            <div className="text-muted small">{title}</div>
            <div className="fs-4 fw-bold">{value}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="row g-3 mb-4">
      <Card title="Total Products" value={total} icon="bi-box-seam" color="primary" />
      <Card title="In Stock" value={inStock} icon="bi-check-circle" color="success" />
      <Card title="Out of Stock" value={outStock} icon="bi-x-circle" color="danger" />
    </div>
  );
}
