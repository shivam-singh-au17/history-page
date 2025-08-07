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
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    fontSize: '18px',
    zIndex: '1'
  },
  input: {
    width: '100%',
    padding: '16px 20px 16px 50px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    color: 'black',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxSizing: 'border-box',
    outline: 'none'
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)',
    transform: 'translateY(-1px)'
  },
  toggleButton: {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    zIndex: '1'
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginTop: '30px'
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
    overflow: 'hidden'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  secondaryButton: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white'
  },
  successButton: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white'
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
  statusCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    marginTop: '15px',
    border: '1px solid'
  },
  successCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    color: '#166534'
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    color: '#1e40af'
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
  },
  copyButton: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    fontSize: '14px'
  },
  loadingSpinner: {
    animation: 'spin 1s linear infinite',
    fontSize: '18px'
  }
};

export default function BetHistoryViewer() {
  const [roundId, setRoundId] = useState('');
  const [token, setToken] = useState('');
  const [savedToken, setSavedToken] = useState('');
  const [roundData, setRoundData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [tokenUpdateSuccess, setTokenUpdateSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    const storedToken = 'demo_token_placeholder';
    if (storedToken && storedToken !== 'demo_token_placeholder') {
      setSavedToken(storedToken);
      setToken(storedToken);
    }
  }, []);

  const fetchRoundData = async () => {
    if (!roundId.trim()) {
      setError('Please enter a Round ID');
      return;
    }

    if (!token && !savedToken) {
      setError('Please enter an authorization token');
      return;
    }

    setLoading(true);
    setError(null);
    setShowResults(false);
    setTokenUpdateSuccess(false);

    try {
      const response = await fetch(
        `https://clgaming-be.pixentech.com/rgs/api/report/betHistory/${roundId}`,
        {
          headers: {
            'Authorization': `Bearer ${token || savedToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.code === 2300) {
        setError('Your session has expired. Please update your token.');
      } else if (!data || data === null) {
        setError('Invalid Round ID or no data available for this Round ID');
      } else {
        setRoundData(data);
        setShowResults(true);

        if (token && token !== savedToken) {
          setSavedToken(token);
          setTokenUpdateSuccess(true);
          setTimeout(() => setTokenUpdateSuccess(false), 3000);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to fetch data: ${err.message}. Please check your connection and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRoundId('');
    setRoundData(null);
    setError(null);
    setShowResults(false);
    setTokenUpdateSuccess(false);
  };

  const handleUpdateToken = () => {
    if (token && token !== savedToken) {
      setSavedToken(token);
      setTokenUpdateSuccess(true);
      setTimeout(() => setTokenUpdateSuccess(false), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchRoundData();
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTokenDisplay = (tokenStr) => {
    if (!tokenStr) return '';
    return tokenStr.length > 20 ? `${tokenStr.substring(0, 10)}...${tokenStr.substring(tokenStr.length - 10)}` : tokenStr;
  };

  const getInputStyle = (inputName) => ({
    ...styles.input,
    ...(focusedInput === inputName ? styles.inputFocus : {})
  });

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
            Retrieve and analyze your gaming round data with ease
          </p>
        </div>

        {/* Main Input Card */}
        <div style={styles.card}>
          <div style={styles.formSection}>
            {/* Round ID Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Round ID</label>
              <div style={{ position: 'relative' }}>
                <span style={styles.inputIcon}>🔍</span>
                <input
                  type="text"
                  value={roundId}
                  onChange={(e) => setRoundId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setFocusedInput('roundId')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Enter Round ID (e.g., lSx5QWKsX4uSI4LV4oMjc)"
                  style={getInputStyle('roundId')}
                />
              </div>
            </div>

            {/* Token Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Authorization Token</label>
              <div style={{ position: 'relative' }}>
                <span style={styles.inputIcon}>🔑</span>
                <input
                  type={showToken ? "text" : "password"}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setFocusedInput('token')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Enter your Bearer token"
                  style={getInputStyle('token')}
                />
                <button
                  style={styles.toggleButton}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#9ca3af';
                  }}
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? '👁️' : '🙈'}
                </button>
              </div>

              {savedToken && (
                <div style={{ ...styles.statusCard, ...styles.successCard }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✅</span>
                    <span>Saved token: {formatTokenDisplay(savedToken)}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(savedToken)}
                    style={styles.copyButton}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    📋
                  </button>
                </div>
              )}

              {tokenUpdateSuccess && (
                <div style={{ ...styles.statusCard, ...styles.infoCard }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✅</span>
                    <span>Token updated successfully!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={styles.buttonGroup}>
              <button
                onClick={fetchRoundData}
                disabled={loading}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  ...(loading ? styles.disabledButton : {})
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
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
                    <span>Fetch Round Data</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                style={{ ...styles.button, ...styles.secondaryButton }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                <span>🔄</span>
                <span>Reset</span>
              </button>

              {token && token !== savedToken && (
                <button
                  onClick={handleUpdateToken}
                  style={{ ...styles.button, ...styles.successButton }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <span>🔑</span>
                  <span>Update Token</span>
                </button>
              )}
            </div>
          </div>

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
          .${styles.buttonGroup} {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}