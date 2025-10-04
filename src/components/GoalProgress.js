import React from 'react';
import { calculateGoalProgress, calculateFreedomMetrics } from '../utils/simulation';

const GoalProgress = ({ simulationResult, inputs }) => {
  if (!simulationResult) {
    return (
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">🎯 Life Goal Progress</h3>
        <div className="text-slate-400 text-center py-8">
          Run a simulation to see your goal progress
        </div>
      </div>
    );
  }

  const { timeline, finalWealth, goalAchievedAge, yearsToGoal } = simulationResult;
  const currentProgress = calculateGoalProgress(
    inputs.ageStart,
    timeline[0]?.totalWealth || 0,
    inputs.goalAmount
  );
  const goalProgress = calculateGoalProgress(
    65,
    finalWealth,
    inputs.goalAmount
  );
  const freedomMetrics = calculateFreedomMetrics(finalWealth, inputs.annualIncome || inputs.monthlyIncome * 12);

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  // Calculate present-day value (assuming 3% inflation)
  const calculatePresentValue = (futureValue, years) => {
    const inflationRate = 0.03;
    return futureValue / Math.pow(1 + inflationRate, years);
  };

  const yearsToRetirement = inputs.ageEnd - inputs.ageStart;

  const progressPercentage = (finalWealth / inputs.goalAmount) * 100;
  const clampedProgress = Math.min(progressPercentage, 100);

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-6">🎯 Life Goal Progress</h3>

      {/* Goal Achievement Status */}
      <div className="mb-6">
        {goalAchievedAge ? (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎉</span>
              <span className="text-green-400 font-semibold">Goal Achieved!</span>
            </div>
            <div className="text-white">
              <div>Years until goal: <span className="font-bold text-green-400">{yearsToGoal} years</span></div>
              <div>Age when reached: <span className="font-bold text-green-400">{goalAchievedAge}</span></div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⏰</span>
              <span className="text-yellow-400 font-semibold">Goal in Progress</span>
            </div>
            <div className="text-white">
              <div>Goal may not be reached by retirement (age 65)</div>
              <div>Consider increasing your savings rate</div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-300 font-medium">Progress to Goal</span>
          <span className="text-white font-bold">{clampedProgress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-out ${
              clampedProgress >= 100
                ? 'bg-gradient-to-r from-green-500 to-green-400'
                : clampedProgress >= 75
                ? 'bg-gradient-to-r from-teal-500 to-teal-400'
                : clampedProgress >= 50
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                : 'bg-gradient-to-r from-red-500 to-red-400'
            }`}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>$0</span>
          <span>{formatCurrency(inputs.goalAmount)}</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700 p-4 rounded-lg">
          <div className="text-slate-400 text-sm mb-1">Wealth at Retirement (65)</div>
          <div className="text-white text-xl font-bold">{formatCurrency(finalWealth)}</div>
        </div>
        <div className="bg-slate-700 p-4 rounded-lg">
          <div className="text-slate-400 text-sm mb-1">Monthly Passive Income</div>
          <div className="text-white text-xl font-bold">{formatCurrency(freedomMetrics.monthlyPassiveIncome)}</div>
          <div className="text-xs text-slate-400">
            ({formatCurrency(calculatePresentValue(freedomMetrics.monthlyPassiveIncome, yearsToRetirement))} in today's money)
          </div>
          <div className="text-xs text-slate-400 mt-1">4% withdrawal rule</div>
        </div>
      </div>

      {/* Freedom Score */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-300 font-medium">Financial Freedom Score</span>
          <span className="text-white font-bold">{freedomMetrics.freedomScore}/100</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              freedomMetrics.freedomScore >= 100
                ? 'bg-gradient-to-r from-green-500 to-green-400'
                : freedomMetrics.freedomScore >= 75
                ? 'bg-gradient-to-r from-teal-500 to-teal-400'
                : freedomMetrics.freedomScore >= 50
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                : 'bg-gradient-to-r from-red-500 to-red-400'
            }`}
            style={{ width: `${Math.min(freedomMetrics.freedomScore, 100)}%` }}
          />
        </div>
        <div className="text-xs text-slate-400 mt-1">
          {freedomMetrics.canRetire
            ? '✅ Can cover monthly expenses with passive income'
            : '❌ Passive income insufficient for full retirement'
          }
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-slate-700 p-4 rounded-lg">
        <div className="text-slate-300 font-medium mb-2">💡 Insights</div>
        <div className="text-sm text-slate-400 space-y-1">
          <div>• Can cover {freedomMetrics.yearsOfExpenses} years of expenses</div>
          <div>• Freedom score represents financial independence level</div>
          {!goalAchievedAge && (
            <div className="text-yellow-400">• Consider increasing savings rate to reach goal sooner</div>
          )}
          {freedomMetrics.canRetire && (
            <div className="text-green-400">• Congratulations! You can retire comfortably</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalProgress;