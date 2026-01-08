import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './AdminTrendChart.css';

const AdminTrendChart = ({ data }) => {
  const defaultData = [
    { month: 'Jan', 'Bagh Print': 45000, 'Bell Metal': 32000, 'Chanderi Silk': 28000 },
    { month: 'Feb', 'Bagh Print': 52000, 'Bell Metal': 38000, 'Chanderi Silk': 31000 },
    { month: 'Mar', 'Bagh Print': 48000, 'Bell Metal': 35000, 'Chanderi Silk': 29000 },
    { month: 'Apr', 'Bagh Print': 61000, 'Bell Metal': 42000, 'Chanderi Silk': 35000 },
    { month: 'May', 'Bagh Print': 55000, 'Bell Metal': 39000, 'Chanderi Silk': 33000 },
    { month: 'Jun', 'Bagh Print': 67000, 'Bell Metal': 45000, 'Chanderi Silk': 38000 },
  ];
  const trendData = data && data.length ? data : defaultData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].payload.month}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="value">
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="trend-chart-container">
      <div className="section-header">
        <h2>Sales Growth Trend</h2>
        <p>Monthly sales performance of top ODOP products (₹)</p>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="Bagh Print"
              stroke="#667eea"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Bell Metal"
              stroke="#764ba2"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Chanderi Silk"
              stroke="#4caf50"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminTrendChart;
