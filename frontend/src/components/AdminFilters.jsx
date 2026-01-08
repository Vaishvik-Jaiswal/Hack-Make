import { useMemo } from 'react';
import './AdminFilters.css';

const AdminFilters = ({
  districts = [],
  categories = [],
  filters = {},
  onChange = () => {},
}) => {
  const districtOptions = useMemo(() => ['All', ...districts], [districts]);
  const categoryOptions = useMemo(() => ['All', ...categories], [categories]);

  return (
    <div className="admin-filters">
      <div className="filter-row">
        <label>Time Range</label>
        <select value={filters.timeRange || '6m'} onChange={(e) => onChange({ ...filters, timeRange: e.target.value })}>
          <option value="1m">Last 1 month</option>
          <option value="3m">Last 3 months</option>
          <option value="6m">Last 6 months</option>
          <option value="1y">Last 1 year</option>
        </select>
      </div>

      <div className="filter-row">
        <label>District</label>
        <select value={filters.district || 'All'} onChange={(e) => onChange({ ...filters, district: e.target.value })}>
          {districtOptions.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="filter-row">
        <label>Category</label>
        <select value={filters.category || 'All'} onChange={(e) => onChange({ ...filters, category: e.target.value })}>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filter-row toggle-row">
        <label>Area</label>
        <select value={filters.area || 'All'} onChange={(e) => onChange({ ...filters, area: e.target.value })}>
          <option value="All">All</option>
          <option value="Rural">Rural</option>
          <option value="Urban">Urban</option>
        </select>
      </div>
    </div>
  );
};

export default AdminFilters;
