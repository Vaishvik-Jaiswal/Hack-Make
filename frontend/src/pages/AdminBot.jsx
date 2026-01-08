import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import './AdminBot.css';

const AdminBot = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isAuthenticated) {
    return <div style={{padding: 20}}>Please login as admin to access the Bot Console.</div>;
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/agents/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      // Handle both success (2xx) and error (4xx/5xx) responses
      const contentType = res.headers.get('content-type') || '';
      let json = null;

      if (contentType.includes('application/json')) {
        try {
          json = await res.json();
        } catch (parseErr) {
          // JSON parse failed; likely malformed response from server
          console.error('Failed to parse JSON response:', parseErr);
          setResult({ success: false, error: `Server returned invalid response: ${parseErr.message}` });
          setLoading(false);
          return;
        }
      } else {
        // Non-JSON response (e.g. HTML error page from Express)
        const text = await res.text();
        if (!res.ok) {
          console.error('Non-JSON error response:', text);
          setResult({ success: false, error: `Server error (HTTP ${res.status}): ${text.slice(0, 100)}` });
        } else {
          setResult({ success: false, error: 'Server returned non-JSON response' });
        }
        setLoading(false);
        return;
      }

      // If we have JSON, set it as the result (whether success or error)
      setResult(json);
    } catch (err) {
      console.error('Agent pipeline error', err);
      setResult({ success: false, error: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-bot-container">
      {/* Header with home button */}
      <div className="admin-bot-header">
        <button 
          className="home-button"
          onClick={() => navigate('/admin/dashboard')}
          title="Back to Dashboard"
        >
          ← Home
        </button>
        <h1 className="admin-bot-title">Admin Bot Console</h1>
        <div style={{ width: '80px' }}></div> {/* spacer for centering */}
      </div>

      {/* Centered content wrapper */}
      <div className="admin-bot-wrapper">
        <form onSubmit={handleSearch} className="admin-bot-form">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter question for the bot (e.g. How many sellers in Nagpur?)"
            className="admin-bot-input"
          />
          <button type="submit" className="admin-bot-search" disabled={loading}>
            {loading ? 'Running...' : 'Search'}
          </button>
        </form>

        {result && (
          <div className="admin-bot-results clean-result">
          {/* Show only final result: Professional format with Overview, Data Table, Key Insights */}
          {result.interpretation && result.interpretation.success ? (
            <div className="professional-result-container">
              {/* Overview Section */}
              <div className="overview-section">
                <h3 className="section-title">Overview</h3>
                <p className="overview-text">{result.interpretation.answer.direct_answer}</p>
              </div>

              {/* Data Table Section */}
              {result.execution && Array.isArray(result.execution.rows) && result.execution.rows.length > 0 && (
                <div className="data-table-section">
                  <h3 className="section-title">Data Table</h3>
                  <div className="table-wrap">
                    <table className="result-table">
                      <thead>
                        <tr>
                          {Object.keys(result.execution.rows[0]).map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.execution.rows.map((r, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'even-row' : 'odd-row'}>
                            {Object.keys(result.execution.rows[0]).map((k) => (
                              <td key={k}>{String(r[k] ?? '')}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Supporting Details if present */}
              {(result.interpretation.answer.supporting_details) && (
                <div className="supporting-details-section">
                  <p className="supporting-details">{result.interpretation.answer.supporting_details}</p>
                </div>
              )}

              {/* Key Insights Section */}
              {(result.interpretation.answer.insights) && (
                <div className="insights-section">
                  <h3 className="section-title">Key Insights</h3>
                  <div className="insights-content">{result.interpretation.answer.insights}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="error">{result.interpretation ? `Interpretation error: ${result.interpretation.error}` : (result.error || 'No result available')}</div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminBot;
