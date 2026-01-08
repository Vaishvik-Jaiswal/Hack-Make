import { useState, useEffect, useMemo } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminLoginComponent from '../components/AdminLoginComponent';
import AdminKPICards from '../components/AdminKPICards';
import AdminDistrictLeaderboard from '../components/AdminDistrictLeaderboard';
import AdminExportReadinessHeatmap from '../components/AdminExportReadinessHeatmap';
import AdminTrendChart from '../components/AdminTrendChart';
import AdminFilters from '../components/AdminFilters';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { isAuthenticated, adminEmail, logout } = useAdminAuth();
  const [showDashboard, setShowDashboard] = useState(isAuthenticated);
  const [filters, setFilters] = useState({ timeRange: '6m', district: 'All', category: 'All', area: 'All' });
  const [filterAnim, setFilterAnim] = useState(false);

  useEffect(() => {
    setShowDashboard(isAuthenticated);
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setShowDashboard(true);
  };

  const handleLogout = () => {
    logout();
    setShowDashboard(false);
  };

  // Master static datasets (centralised so filters work)
  const masterDistrictData = useMemo(() => [
    { district: 'Indore', revenue: 50, sellers: 120, area: 'Urban' },
    { district: 'Gwalior', revenue: 35, sellers: 85, area: 'Urban' },
    { district: 'Rewa', revenue: 20, sellers: 45, area: 'Rural' },
    { district: 'Ujjain', revenue: 28, sellers: 62, area: 'Urban' },
    { district: 'Jabalpur', revenue: 32, sellers: 78, area: 'Urban' },
  ], []);

  const masterReadinessData = useMemo(() => [
    { name: 'Bagh Print', value: 85, readinessScore: 85, category: 'Textiles', district: 'Indore', area: 'Rural' },
    { name: 'Chanderi Silk', value: 78, readinessScore: 78, category: 'Textiles', district: 'Jabalpur', area: 'Urban' },
    { name: 'Bell Metal', value: 72, readinessScore: 72, category: 'Handicrafts', district: 'Gwalior', area: 'Urban' },
    { name: 'Maheshwar Sarees', value: 88, readinessScore: 88, category: 'Textiles', district: 'Indore', area: 'Urban' },
    { name: 'Dhar Sword', value: 65, readinessScore: 65, category: 'Handicrafts', district: 'Rewa', area: 'Rural' },
    { name: 'Khargone Malwa', value: 75, readinessScore: 75, category: 'Agriculture', district: 'Khargone', area: 'Rural' },
    { name: 'Sankheda Art', value: 82, readinessScore: 82, category: 'Handicrafts', district: 'Ujjain', area: 'Urban' },
    { name: 'Indore Namkeen', value: 70, readinessScore: 70, category: 'Food', district: 'Indore', area: 'Urban' },
  ], []);

  const masterTrendData = useMemo(() => [
    { month: 'Jan', 'Bagh Print': 45000, 'Bell Metal': 32000, 'Chanderi Silk': 28000 },
    { month: 'Feb', 'Bagh Print': 52000, 'Bell Metal': 38000, 'Chanderi Silk': 31000 },
    { month: 'Mar', 'Bagh Print': 48000, 'Bell Metal': 35000, 'Chanderi Silk': 29000 },
    { month: 'Apr', 'Bagh Print': 61000, 'Bell Metal': 42000, 'Chanderi Silk': 35000 },
    { month: 'May', 'Bagh Print': 55000, 'Bell Metal': 39000, 'Chanderi Silk': 33000 },
    { month: 'Jun', 'Bagh Print': 67000, 'Bell Metal': 45000, 'Chanderi Silk': 38000 },
  ], []);

  // Derived filter options
  const districts = useMemo(() => Array.from(new Set(masterDistrictData.map((d) => d.district))), [masterDistrictData]);
  const categories = useMemo(() => Array.from(new Set(masterReadinessData.map((r) => r.category))), [masterReadinessData]);

  // Apply filters
  const filteredDistrictData = useMemo(() => {
    return masterDistrictData.filter((d) => (filters.district === 'All' ? true : d.district === filters.district) && (filters.area === 'All' ? true : d.area === filters.area));
  }, [masterDistrictData, filters]);

  const filteredReadinessData = useMemo(() => {
    return masterReadinessData.filter((r) => (filters.category === 'All' ? true : r.category === filters.category) && (filters.district === 'All' ? true : r.district === filters.district) && (filters.area === 'All' ? true : r.area === filters.area));
  }, [masterReadinessData, filters]);

  const filteredTrendData = useMemo(() => {
    // Slice months by timeRange: 1m/3m/6m/1y
    const mapRange = { '1m': 1, '3m': 3, '6m': 6, '1y': masterTrendData.length };
    const n = mapRange[filters.timeRange] || masterTrendData.length;
    return masterTrendData.slice(-n);
  }, [masterTrendData, filters]);

  // KPIs calculations
  const totalDistricts = useMemo(() => new Set(masterDistrictData.map((d) => d.district)).size, [masterDistrictData]);
  const totalProducts = useMemo(() => masterReadinessData.length, [masterReadinessData]);
  const totalSellers = useMemo(() => masterDistrictData.reduce((s, d) => s + (d.sellers || 0), 0), [masterDistrictData]);
  const totalRevenueL = useMemo(() => masterDistrictData.reduce((s, d) => s + (d.revenue || 0), 0), [masterDistrictData]);
  const totalRevenueDisplay = useMemo(() => {
    const crores = (totalRevenueL / 100).toFixed(2); // since revenue stored in Lakh units for demo
    return `₹${crores} Cr`;
  }, [totalRevenueL]);

  // Orders as estimated values from latest month totals
  const ordersMonthly = useMemo(() => {
    const last = filteredTrendData[filteredTrendData.length - 1] || {};
    const sum = Object.keys(last).filter((k) => k !== 'month').reduce((s, k) => s + (last[k] || 0), 0);
    return Math.round(sum / 1000); // simple orders estimate
  }, [filteredTrendData]);

  const ordersYearly = useMemo(() => {
    const sumYear = filteredTrendData.reduce((acc, m) => acc + Object.keys(m).filter((k) => k !== 'month').reduce((s, k) => s + (m[k] || 0), 0), 0);
    return Math.round(sumYear / 1000);
  }, [filteredTrendData]);

  const exportShare = useMemo(() => 35, []); // static demo value (%)
  const activeSellers = useMemo(() => Math.round(totalSellers * 0.85), [totalSellers]);
  const inactiveSellers = useMemo(() => totalSellers - activeSellers, [totalSellers, activeSellers]);

  const kpiData = [
    { id: 'd1', title: 'Total Districts Onboarded', value: totalDistricts, icon: '📍', color: '#667eea' },
    { id: 'p1', title: 'Total ODOP Products Listed', value: totalProducts, icon: '📦', color: '#764ba2' },
    { id: 's1', title: 'Total Sellers / Artisans', value: totalSellers, icon: '👥', color: '#4caf50' },
    { id: 'r1', title: 'Total Revenue Generated', value: totalRevenueDisplay, icon: '💰', color: '#f59e0b' },
    { id: 'o1', title: 'Total Orders (Monthly / Yearly)', value: `${ordersMonthly} / ${ordersYearly}`, icon: '🧾', color: '#10b981' },
    { id: 'e1', title: 'Export vs Domestic Sales (%)', value: `${exportShare}% / ${100 - exportShare}%`, icon: '✈️', color: '#ef4444' },
    { id: 'a1', title: 'Active vs Inactive Sellers', value: `${activeSellers} / ${inactiveSellers}`, icon: '🔔', color: '#06b6d4' },
  ];

  // trigger small animation when filters change
  useEffect(() => {
    setFilterAnim(true);
    const t = setTimeout(() => setFilterAnim(false), 400);
    return () => clearTimeout(t);
  }, [filters]);

  if (!showDashboard) {
    return <AdminLoginComponent onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-header-content">
          <div className="admin-title-section">
            <h1>Government Admin Dashboard</h1>
            <p>ODOP & GI Tags Management System</p>
          </div>
          <div className="admin-user-section">
            <span className="admin-email">{adminEmail}</span>
            <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
              <Link to="/admin/bot">
                <button className="bot-btn">Bot Console</button>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="admin-dashboard-main">
        <div className="dashboard-content">
          {/* Filters */}
          <AdminFilters districts={districts} categories={categories} filters={filters} onChange={setFilters} />

          {/* KPI Cards */}
          <div className={`kpi-wrapper ${filterAnim ? 'filter-anim' : ''}`}>
            <AdminKPICards kpiData={kpiData} onCardClick={(k) => console.log('KPI clicked', k)} />
          </div>

          {/* Charts Grid */}
          <div className={`charts-grid ${filterAnim ? 'filter-anim' : ''}`}>
            <div className="chart-column">
              <AdminDistrictLeaderboard data={filteredDistrictData} />
              <AdminTrendChart data={filteredTrendData} />
            </div>
          </div>

          {/* Export Readiness Heatmap */}
          <div className={`heatmap-wrapper-outer ${filterAnim ? 'filter-anim' : ''}`}>
            <AdminExportReadinessHeatmap data={filteredReadinessData} />
          </div>

          {/* Quick Stats Section */}
          <div className="quick-stats">
            <h2>Quick Stats</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Avg Export Readiness</span>
                <span className="stat-value">77%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">YoY Growth Rate</span>
                <span className="stat-value">+24.5%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Processing Capacity</span>
                <span className="stat-value">2,450 Units</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">International Markets</span>
                <span className="stat-value">45 Countries</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
