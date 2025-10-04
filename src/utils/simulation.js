export function simulateCryptoLife({
  ageStart = 25,
  ageEnd = 65,
  annualIncome = 30000,
  allocRisk = 0.3,      // risky trades/leverage/memecoins
  allocStable = 0.2,    // BTC/ETH/blue chips
  allocCash = 0.2,      // cash/pension/bonds
  allocSelf = 0.1,      // education/health/skills
  marketVol = 0.8,      // market volatility factor
  goalAmount = 100000
}) {
  let riskyAssets = 0;
  let stableAssets = 0;
  let cashAssets = 0;
  let totalWealth = 0;

  // Life quality metrics
  let health = 75;
  let happiness = 60;
  let stress = 40;
  let currentIncome = annualIncome;

  const timeline = [];
  let goalAchievedAge = null;
  const baseGrowth = 0.03; // base income growth

  for (let age = ageStart; age <= ageEnd; age++) {
    // Annual deposits based on allocation
    const riskDeposit = currentIncome * allocRisk;
    const stableDeposit = currentIncome * allocStable;
    const cashDeposit = currentIncome * allocCash;
    const selfInvestment = currentIncome * allocSelf;

    // Asset growth with different risk/return profiles
    // Risky crypto: high return but extreme volatility
    const riskyReturn = randNormal(0.20, marketVol); // 20% expected with high vol
    riskyAssets = Math.max(0, riskyAssets * (1 + riskyReturn) + riskDeposit);

    // Stable crypto: moderate return, lower volatility
    const stableReturn = randNormal(0.07, 0.15); // 7% expected, moderate vol
    stableAssets = stableAssets * (1 + stableReturn) + stableDeposit;

    // Cash/bonds: low but stable return
    cashAssets = cashAssets * 1.02 + cashDeposit; // 2% safe return

    totalWealth = riskyAssets + stableAssets + cashAssets;

    // Self-investment boosts future income and life quality
    const skillMultiplier = 1 + baseGrowth + (allocSelf * 0.04); // 4% bonus per 100% self allocation
    currentIncome *= skillMultiplier;

    // Life quality impacts based on allocation
    const stressFromRisk = allocRisk * 50; // max 50 stress from 100% risk
    const healthFromSelf = allocSelf * 40; // max 40 health boost from 100% self
    const happinessFromBalance = Math.max(0, 30 - Math.abs(allocRisk - 0.2) * 100); // happiness peaks at 20% risk

    health = clamp(health + healthFromSelf - (stressFromRisk * 0.3) + randNormal(0, 2), 20, 100);
    stress = clamp(stress + stressFromRisk - (allocSelf * 30) + randNormal(0, 3), 0, 100);
    happiness = clamp(happiness + happinessFromBalance + (allocSelf * 20) - (stressFromRisk * 0.2) + randNormal(0, 2), 10, 100);

    // High stress reduces income growth (sleepless nights effect)
    if (stress > 70) {
      currentIncome *= 0.98; // 2% income penalty for high stress
    }

    // Check if goal is achieved
    if (!goalAchievedAge && totalWealth >= goalAmount) {
      goalAchievedAge = age;
    }

    timeline.push({
      age,
      risky: Math.round(riskyAssets),
      stable: Math.round(stableAssets),
      cash: Math.round(cashAssets),
      totalWealth: Math.round(totalWealth),
      health: Math.round(health),
      happiness: Math.round(happiness),
      stress: Math.round(stress),
      income: Math.round(currentIncome),
      goalAchieved: totalWealth >= goalAmount,
      sleeplessNights: stress > 70
    });
  }

  return {
    timeline,
    finalWealth: Math.round(totalWealth),
    finalRisky: Math.round(riskyAssets),
    finalStable: Math.round(stableAssets),
    finalCash: Math.round(cashAssets),
    goalAchievedAge,
    yearsToGoal: goalAchievedAge ? goalAchievedAge - ageStart : null,
    avgHealth: Math.round(timeline.reduce((sum, t) => sum + t.health, 0) / timeline.length),
    avgStress: Math.round(timeline.reduce((sum, t) => sum + t.stress, 0) / timeline.length),
    avgHappiness: Math.round(timeline.reduce((sum, t) => sum + t.happiness, 0) / timeline.length),
    sleeplessYears: timeline.filter(t => t.sleeplessNights).length
  };
}

// Normal distribution random number generator
function randNormal(mean, stdev) {
  const u = 1 - Math.random();
  const v = Math.random();
  return mean + stdev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Utility function to clamp values
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

// Legacy function for backward compatibility
export function simulateLife(params) {
  // Convert old params to new crypto params
  const cryptoParams = {
    ageStart: params.ageStart || 25,
    ageEnd: params.ageEnd || 65,
    annualIncome: (params.monthlyIncome || 2000) * 12,
    allocRisk: params.riskRate || 0.0,
    allocStable: params.savingsRate || 0.1,
    allocCash: 0.1,
    allocSelf: 0.05,
    goalAmount: params.goalAmount || 100000
  };

  const result = simulateCryptoLife(cryptoParams);

  // Convert back to old format for compatibility
  return {
    timeline: result.timeline.map(t => ({
      age: t.age,
      savings: t.stable + t.cash,
      gambling: t.risky,
      goalAchieved: t.goalAchieved
    })),
    finalSavings: result.finalStable + result.finalCash,
    finalGambling: result.finalRisky,
    goalAchievedAge: result.goalAchievedAge,
    yearsToGoal: result.yearsToGoal
  };
}

export function calculateGoalProgress(currentAge, savings, goalAmount) {
  const progress = Math.min((savings / goalAmount) * 100, 100);
  return {
    percentage: Math.round(progress),
    remaining: Math.max(0, goalAmount - savings),
    achieved: savings >= goalAmount
  };
}

export function calculateFreedomMetrics(finalWealth, monthlyExpenses = 2000) {
  const monthlyPassiveIncome = (finalWealth * 0.04) / 12; // 4% withdrawal rule
  const freedomScore = Math.min((monthlyPassiveIncome / monthlyExpenses) * 100, 100);
  const canRetire = monthlyPassiveIncome >= monthlyExpenses;

  return {
    monthlyPassiveIncome: Math.round(monthlyPassiveIncome),
    freedomScore: Math.round(freedomScore),
    canRetire,
    yearsOfExpenses: Math.round(finalWealth / (monthlyExpenses * 12))
  };
}

export function calculateStressLevel(riskRate, finalWealth) {
  const riskStress = riskRate * 60; // Risk contributes to stress
  const wealthComfort = Math.min(finalWealth / 100000, 1) * 40; // Wealth reduces stress
  return Math.max(0, Math.min(100, riskStress - wealthComfort + 20)); // Base stress level
}