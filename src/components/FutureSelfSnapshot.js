import React from 'react';
import { calculateFreedomMetrics, calculateStressLevel } from '../utils/simulation';

const FutureSelfSnapshot = ({ simulationResult, inputs }) => {
  if (!simulationResult) {
    return (
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">🪞 Future Self Snapshot</h3>
        <div className="text-slate-400 text-center py-8">
          Run a simulation to see your future self comparison
        </div>
      </div>
    );
  }

  const { finalWealth, finalRisky, avgStress, avgHealth, avgHappiness, sleeplessYears, timeline } = simulationResult;

  // Calculate metrics for current path
  const currentIncome = inputs.annualIncome || inputs.monthlyIncome * 12;
  const saverFreedom = calculateFreedomMetrics(finalWealth, currentIncome);
  const saverStress = avgStress || calculateStressLevel(inputs.allocRisk || 0, finalWealth);
  const saverHealth = avgHealth || Math.max(40, 100 - saverStress);

  // Calculate metrics for high-risk comparison path
  const highRiskWealth = finalRisky || 0;
  const gamblerFreedom = calculateFreedomMetrics(highRiskWealth, currentIncome);
  const gamblerStress = calculateStressLevel(0.7, highRiskWealth); // High risk stress
  const gamblerHealth = Math.max(20, 100 - gamblerStress);

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

  const yearsToEnd = inputs.ageEnd - inputs.ageStart;

  const getSleepQuality = (stress, sleeplessYears, totalYears) => {
    if (sleeplessYears >= totalYears * 0.5) {
      return { emoji: '😵', quality: 'Chronic Insomnia', color: 'text-red-400' };
    } else if (sleeplessYears >= totalYears * 0.3) {
      return { emoji: '😴', quality: 'Poor Sleep', color: 'text-orange-400' };
    } else if (sleeplessYears >= totalYears * 0.1) {
      return { emoji: '😐', quality: 'Restless Nights', color: 'text-yellow-400' };
    } else {
      return { emoji: '😴', quality: 'Good Sleep', color: 'text-green-400' };
    }
  };

  const getHealthColor = (health) => {
    if (health >= 80) return 'text-green-400';
    if (health >= 60) return 'text-yellow-400';
    if (health >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getFreedomColor = (freedom) => {
    if (freedom >= 80) return 'text-green-400';
    if (freedom >= 60) return 'text-yellow-400';
    if (freedom >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScenarioMessage = (wealth, freedom, stress, health, sleepYears) => {
    if (wealth >= 500000 && freedom >= 80 && health >= 80) {
      return {
        emoji: '🌟',
        title: 'Living the Dream',
        message: 'Financial security, excellent health, and peaceful sleep. You invested in yourself and it paid off.'
      };
    } else if (wealth >= 100000 && freedom >= 50 && health >= 60) {
      return {
        emoji: '😌',
        title: 'Comfortable & Healthy',
        message: 'Solid wealth with good health. Manageable stress levels let you sleep well.'
      };
    } else if (wealth >= 50000 && health >= 40) {
      return {
        emoji: '😐',
        title: 'Getting By',
        message: 'Some security achieved, but health starting to suffer from years of stress.'
      };
    } else if (stress >= 70 || sleepYears >= yearsToEnd * 0.3) {
      return {
        emoji: '🤒',
        title: 'Health Crisis',
        message: 'High stress led to chronic sleep issues and serious health problems. Wealth can\'t buy back your health.'
      };
    } else {
      return {
        emoji: '😰',
        title: 'Struggling',
        message: 'Limited financial security with declining health and constant worry about the future.'
      };
    }
  };

  const saverSleepQuality = getSleepQuality(saverStress, sleeplessYears || 0, yearsToEnd);
  const gamblerSleepQuality = getSleepQuality(gamblerStress, Math.round(yearsToEnd * 0.6), yearsToEnd); // Assume 60% sleepless years for high risk

  const saverScenario = getScenarioMessage(finalWealth, saverFreedom.freedomScore, saverStress, saverHealth, sleeplessYears || 0);
  const gamblerScenario = getScenarioMessage(highRiskWealth, gamblerFreedom.freedomScore, gamblerStress, gamblerHealth, Math.round(yearsToEnd * 0.6));

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-6 text-center">🪞 Future Self Snapshot</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consistent Saver */}
        <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-700/50 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">{saverScenario.emoji}</div>
            <h4 className="text-xl font-bold text-green-400 mb-1">Consistent Saver</h4>
            <p className="text-sm text-green-300">{saverScenario.title}</p>
          </div>

          <div className="space-y-4">
            {/* Wealth */}
            <div className="flex justify-between items-center">
              <span className="text-slate-300">💰 Final Wealth</span>
              <span className="text-white font-bold text-lg">{formatCurrency(finalWealth)}</span>
            </div>

            {/* Health Score */}
            <div className="flex justify-between items-center">
              <span className="text-slate-300">❤️ Health Score</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${getHealthColor(saverHealth)}`}>
                  {saverHealth}/100
                </span>
                <div className="w-16 bg-slate-600 rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${
                      saverHealth >= 80 ? 'bg-green-500' :
                      saverHealth >= 60 ? 'bg-yellow-500' :
                      saverHealth >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${saverHealth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Freedom Score */}
            <div className="flex justify-between items-center">
              <span className="text-slate-300">🙂 Freedom Score</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${getFreedomColor(saverFreedom.freedomScore)}`}>
                  {saverFreedom.freedomScore}/100
                </span>
                <div className="w-16 bg-slate-600 rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${
                      saverFreedom.freedomScore >= 80 ? 'bg-green-500' :
                      saverFreedom.freedomScore >= 60 ? 'bg-yellow-500' :
                      saverFreedom.freedomScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(saverFreedom.freedomScore, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sleep Quality */}
            <div className="flex justify-between items-center">
              <span className="text-slate-300">😴 Sleep Quality</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${saverSleepQuality.color}`}>
                  {saverSleepQuality.emoji} {saverSleepQuality.quality}
                </span>
              </div>
            </div>

            {/* Monthly Passive Income */}
            <div className="flex justify-between items-center">
              <span className="text-slate-300">💳 Monthly Passive Income</span>
              <div className="text-right">
                <div className="text-green-400 font-bold">
                  {formatCurrency(saverFreedom.monthlyPassiveIncome)}
                </div>
                <div className="text-xs text-slate-400">
                  ({formatCurrency(calculatePresentValue(saverFreedom.monthlyPassiveIncome, yearsToEnd))} in today's money)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
            <p className="text-sm text-slate-300 leading-relaxed">
              {saverScenario.message}
            </p>
          </div>
        </div>

        {/* Gambler Path */}
        <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-700/50 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">{gamblerScenario.emoji}</div>
            <h4 className="text-xl font-bold text-red-400 mb-1">High-Risk Gambler</h4>
            <p className="text-sm text-red-300">{gamblerScenario.title}</p>
          </div>

          <div className="space-y-4">
            {/* Wealth */}
            <div className="flex justify-between items-center">
              <span className="text-slate-300">💸 Final Wealth</span>
              <span className="text-white font-bold text-lg">{formatCurrency(highRiskWealth)}</span>
            </div>

            {/* Health Score */}
            <div className="flex justify-between items-center">
              <span className="text-slate-300">❤️ Health Score</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${getHealthColor(gamblerHealth)}`}>
                  {gamblerHealth}/100
                </span>
                <div className="w-16 bg-slate-600 rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${
                      gamblerHealth >= 80 ? 'bg-green-500' :
                      gamblerHealth >= 60 ? 'bg-yellow-500' :
                      gamblerHealth >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${gamblerHealth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Freedom Score */}
            <div className="flex justify-between items-center">
              <span className="text-slate-300">😰 Freedom Score</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${getFreedomColor(gamblerFreedom.freedomScore)}`}>
                  {gamblerFreedom.freedomScore}/100
                </span>
                <div className="w-16 bg-slate-600 rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${
                      gamblerFreedom.freedomScore >= 80 ? 'bg-green-500' :
                      gamblerFreedom.freedomScore >= 60 ? 'bg-yellow-500' :
                      gamblerFreedom.freedomScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(gamblerFreedom.freedomScore, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sleep Quality */}
            <div className="flex justify-between items-center">
              <span className="text-slate-300">😴 Sleep Quality</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${gamblerSleepQuality.color}`}>
                  {gamblerSleepQuality.emoji} {gamblerSleepQuality.quality}
                </span>
              </div>
            </div>

            {/* Monthly Passive Income */}
            <div className="flex justify-between items-center">
              <span className="text-slate-300">💳 Monthly Passive Income</span>
              <div className="text-right">
                <div className="text-red-400 font-bold">
                  {formatCurrency(gamblerFreedom.monthlyPassiveIncome)}
                </div>
                <div className="text-xs text-slate-400">
                  ({formatCurrency(calculatePresentValue(gamblerFreedom.monthlyPassiveIncome, yearsToEnd))} in today's money)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
            <p className="text-sm text-slate-300 leading-relaxed">
              {gamblerScenario.message}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Section */}
      <div className="mt-6 p-4 bg-gradient-to-r from-teal-900/30 to-blue-900/30 border border-teal-700/50 rounded-lg text-center">
        <p className="text-white font-semibold mb-2">
          💡 High risk or lack of savings → High stress → Sleep issues → Health problems
        </p>
        <p className="text-slate-300 text-sm">
          Left: chasing charts. Right: becoming the chart.
          <span className="text-purple-400 font-semibold"> Sleep = staking. Learning = yield. Discipline = protocol security.</span>
        </p>
      </div>
    </div>
  );
};

export default FutureSelfSnapshot;