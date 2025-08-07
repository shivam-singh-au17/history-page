"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const SlotResultDisplay = ({ roundData }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [expandedSpins, setExpandedSpins] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [parsedData, setParsedData] = useState(null);

  useEffect(() => {
    // Parse the data when component mounts
    if (roundData) {
      const baseSpinIndex = roundData.extraData.findIndex(
        (item) => item.nextFeature === null
      );

      const freeSpins =
        baseSpinIndex !== -1 ? roundData.extraData.slice(0, baseSpinIndex) : [];

      const baseSpin =
        baseSpinIndex !== -1
          ? roundData.extraData[baseSpinIndex]
          : roundData.extraData[roundData.extraData.length - 1];

      const processedData = {
        roundId: roundData.roundId,
        gameName: roundData.gameName,
        startTime: new Date(roundData.createdAt).toLocaleString(),
        endTime: new Date(roundData.endTime).toLocaleString(),
        totalFreeSpins: roundData.totalFreeSpins,
        totalWin: roundData.winAmount / 100,
        currency: roundData.currencyCode,
        baseGame: {
          reelView: baseSpin?.cascadeData[0]?.reelView || [],
          win: baseSpin?.baseWin || 0,
          totalWin: baseSpin?.totalWin || 0,
          scatterPositions: baseSpin?.cascadeData[0]?.scatterPositions || [],
          blustSymbols: baseSpin?.cascadeData[0]?.blustSymbols || [],
          multiplier: baseSpin?.cascadeData[0]?.multiplier || [],
        },
        freeSpins: freeSpins.map((spin, index) => ({
          spinNumber: index + 1,
          reelViews: spin.cascadeData?.map((cascade) => cascade.reelView) || [],
          wins:
            spin.cascadeData?.map((cascade) => ({
              amount: cascade.spinWin || 0,
              multiplier: cascade.multiplier?.[0]?.multiplier || 1,
              winningSymbols: cascade.blustSymbols || [],
              scatterPositions: cascade.scatterPositions || [],
            })) || [],
          totalWin: spin.totalWin || 0,
          multipliers: spin.multipliers || [],
          currentCount: spin.currentCount || 0,
        })),
      };

      setParsedData(processedData);
    }
  }, [roundData]);

  const toggleSpinExpand = (spinNumber) => {
    if (expandedSpins.includes(spinNumber)) {
      setExpandedSpins(expandedSpins.filter((n) => n !== spinNumber));
    } else {
      setExpandedSpins([...expandedSpins, spinNumber]);
    }
  };

  const handleSymbolClick = (symbol) => {
    setSelectedSymbol(selectedSymbol === symbol ? null : symbol);
  };

  if (!parsedData) return <Loading>Loading game results...</Loading>;

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
        </RoundInfo>
      </Header>

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
            totalWin={parsedData.totalWin}
            totalSpins={parsedData.totalFreeSpins}
            currency={parsedData.currency}
          />
        )}

        {activeTab === "base" && (
          <BaseGameView
            data={parsedData.baseGame}
            currency={parsedData.currency}
            onSymbolClick={handleSymbolClick}
            selectedSymbol={selectedSymbol}
          />
        )}

        {activeTab === "freespins" && (
          <FreeSpinView
            spins={parsedData.freeSpins}
            expandedSpins={expandedSpins}
            onToggleExpand={toggleSpinExpand}
            currency={parsedData.currency}
            onSymbolClick={handleSymbolClick}
            selectedSymbol={selectedSymbol}
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
const SummaryView = ({ totalWin, totalSpins, currency }) => (
  <SummaryContainer>
    <SummaryCard>
      <SummaryTitle>Free Spins Awarded</SummaryTitle>
      <SummaryValue>{totalSpins}</SummaryValue>
    </SummaryCard>
    <SummaryCard highlight>
      <SummaryTitle>Total Win</SummaryTitle>
      <SummaryValue>
        {currency} {totalWin.toFixed(2)}
      </SummaryValue>
    </SummaryCard>
  </SummaryContainer>
);

const BaseGameView = ({ data, currency, onSymbolClick, selectedSymbol }) => (
  <BaseGameContainer>
    <SectionTitle>Base Game Results</SectionTitle>

    <ReelDisplay
      reelView={data.reelView}
      winningSymbols={data.blustSymbols}
      scatterPositions={data.scatterPositions}
      onSymbolClick={onSymbolClick}
      selectedSymbol={selectedSymbol}
    />

    <WinResults>
      <WinResult>
        <WinLabel>Base Win:</WinLabel>
        <WinValue>
          {currency} {data.win.toFixed(2)}
        </WinValue>
      </WinResult>
      <WinResult>
        <WinLabel>Total Win:</WinLabel>
        <WinValue>
          {currency} {data.totalWin.toFixed(2)}
        </WinValue>
      </WinResult>
    </WinResults>

    {data.blustSymbols.length > 0 && (
      <WinningSymbols>
        <SymbolsTitle>Winning Symbols:</SymbolsTitle>
        <SymbolsList>
          {data.blustSymbols.map((symbolData, index) => (
            <SymbolBadge
              key={index}
              onClick={() => onSymbolClick(symbolData.symbol)}
              selected={selectedSymbol === symbolData.symbol}
            >
              {symbolData.symbol} (x{symbolData.positions.length})
            </SymbolBadge>
          ))}
        </SymbolsList>
      </WinningSymbols>
    )}
  </BaseGameContainer>
);

const FreeSpinView = ({
  spins,
  expandedSpins,
  onToggleExpand,
  currency,
  onSymbolClick,
  selectedSymbol,
}) => (
  <FreeSpinContainer>
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
            {spin.reelViews.map((reelView, index) => (
              <TumbleView key={index}>
                <TumbleHeader>
                  {index === 0 ? "Initial Spin" : `Tumble ${index}`}
                  {spin.wins[index]?.amount > 0 && (
                    <TumbleWin>
                      Win: {currency} {spin.wins[index].amount.toFixed(2)}
                      {spin.wins[index]?.multiplier > 1 && (
                        <MultiplierBadge>
                          {spin.wins[index].multiplier}x
                        </MultiplierBadge>
                      )}
                    </TumbleWin>
                  )}
                </TumbleHeader>

                <ReelDisplay
                  reelView={reelView}
                  winningSymbols={spin.wins[index]?.winningSymbols || []}
                  scatterPositions={spin.wins[index]?.scatterPositions || []}
                  onSymbolClick={onSymbolClick}
                  selectedSymbol={selectedSymbol}
                />

                {spin.wins[index]?.winningSymbols?.length > 0 && (
                  <WinningSymbols>
                    <SymbolsTitle>Winning Symbols:</SymbolsTitle>
                    <SymbolsList>
                      {spin.wins[index].winningSymbols.map(
                        (symbolData, idx) => (
                          <SymbolBadge
                            key={idx}
                            onClick={() => onSymbolClick(symbolData.symbol)}
                            selected={selectedSymbol === symbolData.symbol}
                          >
                            {symbolData.symbol} (x{symbolData.positions.length})
                          </SymbolBadge>
                        )
                      )}
                    </SymbolsList>
                  </WinningSymbols>
                )}
              </TumbleView>
            ))}
          </SpinDetails>
        )}
      </SpinContainer>
    ))}
  </FreeSpinContainer>
);

const ReelDisplay = ({
  reelView,
  winningSymbols = [],
  scatterPositions = [],
  onSymbolClick,
  selectedSymbol,
}) => {
  const isWinningSymbol = (row, col) => {
    return winningSymbols.some((ws) =>
      ws.positions.some((pos) => pos[0] === row && pos[1] === col)
    );
  };

  const isScatter = (row, col) => {
    const position = row * reelView[0].length + col;
    return scatterPositions.includes(position);
  };

  return (
    <ReelGrid>
      {reelView.map((column, colIndex) => (
        <ReelColumn key={`col-${colIndex}`}>
          {column.map((symbol, rowIndex) => {
            const isWinner = isWinningSymbol(rowIndex, colIndex);
            const isScatterSymbol = isScatter(rowIndex, colIndex);

            return (
              <SymbolCell
                key={`${rowIndex}-${colIndex}`}
                symbol={symbol}
                winning={isWinner}
                scatter={isScatterSymbol}
                selected={selectedSymbol === symbol}
                onClick={() => onSymbolClick(symbol)}
              >
                {symbol}
                {isWinner && <WinIndicator />}
                {isScatterSymbol && <ScatterIndicator>SC</ScatterIndicator>}
              </SymbolCell>
            );
          })}
        </ReelColumn>
      ))}
    </ReelGrid>
  );
};

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Loading = styled.div`
  padding: 40px;
  text-align: center;
  font-size: 18px;
  color: #666;
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
  animation: ${fadeIn} 0.5s ease-out;
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

const SummaryContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const SummaryCard = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  border: 1px solid ${(props) => (props.highlight ? "#6a11cb" : "#e0d5ff")};
  border-top: 4px solid ${(props) => (props.highlight ? "#6a11cb" : "#2575fc")};
`;

const SummaryTitle = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const SummaryValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
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
    if (props.selected) return "rgba(106, 17, 203, 0.2)";
    if (props.winning) return "rgba(106, 17, 203, 0.1)";
    if (props.scatter) return "rgba(255, 100, 100, 0.1)";
    if (props.symbol.startsWith("H")) return "#f0f7ff";
    if (props.symbol.startsWith("L")) return "#f0fff4";
    return "#f9f9f9";
  }};
  border: 1px solid
    ${(props) => {
      if (props.selected) return "#6a11cb";
      if (props.winning) return "#6a11cb";
      if (props.scatter) return "#ff5722";
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

const ScatterIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: #ff5722;
  color: white;
  font-size: 8px;
  padding: 1px 4px;
  border-radius: 4px;
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

const WinningSymbols = styled.div`
  margin-top: 15px;
  padding: 10px;
  background: rgba(106, 17, 203, 0.05);
  border-radius: 8px;
`;

const SymbolsTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: #6a11cb;
`;

const SymbolsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SymbolBadge = styled.div`
  padding: 5px 10px;
  background: ${(props) =>
    props.selected ? "#6a11cb" : "rgba(106, 17, 203, 0.1)"};
  color: ${(props) => (props.selected ? "white" : "#6a11cb")};
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(106, 17, 203, 0.2);
  }
`;

const FreeSpinContainer = styled.div`
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
  background: ${(props) => (props.highlight ? "#f8f5ff" : "white")};

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
