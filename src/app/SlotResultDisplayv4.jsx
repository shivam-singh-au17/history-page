"use client";


import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const SlotResultDisplay = ({ roundData }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [expandedSpins, setExpandedSpins] = useState([]);
  const [highlightedSymbol, setHighlightedSymbol] = useState(null);

  // Parse the data structure
  const parsedData = {
    roundId: roundData.roundId,
    gameName: roundData.gameName,
    startTime: new Date(roundData.createdAt).toLocaleString(),
    endTime: new Date(roundData.endTime).toLocaleString(),
    betAmount: roundData.betAmount / 100,
    totalWin: roundData.winAmount / 100,
    currency: roundData.currencyCode,
    totalFreeSpins: roundData.totalFreeSpins,
    isFreeBet: roundData.isFreeBet,
    buyBonus: roundData.buyBonus,
    status: roundData.status,
    baseGame: {
      reelView: roundData.extraData[0]?.cascadeData[0]?.reelView || [],
      win: roundData.extraData[0]?.baseWin || 0,
      totalWin: roundData.extraData[0]?.totalWin || 0,
    },
    freeSpins: roundData.extraData
      .slice(0, roundData.totalFreeSpins)
      .map((spin, index) => ({
        spinNumber: index + 1,
        reelViews: spin.cascadeData.map((cascade) => ({
          view: cascade.reelView,
          winAmount: cascade.spinWin || 0,
          winningSymbols: cascade.blustSymbols || [],
          multiplier: cascade.multiplier?.[0]?.multiplier || 1,
          scatterPositions: cascade.scatterPositions || [],
        })),
        totalWin: spin.totalWin || 0,
      })),
  };

  const toggleSpinExpand = (spinNumber) => {
    if (expandedSpins.includes(spinNumber)) {
      setExpandedSpins(expandedSpins.filter((n) => n !== spinNumber));
    } else {
      setExpandedSpins([...expandedSpins, spinNumber]);
    }
  };

  const handleSymbolHighlight = (symbol) => {
    setHighlightedSymbol(highlightedSymbol === symbol ? null : symbol);
  };

  return (
    <ResultContainer>
      <Header>
        <GameTitle>{parsedData.gameName}</GameTitle>
        <RoundInfo>
          <InfoItem>
            <Label>Round ID:</Label>
            <Value>{parsedData.roundId}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Time:</Label>
            <Value>
              {parsedData.startTime} - {parsedData.endTime}
            </Value>
          </InfoItem>
          <InfoItem>
            <Label>BB Type:</Label>
            <Value>FGI</Value>
          </InfoItem>
        </RoundInfo>
      </Header>

      <BetInfo>
        <BetInfoItem>
          <Label>Bet Amount:</Label>
          <Value>
            {parsedData.currency} {parsedData.betAmount.toFixed(2)}
          </Value>
        </BetInfoItem>
        <BetInfoItem>
          <Label>Status:</Label>
          <Value>
            {parsedData.status
              .split("_")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </Value>
        </BetInfoItem>
        <BetInfoItem>
          <Label>Free Bet:</Label>
          <Value>{parsedData.isFreeBet ? "Yes" : "No"}</Value>
        </BetInfoItem>
        <BetInfoItem>
          <Label>Buy Bonus:</Label>
          <Value>{parsedData.buyBonus ? "Yes" : "No"}</Value>
        </BetInfoItem>
      </BetInfo>

      <NavigationTabs>
        <TabButton
          active={activeTab === "summary"}
          onClick={() => setActiveTab("summary")}
        >
          Round Summary
        </TabButton>
        <TabButton
          active={activeTab === "base"}
          onClick={() => setActiveTab("base")}
        >
          Base Game
        </TabButton>
        <TabButton
          active={activeTab === "freespins"}
          onClick={() => setActiveTab("freespins")}
        >
          Free Spins ({parsedData.totalFreeSpins})
        </TabButton>
      </NavigationTabs>

      <ContentSection>
        {activeTab === "summary" && (
          <SummaryView
            totalBet={parsedData.betAmount}
            totalWin={parsedData.totalWin}
            totalSpins={parsedData.totalFreeSpins}
            currency={parsedData.currency}
          />
        )}

        {activeTab === "base" && (
          <BaseGameView
            reelView={parsedData.baseGame.reelView}
            win={parsedData.baseGame.win}
            totalWin={parsedData.baseGame.totalWin}
            currency={parsedData.currency}
          />
        )}

        {activeTab === "freespins" && (
          <FreeSpinsView
            spins={parsedData.freeSpins}
            expandedSpins={expandedSpins}
            onToggleExpand={toggleSpinExpand}
            currency={parsedData.currency}
            onSymbolHighlight={handleSymbolHighlight}
            highlightedSymbol={highlightedSymbol}
          />
        )}
      </ContentSection>

      {parsedData.totalWin > 0 && (
        <TotalWinContainer>
          <TotalWinLabel>TOTAL WIN:</TotalWinLabel>
          <TotalWinAmount>
            {parsedData.currency} {parsedData.totalWin.toFixed(2)}
          </TotalWinAmount>
        </TotalWinContainer>
      )}
    </ResultContainer>
  );
};

// Sub-components
const SummaryView = ({ totalBet, totalWin, totalSpins, currency }) => (
  <SummaryContainer>
    <SummaryTable>
      <thead>
        <tr>
          <TableHeader>Free Spin</TableHeader>
          <TableHeader>Total Round Bet</TableHeader>
          <TableHeader>Total Round Win</TableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <TableCell>{totalSpins} Spin(s)</TableCell>
          <TableCell>
            {currency} {totalBet.toFixed(2)}
          </TableCell>
          <TableCell highlight>
            {currency} {totalWin.toFixed(2)}
          </TableCell>
        </tr>
      </tbody>
    </SummaryTable>
    <Footnote>* Bet / 20 = Possible Bet Amount</Footnote>
  </SummaryContainer>
);

const BaseGameView = ({ reelView, win, totalWin, currency }) => (
  <BaseGameContainer>
    <SectionTitle>Base Game Reels</SectionTitle>
    <ReelDisplay reelView={reelView} />

    <WinResults>
      <WinResult>
        <WinLabel>Base Win:</WinLabel>
        <WinValue>
          {currency} {win.toFixed(2)}
        </WinValue>
      </WinResult>
      <WinResult>
        <WinLabel>Total Win:</WinLabel>
        <WinValue>
          {currency} {totalWin.toFixed(2)}
        </WinValue>
      </WinResult>
    </WinResults>
  </BaseGameContainer>
);

const FreeSpinsView = ({
  spins,
  expandedSpins,
  onToggleExpand,
  currency,
  onSymbolHighlight,
  highlightedSymbol,
}) => (
  <FreeSpinsContainer>
    {spins.map((spin) => (
      <SpinContainer key={spin.spinNumber}>
        <SpinHeader onClick={() => onToggleExpand(spin.spinNumber)}>
          <SpinTitle>Free Spin {spin.spinNumber}</SpinTitle>
          <SpinWin>
            {currency} {spin.totalWin.toFixed(2)}
          </SpinWin>
          <ExpandIcon expanded={expandedSpins.includes(spin.spinNumber)}>
            ▼
          </ExpandIcon>
        </SpinHeader>

        {expandedSpins.includes(spin.spinNumber) && (
          <SpinDetails>
            {spin.reelViews.map((reelData, index) => (
              <TumbleView key={index}>
                <TumbleHeader>
                  {index === 0 ? "Initial Spin" : `Tumble ${index}`}
                  {reelData.winAmount > 0 && (
                    <TumbleWin>
                      Win: {currency} {reelData.winAmount.toFixed(2)}
                      {reelData.multiplier > 1 && (
                        <MultiplierBadge>
                          {reelData.multiplier}x
                        </MultiplierBadge>
                      )}
                    </TumbleWin>
                  )}
                </TumbleHeader>

                <ReelDisplay
                  reelView={reelData.view}
                  winningSymbols={reelData.winningSymbols}
                  highlightedSymbol={highlightedSymbol}
                  onSymbolClick={onSymbolHighlight}
                />

                {reelData.winningSymbols.length > 0 && (
                  <WinningSymbolsSection>
                    <SymbolsTitle>Winning Symbols:</SymbolsTitle>
                    <SymbolsList>
                      {reelData.winningSymbols.map((symbolData, idx) => (
                        <SymbolBadge
                          key={idx}
                          onClick={() => onSymbolHighlight(symbolData.symbol)}
                          highlighted={highlightedSymbol === symbolData.symbol}
                        >
                          {symbolData.symbol} ×{symbolData.positions.length}
                        </SymbolBadge>
                      ))}
                    </SymbolsList>
                  </WinningSymbolsSection>
                )}

                <WinSummary>
                  <WinSummaryRow>
                    <WinLabel>Win:</WinLabel>
                    <WinValue>
                      {currency} {reelData.winAmount.toFixed(2)}
                    </WinValue>
                  </WinSummaryRow>
                  <WinSummaryRow>
                    <WinLabel>Total Win:</WinLabel>
                    <WinValue>
                      {currency}{" "}
                      {spin.reelViews
                        .slice(0, index + 1)
                        .reduce((sum, r) => sum + r.winAmount, 0)
                        .toFixed(2)}
                    </WinValue>
                  </WinSummaryRow>
                </WinSummary>
              </TumbleView>
            ))}
          </SpinDetails>
        )}
      </SpinContainer>
    ))}
  </FreeSpinsContainer>
);

const ReelDisplay = ({
  reelView,
  winningSymbols = [],
  highlightedSymbol,
  onSymbolClick,
}) => {
  const isWinningSymbol = (row, col, symbol) => {
    return winningSymbols.some(
      (ws) =>
        ws.symbol === symbol &&
        ws.positions.some((pos) => pos[0] === row && pos[1] === col)
    );
  };

  return (
    <ReelGrid>
      {reelView.map((column, colIndex) => (
        <ReelColumn key={`col-${colIndex}`}>
          {column.map((symbol, rowIndex) => {
            const isWinner = isWinningSymbol(rowIndex, colIndex, symbol);
            const isHighlighted = highlightedSymbol === symbol;

            return (
              <SymbolCell
                key={`${rowIndex}-${colIndex}`}
                symbol={symbol}
                winning={isWinner}
                highlighted={isHighlighted}
                onClick={() => onSymbolClick(symbol)}
              >
                {symbol}
                {isWinner && <WinIndicator />}
              </SymbolCell>
            );
          })}
        </ReelColumn>
      ))}
    </ReelGrid>
  );
};

// Styled Components
const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const ResultContainer = styled.div`
  background: #f8f5ff;
  background: linear-gradient(to bottom, #ffffff 0%, #f8f5ff 100%);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  animation: ${slideIn} 0.5s ease-out;
`;

const Header = styled.div`
  padding: 20px;
  background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
  color: white;
`;

const GameTitle = styled.h1`
  margin: 0 0 10px 0;
  font-size: 24px;
  text-align: center;
`;

const RoundInfo = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
`;

const Value = styled.span`
  font-weight: bold;
`;

const BetInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const BetInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${Label} {
    margin-bottom: 0;
  }
`;

const NavigationTabs = styled.div`
  display: flex;
  background: #f0ebff;
  border-bottom: 1px solid #e0d5ff;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 15px;
  border: none;
  background: ${(props) => (props.active ? "#ffffff" : "transparent")};
  color: ${(props) => (props.active ? "#6a11cb" : "#666")};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(props) => (props.active ? "#6a11cb" : "transparent")};
  }
`;

const ContentSection = styled.div`
  padding: 20px;
`;

const SummaryContainer = styled.div``;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  background: rgba(106, 17, 203, 0.1);
  color: #6a11cb;
  font-weight: bold;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e0d5ff;
  background: ${(props) =>
    props.highlight ? "rgba(106, 17, 203, 0.05)" : "transparent"};
  font-weight: ${(props) => (props.highlight ? "bold" : "normal")};
`;

const Footnote = styled.div`
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: 10px;
`;

const BaseGameContainer = styled.div``;

const SectionTitle = styled.h2`
  color: #6a11cb;
  font-size: 18px;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0d5ff;
`;

const ReelGrid = styled.div`
  display: flex;
  gap: 8px;
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin: 15px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0d5ff;
`;

const ReelColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const SymbolCell = styled.div`
  position: relative;
  background: ${(props) => {
    if (props.highlighted) return "rgba(106, 17, 203, 0.2)";
    if (props.winning) return "rgba(106, 17, 203, 0.1)";
    if (props.symbol.startsWith("H")) return "#f0f7ff";
    if (props.symbol.startsWith("L")) return "#f0fff4";
    return "#f9f9f9";
  }};
  border: 1px solid
    ${(props) => {
      if (props.highlighted) return "#6a11cb";
      if (props.winning) return "#6a11cb";
      return "#e0d5ff";
    }};
  border-radius: 8px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #333;
  font-size: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const WinIndicator = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 20px 20px 0;
  border-color: transparent #6a11cb transparent transparent;

  &::after {
    content: "★";
    position: absolute;
    top: 2px;
    right: -16px;
    color: white;
    font-size: 10px;
  }
`;

const WinResults = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 15px;
`;

const WinResult = styled.div`
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0d5ff;
`;

const WinLabel = styled.div`
  color: #666;
  font-size: 14px;
`;

const WinValue = styled.div`
  font-weight: bold;
  color: #6a11cb;
  font-size: 18px;
`;

const FreeSpinsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SpinContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0d5ff;
`;

const SpinHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f5ff;
  }
`;

const SpinTitle = styled.div`
  flex: 1;
  font-weight: bold;
  color: #6a11cb;
`;

const SpinWin = styled.div`
  margin: 0 15px;
  padding: 5px 15px;
  background: rgba(106, 17, 203, 0.1);
  border-radius: 20px;
  font-weight: bold;
  color: #6a11cb;
`;

const ExpandIcon = styled.div`
  transform: rotate(${(props) => (props.expanded ? "180deg" : "0deg")});
  transition: transform 0.3s ease;
  font-size: 12px;
  color: #666;
`;

const SpinDetails = styled.div`
  padding: 0 20px 20px;
  border-top: 1px solid #f0ebff;
`;

const TumbleView = styled.div`
  margin-bottom: 20px;
`;

const TumbleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  font-weight: bold;
  color: #666;
`;

const TumbleWin = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MultiplierBadge = styled.span`
  background: #ff5722;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
`;

const WinningSymbolsSection = styled.div`
  margin-top: 15px;
`;

const SymbolsTitle = styled.div`
  font-weight: bold;
  color: #6a11cb;
  margin-bottom: 8px;
`;

const SymbolsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SymbolBadge = styled.div`
  padding: 5px 10px;
  background: ${(props) =>
    props.highlighted ? "#6a11cb" : "rgba(106, 17, 203, 0.1)"};
  color: ${(props) => (props.highlighted ? "white" : "#6a11cb")};
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(106, 17, 203, 0.2);
  }
`;

const WinSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 15px;
  padding: 10px;
  background: rgba(106, 17, 203, 0.05);
  border-radius: 8px;
`;

const WinSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TotalWinContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
  color: white;
  font-size: 18px;
  font-weight: bold;
  animation: ${pulse} 1s ease-in-out infinite alternate;
`;

const TotalWinLabel = styled.div``;

const TotalWinAmount = styled.div`
  font-size: 24px;
  color: #ffd700;
`;

export default SlotResultDisplay;