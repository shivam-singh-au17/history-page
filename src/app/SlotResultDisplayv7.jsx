"use client";

import React, { useState } from "react";

const SlotResultDisplay = ({ roundData }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [expandedSpins, setExpandedSpins] = useState([]);
  const [highlightedSymbol, setHighlightedSymbol] = useState(null);
  const [showWinningSymbolsModal, setShowWinningSymbolsModal] = useState(false);

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

  const getAllWinningSymbols = () => {
    const symbols = [];

    if (gameData.baseGame) {
      gameData.baseGame.reelViews.forEach((reel) => {
        reel.winningSymbols.forEach((ws) => {
          const existing = symbols.find((s) => s.symbol === ws.symbol);
          if (existing) {
            existing.count += ws.positions.length;
          } else {
            symbols.push({
              symbol: ws.symbol,
              count: ws.positions.length,
              type: "Base Game",
            });
          }
        });
      });
    }

    gameData.freeSpins.forEach((spin) => {
      spin.reelViews.forEach((reel) => {
        reel.winningSymbols.forEach((ws) => {
          const existing = symbols.find((s) => s.symbol === ws.symbol);
          if (existing) {
            existing.count += ws.positions.length;
          } else {
            symbols.push({
              symbol: ws.symbol,
              count: ws.positions.length,
              type: `Free Spin ${spin.spinNumber}`,
            });
          }
        });
      });
    });

    return symbols;
  };

  const winningSymbols = getAllWinningSymbols();

  return (
    <div className="result-container">
      {/* Header Section */}
      <header className="header">
        <h1 className="game-title">{gameData.gameName}</h1>
        <div className="round-info">
          <div className="info-item">
            <span className="label">Round ID:</span>
            <span className="value">{gameData.roundId}</span>
          </div>
          <div className="info-item">
            <span className="label">Time:</span>
            <span className="value">
              {gameData.startTime} - {gameData.endTime}
            </span>
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
          <span className="value">
            {gameData.status
              .split("_")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </span>
        </div>
        <div className="bet-info-item">
          <span className="label">Free Bet:</span>
          <span className="value">{gameData.isFreeBet ? "Yes" : "No"}</span>
        </div>
        <div className="bet-info-item">
          <span className="label">Buy Bonus:</span>
          <span className="value">{gameData.buyBonus ? "Yes" : "No"}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="navigation-tabs">
        <button
          className={`tab-button ${activeTab === "summary" ? "active" : ""}`}
          onClick={() => setActiveTab("summary")}
        >
          Round Summary
        </button>
        <button
          className={`tab-button ${activeTab === "base" ? "active" : ""}`}
          onClick={() => setActiveTab("base")}
        >
          Base Game
        </button>
        {gameData.totalFreeSpins > 0 && (
          <button
            className={`tab-button ${
              activeTab === "freespins" ? "active" : ""
            }`}
            onClick={() => setActiveTab("freespins")}
          >
            Free Spins ({gameData.totalFreeSpins})
          </button>
        )}
        {winningSymbols.length > 0 && (
          <button
            className="tab-button winning-symbols-tab"
            onClick={() => setShowWinningSymbolsModal(true)}
          >
            Winning Symbols
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="content-section">
        {activeTab === "summary" && (
          <div className="summary-view">
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
                    {gameData.totalFreeSpins} Spin(s)
                  </td>
                  <td className="table-cell">
                    {gameData.currency} {gameData.betAmount.toFixed(2)}
                  </td>
                  <td className="table-cell highlight">
                    {gameData.currency} {gameData.totalWin.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="footnote">* Bet / 20 = Possible Bet Amount</div>
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
          <div className="total-win-label">TOTAL WIN:</div>
          <div className="total-win-amount">
            {gameData.currency} {gameData.totalWin.toFixed(2)}
          </div>
        </div>
      )}

      {/* Winning Symbols Modal */}
      {showWinningSymbolsModal && (
        <div className="winning-symbols-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Winning Symbols</h2>
              <button
                className="close-button"
                onClick={() => setShowWinningSymbolsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="symbols-grid">
              {winningSymbols.map((ws, index) => (
                <div
                  key={index}
                  className={`symbol-card ${
                    highlightedSymbol === ws.symbol ? "highlighted" : ""
                  }`}
                  onClick={() => handleSymbolHighlight(ws.symbol)}
                >
                  <div className="symbol-display">{ws.symbol}</div>
                  <div className="symbol-count">×{ws.count}</div>
                  <div className="symbol-source">{ws.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .result-container {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          max-width: 900px;
          margin: 0 auto;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          animation: fadeIn 0.5s ease-out;
          position: relative;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header {
          padding: 20px;
          background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          color: white;
        }

        .game-title {
          margin: 0 0 10px 0;
          font-size: 24px;
          text-align: center;
        }

        .round-info {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 15px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
        }

        .label {
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 4px;
        }

        .value {
          font-weight: bold;
        }

        .bet-info {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          padding: 15px 20px;
          background: rgba(0, 0, 0, 0.03);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .bet-info-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bet-info-item .label {
          margin-bottom: 0;
        }

        .navigation-tabs {
          display: flex;
          background: #f0ebff;
          border-bottom: 1px solid #e0d5ff;
          overflow-x: auto;
        }

        .tab-button {
          flex: 1;
          padding: 15px;
          border: none;
          background: transparent;
          color: #666;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          min-width: 120px;
          white-space: nowrap;
        }

        .tab-button:hover {
          background: rgba(255, 255, 255, 0.7);
        }

        .tab-button.active {
          background: #ffffff;
          color: #6a11cb;
        }

        .tab-button.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #6a11cb;
        }

        .winning-symbols-tab {
          background: rgba(106, 17, 203, 0.1);
          color: #6a11cb;
        }

        .winning-symbols-tab:hover {
          background: rgba(106, 17, 203, 0.2);
        }

        .content-section {
          padding: 20px;
        }

        .summary-view {
          width: 100%;
        }

        .summary-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }

        .table-header {
          padding: 12px;
          text-align: left;
          background: rgba(106, 17, 203, 0.1);
          color: #6a11cb;
          font-weight: bold;
        }

        .table-cell {
          padding: 12px;
          border-bottom: 1px solid #e0d5ff;
        }

        .table-cell.highlight {
          background: rgba(106, 17, 203, 0.05);
          font-weight: bold;
        }

        .footnote {
          font-size: 12px;
          color: #666;
          text-align: center;
          margin-top: 10px;
        }

        .total-win-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          color: white;
          font-size: 18px;
          font-weight: bold;
          animation: pulse 1s ease-in-out infinite alternate;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .total-win-label {
          font-weight: bold;
        }

        .total-win-amount {
          font-size: 24px;
          color: #ffd700;
        }

        /* Winning Symbols Modal Styles */
        .winning-symbols-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 800px;
          max-height: 80vh;
          overflow-y: auto;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h2 {
          margin: 0;
          color: #6a11cb;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 5px 10px;
        }

        .close-button:hover {
          color: #333;
        }

        .symbols-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 15px;
        }

        .symbol-card {
          background: #f9f9f9;
          border-radius: 12px;
          padding: 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }

        .symbol-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .symbol-card.highlighted {
          background: rgba(106, 17, 203, 0.1);
          border-color: #6a11cb;
        }

        .symbol-display {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #6a11cb;
        }

        .symbol-count {
          font-size: 16px;
          color: #666;
          margin-bottom: 5px;
        }

        .symbol-source {
          font-size: 12px;
          color: #999;
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
      <h2 className="section-title">Base Game Results</h2>

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
      {spins.map((spin) => (
        <div key={spin.spinNumber} className="spin-container">
          <div
            className="spin-header"
            onClick={() => onToggleExpand(spin.spinNumber)}
          >
            <div className="spin-title">Free Spin {spin.spinNumber}</div>
            <div className="spin-win">
              {currency} {spin.totalWin.toFixed(2)}
            </div>
            <div
              className={`expand-icon ${
                expandedSpins.includes(spin.spinNumber) ? "expanded" : ""
              }`}
            >
              ▼
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
                  <span className="multiplier-label">Total Multiplier:</span>
                  <span className="multiplier-value">
                    {spin.totalMultiplier}x
                  </span>
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
          gap: 10px;
        }

        .spin-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e0d5ff;
        }

        .spin-header {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .spin-header:hover {
          background: #f8f5ff;
        }

        .spin-title {
          flex: 1;
          font-weight: bold;
          color: #6a11cb;
        }

        .spin-win {
          margin: 0 15px;
          padding: 5px 15px;
          background: rgba(106, 17, 203, 0.1);
          border-radius: 20px;
          font-weight: bold;
          color: #6a11cb;
        }

        .expand-icon {
          transition: transform 0.3s ease;
          font-size: 12px;
          color: #666;
        }

        .expand-icon.expanded {
          transform: rotate(180deg);
        }

        .spin-details {
          padding: 0 20px 20px;
          border-top: 1px solid #f0ebff;
        }

        .multiplier-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 15px;
          padding: 10px;
          background: rgba(255, 87, 34, 0.1);
          border-radius: 8px;
        }

        .multiplier-label {
          font-weight: bold;
          color: #ff5722;
        }

        .multiplier-value {
          font-weight: bold;
          color: #ff5722;
          font-size: 18px;
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
        <span>
          {index === 0
            ? isBaseGame
              ? "Initial Spin"
              : "Free Spin"
            : `Tumble ${index}`}
        </span>
        {reelData.winAmount > 0 && (
          <div className="tumble-win">
            Win: {currency} {reelData.winAmount.toFixed(2)}
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
          <div className="symbols-title">Winning Symbols:</div>
          <div className="symbols-list">
            {reelData.winningSymbols.map((symbolData, idx) => (
              <div
                key={idx}
                className={`symbol-badge ${
                  highlightedSymbol === symbolData.symbol ? "highlighted" : ""
                }`}
                onClick={() => onSymbolHighlight(symbolData.symbol)}
              >
                <span className="symbol-text">{symbolData.symbol}</span>
                <span className="symbol-count">
                  ×{symbolData.positions.length}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="win-summary">
        <div className="win-summary-row">
          <div className="win-label">Win:</div>
          <div className="win-value">
            {currency} {reelData.winAmount.toFixed(2)}
          </div>
        </div>
        <div className="win-summary-row">
          <div className="win-label">Multiplier:</div>
          <div className="win-value">{totalMultiplier}x</div>
        </div>
        <div className="win-summary-row">
          <div className="win-label">Total Win:</div>
          <div className="win-value">
            {currency} {totalWin.toFixed(2)}
          </div>
        </div>
      </div>

      <style jsx>{`
        .tumble-view {
          margin-bottom: 20px;
          background: white;
          border-radius: 12px;
          padding: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e0d5ff;
        }

        .tumble-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          font-weight: bold;
          color: #666;
        }

        .tumble-win {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .multiplier-badge {
          background: #ff5722;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: bold;
        }

        .winning-symbols-section {
          margin-top: 15px;
        }

        .symbols-title {
          font-weight: bold;
          color: #6a11cb;
          margin-bottom: 8px;
          font-size: 16px;
        }

        .symbols-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .symbol-badge {
          padding: 8px 12px;
          background: rgba(106, 17, 203, 0.1);
          color: #6a11cb;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .symbol-badge:hover {
          background: rgba(106, 17, 203, 0.2);
        }

        .symbol-badge.highlighted {
          background: #6a11cb;
          color: white;
        }

        .symbol-text {
          font-size: 16px;
        }

        .symbol-count {
          font-size: 12px;
          opacity: 0.9;
        }

        .win-summary {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 15px;
          padding: 10px;
          background: rgba(106, 17, 203, 0.05);
          border-radius: 8px;
        }

        .win-summary-row {
          display: flex;
          justify-content: space-between;
        }

        .win-label {
          color: #666;
          font-size: 14px;
        }

        .win-value {
          font-weight: bold;
          color: #6a11cb;
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
                {symbol}
                {isWinner && <div className="win-indicator">★</div>}
                {isScatterSymbol && <div className="scatter-indicator">SC</div>}
              </div>
            );
          })}
        </div>
      ))}

      <style jsx>{`
        .reel-grid {
          display: flex;
          gap: 10px;
          background: white;
          border-radius: 12px;
          padding: 15px;
          margin: 15px 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e0d5ff;
        }

        .reel-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .symbol-cell {
          position: relative;
          background: #f9f9f9;
          border: 1px solid #e0d5ff;
          border-radius: 8px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #333;
          font-size: 18px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .symbol-cell:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }

        .symbol-cell.winning {
          background: rgba(106, 17, 203, 0.1);
          border: 2px solid #6a11cb;
          animation: pulse 0.5s ease-in-out;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .symbol-cell.highlighted {
          background: rgba(106, 17, 203, 0.2);
          border: 2px solid #6a11cb;
          transform: scale(1.05);
        }

        .symbol-cell.scatter {
          background: rgba(255, 100, 100, 0.1);
          border: 2px solid #ff5722;
        }

        .symbol-cell.high-symbol {
          background: #f0f7ff;
        }

        .symbol-cell.low-symbol {
          background: #f0fff4;
        }

        .win-indicator {
          position: absolute;
          top: 2px;
          right: 2px;
          color: #6a11cb;
          font-size: 12px;
        }

        .scatter-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: #ff5722;
          color: white;
          font-size: 10px;
          padding: 2px 5px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default SlotResultDisplay;
