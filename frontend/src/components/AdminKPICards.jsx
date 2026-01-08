import './AdminKPICards.css';

const AdminKPICards = ({ kpiData = [], onCardClick = () => {} }) => {
  const displayed = kpiData.length
    ? kpiData
    : [
        { id: 1, title: 'Total State Revenue', value: '₹1.2 Cr', icon: '💰', color: '#667eea' },
        { id: 2, title: 'Active ODOP Sellers', value: '850', icon: '🏪', color: '#764ba2' },
        { id: 3, title: 'Verified GI Tags', value: '120', icon: '✓', color: '#4caf50' },
      ];

  return (
    <div className="kpi-cards-container">
      {displayed.map((kpi) => (
        <div
          key={kpi.id}
          className="kpi-card"
          style={{ borderLeftColor: kpi.color }}
          onClick={() => onCardClick(kpi)}
        >
          <div className="kpi-icon">{kpi.icon}</div>
          <div className="kpi-content">
            <p className="kpi-title">{kpi.title}</p>
            <p className="kpi-value">{kpi.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminKPICards;
