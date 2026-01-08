import {
  Treemap,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './AdminExportReadinessHeatmap.css';

const AdminExportReadinessHeatmap = ({ data: propData }) => {
  // Static data for export readiness by product category
  const defaultData = [
    { name: 'Bagh Print', value: 85, readinessScore: 85, category: 'Textiles', district: 'Indore', area: 'Rural' },
    { name: 'Chanderi Silk', value: 78, readinessScore: 78, category: 'Textiles', district: 'Jabalpur', area: 'Urban' },
    { name: 'Bell Metal', value: 72, readinessScore: 72, category: 'Handicrafts', district: 'Gwalior', area: 'Urban' },
    { name: 'Maheshwar Sarees', value: 88, readinessScore: 88, category: 'Textiles', district: 'Indore', area: 'Urban' },
    { name: 'Dhar Sword', value: 65, readinessScore: 65, category: 'Handicrafts', district: 'Rewa', area: 'Rural' },
    { name: 'Khargone Malwa', value: 75, readinessScore: 75, category: 'Agriculture', district: 'Khargone', area: 'Rural' },
    { name: 'Sankheda Art', value: 82, readinessScore: 82, category: 'Handicrafts', district: 'Ujjain', area: 'Urban' },
    { name: 'Indore Namkeen', value: 70, readinessScore: 70, category: 'Food', district: 'Indore', area: 'Urban' },
  ];
  const data = (propData && propData.length) ? propData : defaultData;

  const getColorFromScore = (score) => {
    if (score >= 80) return '#4caf50'; // Green
    if (score >= 70) return '#8bc34a'; // Light Green
    if (score >= 60) return '#ffc107'; // Yellow
    if (score >= 50) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const CustomizedContent = (props) => {
    const {
      x, y, width, height, value, name, readinessScore,
    } = props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: getColorFromScore(readinessScore),
            stroke: '#fff',
            strokeWidth: 2,
            opacity: 0.9,
          }}
        />
        <text
          x={x + width / 2}
          y={y + height / 2 - 10}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
          fontWeight="bold"
        >
          {name}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
        >
          {readinessScore}%
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const { name, readinessScore, category } = payload[0].payload;
      return (
        <div className="heatmap-tooltip">
          <p className="tooltip-title">{name}</p>
          <p className="tooltip-text">Category: {category}</p>
          <p className="tooltip-text">Readiness: {readinessScore}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="readiness-heatmap-container">
      <div className="section-header">
        <h2>Export Readiness Heatmap</h2>
        <p>Product categories colored by export readiness score (Red: Low → Green: High)</p>
      </div>

      <div className="heatmap-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <Treemap
            data={data}
            dataKey="value"
            stroke="#fff"
            fill="#8884d8"
            content={<CustomizedContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4caf50' }} />
          <span>80-100% (Excellent)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8bc34a' }} />
          <span>70-79% (Good)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ffc107' }} />
          <span>60-69% (Moderate)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff9800' }} />
          <span>50-59% (Fair)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f44336' }} />
          <span>&lt;50% (Poor)</span>
        </div>
      </div>
    </div>
  );
};

export default AdminExportReadinessHeatmap;
