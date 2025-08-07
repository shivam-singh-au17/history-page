"use client";

import { useState, useEffect } from 'react';
import SlotResultDisplay from "./SlotResultDisplayv6";

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: '20px 0'
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    color: 'white'
  },
  headerIcon: {
    width: '60px',
    height: '60px',
    margin: '0 auto 20px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    backdropFilter: 'blur(10px)'
  },
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    margin: '0 0 16px 0',
    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    fontSize: '1.2rem',
    opacity: '0.9',
    fontWeight: '400'
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '40px',
    marginBottom: '30px'
  },
  formSection: {
    marginBottom: '30px'
  },
  label: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '10px'
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '20px'
  },
  select: {
    width: '100%',
    padding: '16px 40px 16px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    color: 'black',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxSizing: 'border-box',
    outline: 'none',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px 16px',
    cursor: 'pointer',

    // Mobile responsiveness
    '@media (max-width: 768px)': {
      padding: '12px 36px 12px 12px',
      fontSize: '14px'
    },

    '&:focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
    }
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '16px 24px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    width: '100%'
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
  },
  disabledButton: {
    opacity: '0.6',
    cursor: 'not-allowed',
    transform: 'none'
  },
  loadingSpinner: {
    animation: 'spin 1s linear infinite',
    fontSize: '18px'
  },
  errorCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    padding: '20px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    marginTop: '25px'
  },
  errorIcon: {
    color: '#dc2626',
    fontSize: '20px',
    marginTop: '2px',
    flexShrink: 0
  },
  errorTitle: {
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: '8px',
    fontSize: '16px'
  },
  errorText: {
    color: '#dc2626',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  resultsCard: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,249,255,0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '40px'
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  resultsTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0'
  },
  gameInfo: {
    textAlign: 'right'
  },
  gameName: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#667eea',
    margin: '0 0 5px 0'
  },
  gameAlias: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0'
  },
  resultsContainer: {
    borderRadius: '15px',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  }
};

export default function BetHistoryViewer() {
  const [roundId, setRoundId] = useState('');
  const [roundData, setRoundData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [token, setToken] = useState('');
  const [initializing, setInitializing] = useState(true);

  // Initialize by getting token and then round IDs
  useEffect(() => {
    const initialize = async () => {
      try {
        setInitializing(true);

        // Step 1: Get the token from launchUrl API
        const launchResponse = await fetch('https://clgaming-be.pixentech.com/external/operatorGame/launchUrl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gameId: "6889b9296c7cb0201b67b48b",
            userId: "shivam",
            token: "abcd",
            currency: "INR",
            gameMode: "R3"
          })
        });

        if (!launchResponse.ok) {
          throw new Error('Failed to get token');
        }

        const launchData = await launchResponse.json();
        const newToken = launchData.token;
        setToken(newToken);

        // Step 2: Get round IDs with the token
        const historyResponse = await fetch(
          'https://clgaming-be.pixentech.com/rgs/api/report/betHistory?type=bh&pageSize=20000000',
          {
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!historyResponse.ok) {
          throw new Error('Failed to get round history');
        }

        const historyData = await historyResponse.json();
        if (historyData.data && historyData.data.length > 0) {
          const formattedRounds = historyData.data.map(item => ({
            id: item.roundId,
            gameName: item.gameName,
            timestamp: item.endTime,
            betAmount: item.betAmount,
            winAmount: item.winAmount,
            totalFreeSpins: item.totalFreeSpins
          }));
          setRounds(formattedRounds);

          // Set the first round as default selection
          if (formattedRounds.length > 0) {
            setRoundId(formattedRounds[0].id);
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError(`Initialization failed: ${err.message}`);
      } finally {
        setInitializing(false);
      }
    };

    initialize();
  }, []);

  const fetchRoundData = async () => {
    if (!roundId) {
      setError('Please select a round');
      return;
    }

    setLoading(true);
    setError(null);
    setShowResults(false);

    try {
      const response = await fetch(
        `https://clgaming-be.pixentech.com/rgs/api/report/betHistory/${roundId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.code === 2300) {
        throw new Error('Session expired - please refresh the page');
      } else if (!data || data === null) {
        throw new Error('No data available for this round');
      } else {
        setRoundData(data);
        setShowResults(true);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            📊
          </div>
          <h1 style={styles.title}>Bet History Viewer</h1>
          <p style={styles.subtitle}>
            View your gaming round details
          </p>
        </div>

        {/* Main Input Card */}
        <div style={styles.card}>
          {initializing ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p>Initializing...</p>
            </div>
          ) : (
            <div style={styles.formSection}>
              {/* Round ID Selector */}
              <div style={styles.inputGroup}>
                  <label style={styles.label}>Select Round ID</label>
                <select
                  value={roundId}
                  onChange={(e) => setRoundId(e.target.value)}
                  style={styles.select}
                  disabled={loading || rounds.length === 0}
                >
                  {rounds.length === 0 ? (
                    <option value="">No rounds available</option>
                  ) : (
                    rounds.map((round, index) => (
                      <option key={index} value={round.id}>
                        {round.gameName} - {formatDate(round.timestamp)} -
                        Bet: {formatCurrency(round.betAmount)} -
                        Win: {formatCurrency(round.winAmount)} - Free Spin: {round.totalFreeSpins ?? 0}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* View Details Button */}
              <button
                onClick={fetchRoundData}
                disabled={loading || rounds.length === 0}
                style={{
                  ...styles.button,
                  ...(loading || rounds.length === 0 ? styles.disabledButton : {})
                }}
                onMouseEnter={(e) => {
                  if (!loading && rounds.length > 0) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && rounds.length > 0) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.loadingSpinner}>⟳</span>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    <span>View Round Details</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div style={styles.errorCard}>
              <span style={styles.errorIcon}>⚠️</span>
              <div>
                <h4 style={styles.errorTitle}>Error</h4>
                <p style={styles.errorText}>{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Display */}
        {showResults && roundData && (
          <div style={styles.resultsCard}>
            <div style={styles.resultsHeader}>
              <h2 style={styles.resultsTitle}>📈 Round Results</h2>
              <div style={styles.gameInfo}>
                <p style={styles.gameName}>{roundData.gameName}</p>
                <p style={styles.gameAlias}>({roundData.gameAlias})</p>
              </div>
            </div>

            <div style={styles.resultsContainer}>
              <SlotResultDisplay roundData={roundData} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .${styles.title} {
            fontSize: 2rem !important;
          }
          .${styles.card} {
            padding: 25px !important;
          }
          .${styles.resultsHeader} {
            flex-direction: column !important;
            text-align: left !important;
            gap: 15px !important;
          }
          .${styles.gameInfo} {
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
}