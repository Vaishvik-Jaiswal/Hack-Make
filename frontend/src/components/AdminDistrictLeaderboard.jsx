import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './AdminDistrictLeaderboard.css';

const AdminDistrictLeaderboard = ({ data }) => {
  const defaultData = [
    { district: 'Indore', revenue: 50, sellers: 120, area: 'Urban' },
    { district: 'Gwalior', revenue: 35, sellers: 85, area: 'Urban' },
    { district: 'Rewa', revenue: 20, sellers: 45, area: 'Rural' },
    { district: 'Ujjain', revenue: 28, sellers: 62, area: 'Urban' },
    { district: 'Jabalpur', revenue: 32, sellers: 78, area: 'Urban' },
  ];
  const districtData = data && data.length ? data : defaultData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].payload.district}</p>
          <p className="value">Revenue: ₹{payload[0].value}L</p>
          <p className="value">Sellers: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="district-leaderboard-container">
      <div className="section-header">
        <h2>District Revenue Leaderboard</h2>
        <p>Top performing districts by ODOP sales</p>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={districtData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="district" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="revenue" fill="#667eea" name="Revenue (₹L)" />
            <Bar dataKey="sellers" fill="#764ba2" name="Active Sellers" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDistrictLeaderboard;
