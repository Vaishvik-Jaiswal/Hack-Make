import React from 'react';

export default function FilterBar({ search, onSearch, category, onCategory, categories }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body d-flex flex-wrap gap-3 align-items-center">
        <div className="flex-grow-1">
          <input
            className="form-control"
            placeholder="Search product by name or description"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div style={{ minWidth: 220 }}>
          <select
            className="form-select"
            value={category}
            onChange={(e) => onCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
