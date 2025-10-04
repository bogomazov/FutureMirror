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

  const { finalWealth, finalRisky, avgStress, avgHealth, avgHappiness } = simulationResult;

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

  const getScenarioMessage = (wealth, freedom, stress) => {
    if (wealth >= 500000 && freedom >= 80) {
      return {
        emoji: '🌟',
        title: 'Living the Dream',
        message: 'Your future self can rest easy with financial security and peace of mind.'
      };
    } else if (wealth >= 100000 && freedom >= 50) {
      return {
        emoji: '😌',
        title: 'Comfortable & Secure',
        message: 'You\'ve built solid wealth with manageable stress levels.'
      };
    } else if (wealth >= 50000) {
      return {
        emoji: '😐',
        title: 'Getting By',
        message: 'Some security achieved, but retirement may be challenging.'
      };
    } else {
      return {
        emoji: '😰',
        title: 'Struggling',
        message: 'Limited financial security with high stress and uncertainty.'
      };
    }
  };

  const saverScenario = getScenarioMessage(finalWealth, saverFreedom.freedomScore, saverStress);
  const gamblerScenario = getScenarioMessage(highRiskWealth, gamblerFreedom.freedomScore, gamblerStress);

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

            {/* Monthly Passive Income */}
            <div className="flex justify-between items-center">
              <span className="text-slate-300">💳 Monthly Income</span>
              <span className="text-green-400 font-bold">
                {formatCurrency(saverFreedom.monthlyPassiveIncome)}
              </span>
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

            {/* Monthly Passive Income */}
            <div className="flex justify-between items-center">
              <span className="text-slate-300">💳 Monthly Income</span>
              <span className="text-red-400 font-bold">
                {formatCurrency(gamblerFreedom.monthlyPassiveIncome)}
              </span>
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
          💡 Your future is shaped by choices you make today
        </p>
        <p className="text-slate-300 text-sm">
          Consistent saving builds wealth, reduces stress, and creates the freedom to live life on your terms.
        </p>
      </div>
    </div>
  );
};

export default FutureSelfSnapshot;