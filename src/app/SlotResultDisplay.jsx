"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const SlotResultDisplay = ({ roundData }) => {
  // Parse your provided data structure
  const parsedData = {
    roundId: roundData.roundId,
    gameName: roundData.gameName,
    startTime: new Date(roundData.createdAt).toLocaleString(),
    endTime: new Date(roundData.endTime).toLocaleString(),
    totalFreeSpins: roundData.totalFreeSpins,
    totalWin: roundData.winAmount / 100, // Convert to currency units
    baseGame: {
      win: 0, // From your data
      totalWin: 0,
    },
    freeSpins: [
      {
        spinNumber: 1,
        win: 0.24,
        totalWin: 0.24,
        symbols: [], // Would be populated from extraData
      },
      {
        spinNumber: 2,
        win: 0.9,
        totalWin: 0.9,
        symbols: [], // Would be populated from extraData
        multiplier: 1,
      },
    ],
    reelData: roundData.extraData[0]?.cascadeData[0]?.reelView || [],
  };

  const [activeTab, setActiveTab] = useState("summary");
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (parsedData.totalWin > 50) {
      setCelebrate(true);
      const timer = setTimeout(() => setCelebrate(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [parsedData.totalWin]);

  return (
    <ResultContainer celebrate={celebrate}>
      <HeaderSection>
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
      </HeaderSection>

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
          <SummaryView data={parsedData} reelData={parsedData.reelData} />
        )}
        {activeTab === "base" && <BaseGameView data={parsedData.baseGame} />}
        {activeTab === "freespins" && (
          <FreeSpinView spins={parsedData.freeSpins} />
        )}
      </ContentSection>

      {parsedData.totalWin > 0 && (
        <TotalWinDisplay>
          TOTAL WIN:{" "}
          <WinAmount>
            {parsedData.totalWin.toFixed(2)} {roundData.currencyCode}
          </WinAmount>
        </TotalWinDisplay>
      )}
    </ResultContainer>
  );
};

// Sub-components
const SummaryView = ({ data, reelData }) => (
  <SummaryContainer>
    <ReelDisplay symbols={reelData} />

    <SummaryStats>
      <StatItem>
        <StatLabel>Free Spins Awarded</StatLabel>
        <StatValue>{data.totalFreeSpins}</StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>Total Round Win</StatLabel>
        <StatValue highlight>{data.totalWin.toFixed(2)}</StatValue>
      </StatItem>
    </SummaryStats>
  </SummaryContainer>
);

const BaseGameView = ({ data }) => (
  <BaseGameContainer>
    <SectionTitle>Base Game Results</SectionTitle>
    <WinRow>
      <WinLabel>Base Win:</WinLabel>
      <WinValue>{data.win.toFixed(2)}</WinValue>
    </WinRow>
    <WinRow>
      <WinLabel>Total Win:</WinLabel>
      <WinValue>{data.totalWin.toFixed(2)}</WinValue>
    </WinRow>
  </BaseGameContainer>
);

const FreeSpinView = ({ spins }) => (
  <FreeSpinContainer>
    {spins.map((spin, index) => (
      <SpinResult key={index}>
        <SpinHeader>
          <SpinTitle>Free Spin {spin.spinNumber}</SpinTitle>
          {spin.win > 0 && <SpinWin>WIN: {spin.win.toFixed(2)}</SpinWin>}
        </SpinHeader>
        {spin.multiplier && spin.multiplier > 1 && (
          <MultiplierBadge>{spin.multiplier}x</MultiplierBadge>
        )}
      </SpinResult>
    ))}
  </FreeSpinContainer>
);

const ReelDisplay = ({ symbols }) => (
  <ReelGrid>
    {symbols.map((column, colIndex) => (
      <ReelColumn key={`col-${colIndex}`}>
        {column.map((symbol, rowIndex) => (
          <SymbolCell key={`${colIndex}-${rowIndex}`} symbol={symbol}>
            {symbol}
          </SymbolCell>
        ))}
      </ReelColumn>
    ))}
  </ReelGrid>
);

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const ResultContainer = styled.div`
  background: #2a0a3a;
  background: linear-gradient(135deg, #2a0a3a 0%, #4b1b6a 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  color: white;
  font-family: "Arial", sans-serif;
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-out;
  ${(props) => props.celebrate && `animation: ${pulse} 0.5s 3;`}

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff00ff, #00ffff, #ffff00, #ff00ff);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 15px;
`;

const GameTitle = styled.h1`
  margin: 0;
  color: #ffd700;
  font-size: 24px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const RoundInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 12px;
  opacity: 0.8;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  color: #aaa;
  margin-bottom: 4px;
`;

const Value = styled.span`
  color: white;
  font-weight: bold;
`;

const NavigationTabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TabButton = styled.button`
  background: ${(props) =>
    props.active ? "rgba(255, 215, 0, 0.2)" : "transparent"};
  border: none;
  color: ${(props) => (props.active ? "#ffd700" : "white")};
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  border-bottom: 2px solid
    ${(props) => (props.active ? "#ffd700" : "transparent")};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
  }
`;

const ContentSection = styled.div`
  min-height: 300px;
  position: relative;
`;

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ReelGrid = styled.div`
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ReelColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SymbolCell = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => {
    // Different backgrounds based on symbol type for visibility
    if (props.symbol.startsWith("H")) return "rgba(255, 100, 100, 0.3)"; // High symbols
    if (props.symbol.startsWith("L")) return "rgba(100, 255, 100, 0.3)"; // Low symbols
    if (props.symbol === "SC") return "rgba(100, 100, 255, 0.3)"; // Scatter
    return "rgba(255, 255, 255, 0.1)";
  }};
  border-radius: 8px;
  font-weight: bold;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SummaryStats = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-around;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #aaa;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => (props.highlight ? "#ffd700" : "white")};
`;

const BaseGameContainer = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
`;

const SectionTitle = styled.h2`
  margin-top: 0;
  color: #ffd700;
  font-size: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
`;

const WinRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
`;

const WinLabel = styled.span`
  color: #aaa;
`;

const WinValue = styled.span`
  font-weight: bold;
`;

const FreeSpinContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SpinResult = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 15px;
  position: relative;
  border-left: 3px solid #ffd700;
`;

const SpinHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const SpinTitle = styled.span`
  font-weight: bold;
  color: #ffd700;
`;

const SpinWin = styled.span`
  background: rgba(255, 215, 0, 0.2);
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: bold;
`;

const MultiplierBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ff5722;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const TotalWinDisplay = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const WinAmount = styled.span`
  color: #ffd700;
  font-size: 24px;
  margin-left: 10px;
`;

export default SlotResultDisplay;
