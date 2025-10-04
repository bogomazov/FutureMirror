export function simulateLife({
  ageStart = 25,
  ageEnd = 65,
  monthlyIncome = 2000,
  savingsRate = 0.1,
  riskRate = 0.0,
  yieldRate = 0.05,
  goalAmount = 100000
}) {
  let savings = 0;
  let gamblingWealth = 0;
  const timeline = [];
  let goalAchievedAge = null;

  for (let age = ageStart; age <= ageEnd; age++) {
    const annualIncome = monthlyIncome * 12;
    const savedAmount = annualIncome * savingsRate;
    const riskedAmount = annualIncome * riskRate;

    // Savings growth with compound interest
    savings = (savings + savedAmount) * (1 + yieldRate);

    // Gambling simulation (10% win rate, 70% average loss on losses)
    const gamblingOutcome = Math.random();
    let gamblingReturn;
    if (gamblingOutcome < 0.1) {
      // 10% chance of winning (300% return)
      gamblingReturn = riskedAmount * 3;
    } else {
      // 90% chance of losing (70% loss)
      gamblingReturn = -riskedAmount * 0.7;
    }
    gamblingWealth = Math.max(0, gamblingWealth + riskedAmount + gamblingReturn);

    // Check if savings goal is achieved
    if (!goalAchievedAge && savings >= goalAmount) {
      goalAchievedAge = age;
    }

    timeline.push({
      age,
      savings: Math.round(savings),
      gambling: Math.round(gamblingWealth),
      goalAchieved: savings >= goalAmount
    });
  }

  return {
    timeline,
    finalSavings: Math.round(savings),
    finalGambling: Math.round(gamblingWealth),
    goalAchievedAge,
    yearsToGoal: goalAchievedAge ? goalAchievedAge - ageStart : null
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