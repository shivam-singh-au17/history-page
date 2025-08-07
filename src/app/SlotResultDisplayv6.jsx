"use client";

import React, { useState } from "react";

const SlotResultDisplay = ({ roundData }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [expandedSpins, setExpandedSpins] = useState([]);
  const [highlightedSymbol, setHighlightedSymbol] = useState(null);

  // Parse the game data
  const parseGameData = () => {
    if (!roundData?.extraData) return null;

    const baseData =
      roundData.extraData.find(
        (item) => item.pendingFeature === roundData.totalFreeSpins
      ) || roundData.extraData[0];

    const freeSpinsData = roundData.extraData
      .filter((item) => item.featureResults?.length > 0)
      .flatMap((item) => item.featureResults)
      .filter((feature) => feature.featureType === "freespins")
      .flatMap((feature) => feature.spinResults);

    return {
      roundId: roundData.roundId,
      gameName: roundData.gameName,
      startTime: new Date(roundData.createdAt).toLocaleString(),
      endTime: new Date(roundData.endTime).toLocaleString(),
      betAmount: roundData.betAmount,
      baseBetAmount: roundData.baseBetAmount,
      totalWin: roundData.winAmount,
      currency: roundData.currencyCode,
      totalFreeSpins: roundData.totalFreeSpins,
      isFreeBet: roundData.isFreeBet,
      buyBonus: roundData.buyBonus,
      status: roundData.status,
      baseGame: baseData
        ? {
            reelViews: baseData.cascadeData.map((cascade) => ({
              view: cascade.reelView,
              winAmount: cascade.spinWin || 0,
              winningSymbols: cascade.blustSymbols || [],
              multiplier: cascade.multiplier?.[0]?.multiplier || 1,
              scatterPositions: cascade.scatterPositions || [],
            })),
            totalWin: baseData.totalWin || 0,
          }
        : null,
      freeSpins: freeSpinsData.map((spin, index) => ({
        spinNumber: index + 1,
        reelViews: spin.cascadeData.map((cascade) => ({
          view: cascade.reelView,
          winAmount: cascade.spinWin || 0,
          winningSymbols: cascade.blustSymbols || [],
          multiplier: cascade.multiplier?.[0]?.multiplier || 1,
          scatterPositions: cascade.scatterPositions || [],
        })),
        totalWin: spin.totalWin || 0,
        currentCount: spin.currentCount,
        totalMultiplier: spin.totalMultiplier || 1,
      })),
    };
  };

  const gameData = parseGameData();
  if (!gameData) return <div className="loading">Loading game data...</div>;

  const toggleSpinExpand = (spinNumber) => {
    setExpandedSpins((prev) =>
      prev.includes(spinNumber)
        ? prev.filter((n) => n !== spinNumber)
        : [...prev, spinNumber]
    );
  };

  const handleSymbolHighlight = (symbol) => {
    setHighlightedSymbol((prev) => (prev === symbol ? null : symbol));
  };

  return (
    <div className="result-container">
      {/* Header Section */}
      <header className="header">
        <h1 className="game-title">{gameData.gameName} Round History</h1>
        {/* <h1 className="game-title">BET ROUND HISTORY</h1> */}
        <div className="round-info">
          <div className="info-item">
            <span className="label">Round ID:</span>
            <span className="value">{gameData.roundId}</span>
          </div>
          <div className="info-item">
            <span className="label">Start Time:</span>
            <span className="value">{gameData.startTime}</span>
          </div>
          <div className="info-item">
            <span className="label">End Time:</span>
            <span className="value">{gameData.endTime}</span>
          </div>
          <div className="info-item">
            <span className="label">BB Type:</span>
            <span className="value">FGI</span>
          </div>
        </div>
      </header>

      {/* Bet Info Section */}
      <div className="bet-info">
        <div className="bet-info-item">
          <span className="label">Bet Amount:</span>
          <span className="value">
            {gameData.currency} {gameData.betAmount.toFixed(2)}
          </span>
        </div>
        <div className="bet-info-item">
          <span className="label">Status:</span>
          <span className="value status-badge">
            {gameData.status
              .split("_")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </span>
        </div>
        <div className="bet-info-item">
          <span className="label">Free Bet:</span>
          <span className={`value badge ${gameData.isFreeBet ? "yes" : "no"}`}>
            {gameData.isFreeBet ? "Yes" : "No"}
          </span>
        </div>
        <div className="bet-info-item">
          <span className="label">Buy Bonus:</span>
          <span className={`value badge ${gameData.buyBonus ? "yes" : "no"}`}>
            {gameData.buyBonus ? "Yes" : "No"}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="navigation-tabs">
        <button
          className={`tab-button ${activeTab === "summary" ? "active" : ""}`}
          onClick={() => setActiveTab("summary")}
        >
          <span className="tab-icon">📊</span>
          Round Summary
        </button>
        <button
          className={`tab-button ${activeTab === "base" ? "active" : ""}`}
          onClick={() => setActiveTab("base")}
        >
          <span className="tab-icon">🎯</span>
          Base Game
        </button>
        {gameData.totalFreeSpins > 0 && (
          <button
            className={`tab-button ${
              activeTab === "freespins" ? "active" : ""
            }`}
            onClick={() => setActiveTab("freespins")}
          >
            <span className="tab-icon">🎰</span>
            Free Spins ({gameData.totalFreeSpins})
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="content-section">
        {activeTab === "summary" && (
          <div className="summary-view">
            <div className="summary-card">
              <div className="summary-header">
                <h3>Round Summary</h3>
                <div className="summary-icon">🏆</div>
              </div>
              <table className="summary-table">
                <thead>
                  <tr>
                    <th className="table-header">Free Spin</th>
                    <th className="table-header">Total Round Bet</th>
                    <th className="table-header">Total Round Win</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="table-cell">
                      <span className="spin-count">
                        {gameData.totalFreeSpins}
                      </span>{" "}
                      Spin(s)
                    </td>
                    <td className="table-cell">
                      <span className="currency">{gameData.currency}</span>{" "}
                      {gameData.betAmount.toFixed(2)}
                    </td>
                    <td className="table-cell">
                      <span className="currency">{gameData.currency}</span>
                      <span className="win-amount">
                        {gameData.totalWin.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="footnote">
                💡 Bet / {gameData.currency} {gameData.baseBetAmount.toFixed(2)}{" "}
                = Possible Bet Amount
              </div>
            </div>
          </div>
        )}

        {activeTab === "base" && gameData.baseGame && (
          <BaseGameView
            reelViews={gameData.baseGame.reelViews}
            totalWin={gameData.baseGame.totalWin}
            currency={gameData.currency}
            onSymbolHighlight={handleSymbolHighlight}
            highlightedSymbol={highlightedSymbol}
          />
        )}

        {activeTab === "freespins" && (
          <FreeSpinsView
            spins={gameData.freeSpins}
            expandedSpins={expandedSpins}
            onToggleExpand={toggleSpinExpand}
            currency={gameData.currency}
            onSymbolHighlight={handleSymbolHighlight}
            highlightedSymbol={highlightedSymbol}
          />
        )}
      </div>

      {/* Total Win Display */}
      {gameData.totalWin > 0 && (
        <div className="total-win-container">
          <div className="total-win-content">
            <div className="win-trophy">🏆</div>
            <div className="total-win-text">
              <div className="total-win-label">TOTAL WIN</div>
              <div className="total-win-amount">
                {gameData.currency} {gameData.totalWin.toFixed(2)}
              </div>
            </div>
            <div className="win-sparkle">✨</div>
          </div>
        </div>
      )}

      <style jsx>{`
        .result-container {
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #f8fafc 50%,
            #f1f5f9 100%
          );
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08),
            0 8px 20px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          100%
          width: 100%;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          color: #334155;
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header {
          padding: 20px 15px;
          background: linear-gradient(
            135deg,
            #6366f1 0%,
            #8b5cf6 50%,
            #a855f7 100%
          );
          color: white;
          position: relative;
          overflow: hidden;
        }

        .header::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 70%
          );
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%,
          100% {
            transform: translateX(-100%) translateY(-100%) rotate(0deg);
          }
          50% {
            transform: translateX(100%) translateY(100%) rotate(180deg);
          }
        }

        .game-title {
          margin: 0 0 15px 0;
          font-size: clamp(20px, 5vw, 28px);
          text-align: center;
          font-weight: 700;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 1;
        }

        .round-info {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          position: relative;
          z-index: 1;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.15);
          padding: 10px 12px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          flex: 1 1 150px;
        }

        .label {
          font-size: clamp(10px, 2vw, 12px);
          opacity: 0.9;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .value {
          font-weight: 600;
          font-size: clamp(12px, 2.5vw, 14px);
        }

        .bet-info {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 15px;
          background: rgba(248, 250, 252, 0.8);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          backdrop-filter: blur(10px);
        }

        .bet-info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          padding: 8px 12px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.6);
          flex: 1 1 120px;
        }

        .bet-info-item .label {
          margin-bottom: 0;
          color: #64748b;
          font-weight: 500;
          font-size: clamp(10px, 2vw, 12px);
        }

        .badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: clamp(10px, 2vw, 12px);
          font-weight: 600;
        }

        .badge.yes {
          background: #dcfce7;
          color: #166534;
        }

        .badge.no {
          background: #fef2f2;
          color: #991b1b;
        }

        .status-badge {
          background: #eff6ff;
          color: #1e40af;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: clamp(10px, 2vw, 12px);
          font-weight: 600;
        }

        .navigation-tabs {
          display: flex;
          flex-wrap: wrap;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          position: relative;
        }

        .tab-button {
          flex: 1 1 33%;
          min-width: 120px;
          padding: 15px 10px;
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: clamp(12px, 2.5vw, 14px);
        }

        .tab-icon {
          font-size: clamp(14px, 3vw, 16px);
        }

        // .tab-button:hover {
        //   background: rgba(255, 255, 255, 0.8);
        //   color: #475569;
        //   transform: translateY(-2px);
        // }

        .tab-button.active {
          background: white;
          color: #6366f1;
          box-shadow: 0 -4px 20px rgba(99, 102, 241, 0.15);
        }

        .tab-button.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 3px 3px 0 0;
        }

        .content-section {
          padding: 20px 15px;
          width: 100%;
        }

        .summary-view {
          width: 100%;
          overflow-x: auto;
        }

        .summary-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(226, 232, 240, 0.6);
          width: 100%;
          overflow-x: auto;
        }

        .summary-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .summary-header h3 {
          margin: 0;
          color: #334155;
          font-size: 20px;
          font-weight: 700;
        }

        .summary-icon {
          font-size: 24px;
          opacity: 0.7;
        }

        .summary-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-bottom: 20px;
          min-width: 100%;
        }

        .table-header {
          padding: 12px 8px;
          text-align: left;
          background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.1) 0%,
            rgba(139, 92, 246, 0.1) 100%
          );
          color: #6366f1;
          font-weight: 700;
          font-size: clamp(12px, 2.5vw, 14px);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: sticky;
          top: 0;
        }

        .table-header:first-child {
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }

        .table-header:last-child {
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        .table-cell {
          padding: 12px 8px;
          border-bottom: 1px solid #e2e8f0;
          font-size: clamp(12px, 2.5vw, 14px);
          vertical-align: middle;
        }

        /* Highlight the win amount column */
        .table-cell:nth-child(3) {
          font-weight: 700;
          color: #22c55e;
        }

        /* Add hover effect to rows */
        tbody tr:hover {
          background-color: rgba(248, 250, 252, 0.8);
        }

        .table-cell.highlight {
          background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.05) 0%,
            rgba(139, 92, 246, 0.05) 100%
          );
          font-weight: 700;
          border-radius: 8px;
        }

        .win-amount {
          color: #22c55e;
          font-weight: 700;
          font-size: 15px;
        }

        .spin-count {
          color: #6366f1;
          font-weight: 700;
        }

        .currency {
          color: #64748b;
          font-weight: 500;
          margin-right: 4px;
        }

        .footnote {
          font-size: 12px;
          color: #64748b;
          text-align: center;
          margin-top: 15px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 3px solid #6366f1;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .table-header,
          .table-cell {
            padding: 12px 8px;
            font-size: 13px;
          }

          .summary-card {
            padding: 16px;
          }
        }

        .total-win-container {
          background: linear-gradient(
            135deg,
            #6366f1 0%,
            #8b5cf6 50%,
            #a855f7 100%
          );
          color: white;
          position: relative;
          overflow: hidden;
        }

        .total-win-content {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          gap: 20px;
          position: relative;
          z-index: 1;
        }

        .win-trophy,
        .win-sparkle {
          font-size: 32px;
          animation: bounce 2s ease-in-out infinite;
        }

        .win-sparkle {
          animation-delay: 1s;
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .total-win-text {
          text-align: center;
        }

        .total-win-label {
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.9;
        }

        .total-win-amount {
          font-size: 32px;
          font-weight: 800;
          color: #fbbf24;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .total-win-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: winShine 2s ease-in-out infinite;
        }

        @keyframes winShine {
          0% {
            left: -100%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px;
          font-size: 18px;
          color: #64748b;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  );
};

// Sub-components
const BaseGameView = ({
  reelViews,
  totalWin,
  currency,
  onSymbolHighlight,
  highlightedSymbol,
}) => {
  return (
    <div className="base-game-container">
      <div className="section-header">
        <h2 className="section-title">🎯 Base Game Results</h2>
        <div className="section-subtitle">Initial spin and cascading wins</div>
      </div>

      {reelViews.map((reelData, index) => (
        <TumbleView
          key={index}
          reelData={reelData}
          index={index}
          currency={currency}
          onSymbolHighlight={onSymbolHighlight}
          highlightedSymbol={highlightedSymbol}
          isBaseGame={true}
          totalMultiplier={0}
          totalWin={0}
        />
      ))}

      <style jsx>{`
        .base-game-container {
          animation: slideInLeft 0.5s ease-out;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .section-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .section-title {
          margin: 0 0 8px 0;
          color: #334155;
          font-size: 24px;
          font-weight: 700;
        }

        .section-subtitle {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

const FreeSpinsView = ({
  spins,
  expandedSpins,
  onToggleExpand,
  currency,
  onSymbolHighlight,
  highlightedSymbol,
}) => {
  return (
    <div className="free-spins-container">
      <div className="section-header">
        <h2 className="section-title">🎰 Free Spins Results</h2>
        <div className="section-subtitle">Bonus round spins and features</div>
      </div>

      {spins.map((spin) => (
        <div key={spin.spinNumber} className="spin-container">
          <div
            className="spin-header"
            onClick={() => onToggleExpand(spin.spinNumber)}
          >
            <div className="spin-info">
              <div className="spin-title">🎲 Free Spin {spin.spinNumber}</div>
              <div className="spin-multiplier">
                {spin.totalMultiplier > 0 && (
                  <span className="multiplier-chip">
                    {spin.totalMultiplier}x
                  </span>
                )}
              </div>
            </div>
            <div className="spin-win-display">
              <span className="win-label">Win</span>
              <span className="win-value">
                {currency} {spin.totalWin.toFixed(2)}
              </span>
            </div>
            <div
              className={`expand-icon ${
                expandedSpins.includes(spin.spinNumber) ? "expanded" : ""
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>
          </div>

          {expandedSpins.includes(spin.spinNumber) && (
            <div className="spin-details">
              {spin.reelViews.map((reelData, index) => (
                <TumbleView
                  key={index}
                  reelData={reelData}
                  index={index}
                  currency={currency}
                  onSymbolHighlight={onSymbolHighlight}
                  highlightedSymbol={highlightedSymbol}
                  totalMultiplier={spin.totalMultiplier}
                  totalWin={spin.totalWin}
                />
              ))}

              {spin.totalMultiplier > 1 && (
                <div className="multiplier-info">
                  <div className="multiplier-icon">⚡</div>
                  <div className="multiplier-content">
                    <span className="multiplier-label">
                      Total Multiplier Applied
                    </span>
                    <span className="multiplier-value">
                      {spin.totalMultiplier}x
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <style jsx>{`
        .free-spins-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: slideInRight 0.5s ease-out;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .section-header {
          text-align: center;
          margin-bottom: 10px;
          padding: 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .section-title {
          margin: 0 0 8px 0;
          color: #334155;
          font-size: 24px;
          font-weight: 700;
        }

        .section-subtitle {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }

        .spin-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .spin-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
        }

        .spin-header {
          display: flex;
          align-items: center;
          padding: 20px 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .spin-header:hover {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        }

        .spin-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .spin-title {
          font-weight: 700;
          color: #6366f1;
          font-size: 16px;
        }

        .multiplier-chip {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
        }

        .spin-win-display {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin: 0 20px;
          padding: 12px 16px;
          background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.08) 0%,
            rgba(139, 92, 246, 0.08) 100%
          );
          border-radius: 12px;
        }

        .win-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .win-value {
          font-weight: 700;
          color: #6366f1;
          font-size: 16px;
        }

        .expand-icon {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .expand-icon.expanded {
          transform: rotate(180deg);
        }

        .spin-details {
          padding: 0 24px 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .multiplier-info {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
          padding: 16px;
          background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.08) 0%,
            rgba(217, 119, 6, 0.08) 100%
          );
          border-radius: 12px;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .multiplier-icon {
          font-size: 24px;
          color: #f59e0b;
        }

        .multiplier-content {
          display: flex;
          flex-direction: column;
        }

        .multiplier-label {
          font-weight: 600;
          color: #d97706;
          font-size: 14px;
        }

        .multiplier-value {
          font-weight: 800;
          color: #f59e0b;
          font-size: 20px;
        }
      `}</style>
    </div>
  );
};

const TumbleView = ({
  reelData,
  index,
  currency,
  onSymbolHighlight,
  highlightedSymbol,
  isBaseGame = false,
  totalMultiplier,
  totalWin,
}) => {
  return (
    <div className="tumble-view">
      <div className="tumble-header">
        <div className="tumble-title">
          <span className="tumble-icon">
            {index === 0 ? (isBaseGame ? "🎯" : "🎲") : "⚡"}
          </span>
          <span className="tumble-text">
            {index === 0
              ? isBaseGame
                ? "Initial Spin"
                : "Free Spin"
              : `Tumble ${index}`}
          </span>
        </div>
        {reelData.winAmount > 0 && (
          <div className="tumble-win">
            <div className="win-info">
              <span className="win-label">Win</span>
              <span className="win-amount">
                {currency} {reelData.winAmount.toFixed(2)}
              </span>
            </div>
            {reelData.multiplier > 1 && (
              <span className="multiplier-badge">{reelData.multiplier}x</span>
            )}
          </div>
        )}
      </div>

      <ReelDisplay
        reelView={reelData.view}
        winningSymbols={reelData.winningSymbols}
        highlightedSymbol={highlightedSymbol}
        onSymbolClick={onSymbolHighlight}
        scatterPositions={reelData.scatterPositions}
      />

      {reelData.winningSymbols.length > 0 && (
        <div className="winning-symbols-section">
          <div className="symbols-header">
            <span className="symbols-title">🏆 Winning Symbols</span>
            <span className="symbols-count">
              ({reelData.winningSymbols.length})
            </span>
          </div>
          <div className="symbols-grid">
            {reelData.winningSymbols.map((symbolData, idx) => (
              <div
                key={idx}
                className={`symbol-card ${
                  highlightedSymbol === symbolData.symbol ? "highlighted" : ""
                }`}
                onClick={() => onSymbolHighlight(symbolData.symbol)}
              >
                <div className="symbol-display">
                  <span className="symbol-large">{symbolData.symbol}</span>
                </div>
                <div className="symbol-info">
                  <div className="symbol-name">{symbolData.symbol}</div>
                  <div className="symbol-count">
                    ×{symbolData.positions.length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="win-summary">
        <div className="summary-header">
          <span className="summary-title">💰 Win Summary</span>
        </div>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-label">Tumble Win</div>
            <div className="summary-value">
              {currency} {reelData.winAmount.toFixed(2)}
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Multiplier</div>
            <div className="summary-value multiplier">
              {totalMultiplier > 0 ? `${totalMultiplier}x` : "1x"}
            </div>
          </div>
          <div className="summary-item total">
            <div className="summary-label">Total Win</div>
            <div className="summary-value total-value">
              {currency} {totalWin.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tumble-view {
          margin-bottom: 24px;
          animation: fadeInScale 0.5s ease-out;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .tumble-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          margin-bottom: 16px;
        }

        .tumble-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tumble-icon {
          font-size: 20px;
        }

        .tumble-text {
          font-weight: 700;
          color: #334155;
          font-size: 16px;
        }

        .tumble-win {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .win-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding: 8px 16px;
          background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.08) 0%,
            rgba(22, 163, 74, 0.08) 100%
          );
          border-radius: 12px;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .win-label {
          font-size: 10px;
          color: #16a34a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .win-amount {
          font-weight: 700;
          color: #22c55e;
          font-size: 14px;
        }

        .multiplier-badge {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .winning-symbols-section {
          margin-top: 20px;
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .symbols-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .symbols-title {
          font-weight: 700;
          color: #6366f1;
          font-size: 16px;
        }

        .symbols-count {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .symbols-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
        }

        .symbol-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 2px solid transparent;
        }

        .symbol-card:hover {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .symbol-card.highlighted {
          background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.15) 0%,
            rgba(139, 92, 246, 0.15) 100%
          );
          border-color: #6366f1;
          transform: translateY(-6px) scale(1.1);
          box-shadow: 0 12px 35px rgba(99, 102, 241, 0.3);
        }

        .symbol-display {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 12px;
          margin-bottom: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .symbol-large {
          font-size: 24px;
          font-weight: 700;
          color: #334155;
        }

        .symbol-info {
          text-align: center;
        }

        .symbol-name {
          font-weight: 600;
          color: #475569;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .symbol-count {
          font-weight: 700;
          color: #6366f1;
          font-size: 12px;
          background: rgba(99, 102, 241, 0.1);
          padding: 2px 8px;
          border-radius: 12px;
        }

        .win-summary {
          margin-top: 20px;
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .summary-header {
          margin-bottom: 16px;
        }

        .summary-title {
          font-weight: 700;
          color: #334155;
          font-size: 16px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 480px) {
          .summary-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .summary-item {
          text-align: center;
          padding: 12px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .summary-item.total {
          background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.08) 0%,
            rgba(139, 92, 246, 0.08) 100%
          );
          border-color: rgba(99, 102, 241, 0.3);
        }

        .summary-label {
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .summary-value {
          font-weight: 700;
          color: #334155;
          font-size: 16px;
        }

        .summary-value.multiplier {
          color: #f59e0b;
        }

        .summary-value.total-value {
          color: #6366f1;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

const ReelDisplay = ({
  reelView,
  winningSymbols = [],
  highlightedSymbol,
  onSymbolClick,
  scatterPositions = [],
}) => {
  const isWinningSymbol = (row, col, symbol) => {
    if (!winningSymbols?.length) return false;

    return winningSymbols.some((ws) => {
      if (ws.symbol !== symbol) return false;

      return ws.positions.some((pos) => {
        return (
          (pos[0] === row && pos[1] === col) ||
          (pos[0] === col && pos[1] === row)
        );
      });
    });
  };

  const isScatter = (row, col) => {
    const position = row * 6 + col;
    return scatterPositions.includes(position);
  };

  return (
    <div className="reel-grid">
      {reelView.map((column, colIndex) => (
        <div key={`col-${colIndex}`} className="reel-column">
          {column.map((symbol, rowIndex) => {
            const isWinner = isWinningSymbol(rowIndex, colIndex, symbol);
            const isHighlighted = highlightedSymbol === symbol;
            const isScatterSymbol = isScatter(rowIndex, colIndex);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  symbol-cell 
                  ${isWinner ? "winning" : ""} 
                  ${isHighlighted ? "highlighted" : ""}
                  ${isScatterSymbol ? "scatter" : ""}
                  ${symbol.startsWith("H") ? "high-symbol" : ""}
                  ${symbol.startsWith("L") ? "low-symbol" : ""}
                `}
                onClick={() => onSymbolClick(symbol)}
              >
                <div className="symbol-content">
                  <span className="symbol-text">{symbol}</span>
                  {isWinner && <div className="win-indicator">✨</div>}
                  {isScatterSymbol && (
                    <div className="scatter-indicator">SC</div>
                  )}
                </div>
                {isWinner && <div className="win-glow"></div>}
              </div>
            );
          })}
        </div>
      ))}

      <style jsx>{`
        .reel-grid {
          display: flex;
          gap: 8px;
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin: 20px 0;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .reel-column {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .symbol-cell {
          position: relative;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #334155;
          font-size: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .symbol-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .symbol-text {
          font-weight: 800;
          font-size: 16px;
        }

        .symbol-cell:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-color: #cbd5e1;
        }

        .symbol-cell.winning {
          background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.15) 0%,
            rgba(22, 163, 74, 0.15) 100%
          );
          border-color: #22c55e;
          animation: winPulse 2s ease-in-out infinite;
        }

        @keyframes winPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
            transform: scale(1.05);
          }
        }

        .symbol-cell.highlighted {
          background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.2) 0%,
            rgba(139, 92, 246, 0.2) 100%
          );
          border-color: #6366f1;
          transform: scale(1.1);
          box-shadow: 0 12px 35px rgba(99, 102, 241, 0.3);
          z-index: 10;
        }

        .symbol-cell.scatter {
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.15) 0%,
            rgba(220, 38, 38, 0.15) 100%
          );
          border-color: #ef4444;
          animation: scatterGlow 1.5s ease-in-out infinite alternate;
        }

        @keyframes scatterGlow {
          0% {
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
          }
          100% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
          }
        }

        .symbol-cell.high-symbol {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        }

        .symbol-cell.low-symbol {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        }

        .win-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #22c55e, #16a34a);
          border-radius: 14px;
          z-index: 1;
          opacity: 0.3;
          animation: glowRotate 2s linear infinite;
        }

        @keyframes glowRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .win-indicator {
          position: absolute;
          top: 4px;
          right: 4px;
          color: #22c55e;
          font-size: 12px;
          animation: sparkle 1.5s ease-in-out infinite;
          z-index: 3;
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2) rotate(180deg);
          }
        }

        .scatter-indicator {
          position: absolute;
          bottom: 4px;
          right: 4px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          font-size: 8px;
          padding: 2px 6px;
          border-radius: 8px;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          z-index: 3;
        }
      `}</style>
    </div>
  );
};

export default SlotResultDisplay;
