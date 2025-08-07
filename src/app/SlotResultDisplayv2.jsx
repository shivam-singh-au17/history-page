"use client";

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const SlotResultDisplay = ({ roundData }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [expandedSpins, setExpandedSpins] = useState([]);

  // Parse the data structure from your API
  const parsedData = {
    roundId: roundData.roundId,
    gameName: roundData.gameName,
    startTime: new Date(roundData.createdAt).toLocaleString(),
    endTime: new Date(roundData.endTime).toLocaleString(),
    totalFreeSpins: roundData.totalFreeSpins,
    totalWin: roundData.winAmount / 100,
    currency: roundData.currencyCode,
    baseGame: {
      reelView: roundData.extraData[0]?.cascadeData[0]?.reelView || [],
      win: 0,
      totalWin: 0,
    },
    freeSpins:
      roundData.extraData[0]?.featureResults[0]?.spinResults.map(
        (spin, index) => ({
          spinNumber: index + 1,
          reelViews: spin.cascadeData.map((cascade) => cascade.reelView),
          wins: spin.cascadeData.map((cascade) => ({
            amount: cascade.spinWin,
            multiplier: cascade.multiplier?.[0]?.multiplier || 1,
            winningSymbols: cascade.blustSymbols || [],
          })),
          totalWin: spin.totalWin / 100,
          multipliers: spin.multipliers,
        })
      ) || [],
  };

  const toggleSpinExpand = (spinNumber) => {
    if (expandedSpins.includes(spinNumber)) {
      setExpandedSpins(expandedSpins.filter((n) => n !== spinNumber));
    } else {
      setExpandedSpins([...expandedSpins, spinNumber]);
    }
  };

  return (
    <ResultContainer>
      <Header>
        <GameLogo src="/sugar-bliss-logo.png" alt="Sugar Bliss" />
        <RoundInfo>
          <RoundId>{parsedData.roundId}</RoundId>
          <RoundTime>
            {parsedData.startTime} - {parsedData.endTime}
          </RoundTime>
        </RoundInfo>
      </Header>

      <Navigation>
        <NavButton
          active={activeTab === "summary"}
          onClick={() => setActiveTab("summary")}
        >
          Round Summary
        </NavButton>
        <NavButton
          active={activeTab === "base"}
          onClick={() => setActiveTab("base")}
        >
          Base Game
        </NavButton>
        <NavButton
          active={activeTab === "freespins"}
          onClick={() => setActiveTab("freespins")}
        >
          Free Spins ({parsedData.totalFreeSpins})
        </NavButton>
      </Navigation>

      <ContentArea>
        {activeTab === "summary" && (
          <SummaryView
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
          />
        )}
      </ContentArea>

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

const FreeSpinsView = ({ spins, expandedSpins, onToggleExpand, currency }) => (
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
            {spin.reelViews.map((reelView, index) => (
              <TumbleView key={index}>
                <TumbleHeader>
                  {index === 0 ? "Initial Spin" : `Tumble ${index}`}
                  {spin.wins[index].amount > 0 && (
                    <TumbleWin>
                      Win: {currency} {spin.wins[index].amount.toFixed(2)}
                      {spin.wins[index].multiplier > 1 && (
                        <MultiplierBadge>
                          {spin.wins[index].multiplier}x
                        </MultiplierBadge>
                      )}
                    </TumbleWin>
                  )}
                </TumbleHeader>
                <ReelDisplay
                  reelView={reelView}
                  winningSymbols={spin.wins[index].winningSymbols}
                />
              </TumbleView>
            ))}

            <FinalWin>
              <WinLabel>Free Spin {spin.spinNumber} Total:</WinLabel>
              <WinValue>
                {currency} {spin.totalWin.toFixed(2)}
              </WinValue>
            </FinalWin>
          </SpinDetails>
        )}
      </SpinContainer>
    ))}
  </FreeSpinsContainer>
);

const ReelDisplay = ({ reelView, winningSymbols = [] }) => {
  const isWinningSymbol = (row, col) => {
    return winningSymbols.some((ws) =>
      ws.positions.some((pos) => pos[0] === row && pos[1] === col)
    );
  };

  return (
    <ReelGrid>
      {reelView.map((column, colIndex) => (
        <ReelColumn key={`col-${colIndex}`}>
          {column.map((symbol, rowIndex) => (
            <SymbolCell
              key={`${rowIndex}-${colIndex}`}
              symbol={symbol}
              winning={isWinningSymbol(rowIndex, colIndex)}
            >
              {symbol}
              {isWinningSymbol(rowIndex, colIndex) && <WinIndicator />}
            </SymbolCell>
          ))}
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
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
  color: white;
`;

const GameLogo = styled.img`
  height: 40px;
  margin-right: 20px;
`;

const RoundInfo = styled.div`
  flex: 1;
`;

const RoundId = styled.div`
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 5px;
`;

const RoundTime = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const Navigation = styled.div`
  display: flex;
  background: #f0ebff;
  border-bottom: 1px solid #e0d5ff;
`;

const NavButton = styled.button`
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

const ContentArea = styled.div`
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
    if (props.winning) return "rgba(106, 17, 203, 0.1)";
    if (props.symbol.startsWith("H")) return "#f0f7ff";
    if (props.symbol.startsWith("L")) return "#f0fff4";
    if (props.symbol === "SC") return "#fff0f5";
    return "#f9f9f9";
  }};
  border: 1px solid ${(props) => (props.winning ? "#6a11cb" : "#e0d5ff")};
  border-radius: 8px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #333;
  font-size: 14px;
  overflow: hidden;
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

const FinalWin = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f5ff;
  border-radius: 8px;
  margin-top: 15px;
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
