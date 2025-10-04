import React from 'react';

const ComparisonButtons = ({ currentScenario, onScenarioChange, simulationResults }) => {
  const comparisonScenarios = [
    {
      key: 'degen',
      label: 'All In Risk',
      description: 'YOLO Degen Mode',
      emoji: '🎲',
      allocation: { risk: 70, stable: 15, cash: 10, self: 5 }
    },
    {
      key: 'balanced',
      label: 'Balanced',
      description: 'Moderate Risk',
      emoji: '⚖️',
      allocation: { risk: 25, stable: 30, cash: 25, self: 20 }
    },
    {
      key: 'lockin',
      label: 'Lock-In Life',
      description: 'Peace & Stability',
      emoji: '🔒',
      allocation: { risk: 5, stable: 35, cash: 30, self: 30 }
    }
  ];

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getScenarioKey = (scenario) => {
    const { risk, stable, cash, self } = scenario.allocation;
    return `${risk / 100}-${stable / 100}-${cash / 100}-${self / 100}`;
  };

  const getYearsToGoal = (scenario) => {
    const key = getScenarioKey(scenario);
    const result = simulationResults?.[key];
    return result?.yearsToGoal || null;
  };

  const getFinalWealth = (scenario) => {
    const key = getScenarioKey(scenario);
    const result = simulationResults?.[key];
    return result?.finalWealth || 0;
  };

  const getSleeplessYears = (scenario) => {
    const key = getScenarioKey(scenario);
    const result = simulationResults?.[key];
    return result?.sleeplessYears || 0;
  };

  const getButtonStyle = (scenario) => {
    const isActive = scenario.key === currentScenario;
    const key = getScenarioKey(scenario);
    const result = simulationResults?.[key];
    const hasResult = result && result.timeline && result.timeline.length > 0;

    if (isActive) {
      return 'bg-purple-600 text-white border-purple-500 shadow-lg transform scale-105';
    } else if (hasResult) {
      return 'bg-slate-700 text-white border-slate-600 hover:bg-slate-600 hover:border-slate-500';
    } else {
      return 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white';
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">
        🔁 Compare Life Scenarios
      </h3>
      <p className="text-slate-400 text-sm text-center mb-6">
        See how different allocation strategies shape your future
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comparisonScenarios.map((scenario) => {
          const yearsToGoal = getYearsToGoal(scenario);
          const finalWealth = getFinalWealth(scenario);
          const sleeplessYears = getSleeplessYears(scenario);
          const isActive = scenario.key === currentScenario;

          return (
            <button
              key={scenario.key}
              onClick={() => onScenarioChange(scenario.key)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${getButtonStyle(scenario)}`}
            >
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">{scenario.emoji}</div>
                <div className="text-lg font-bold mb-1">{scenario.label}</div>
                <div className="text-sm opacity-75">{scenario.description}</div>
              </div>

              {/* Allocation Breakdown */}
              <div className="text-xs text-center mb-3 opacity-75">
                <div>🎲 {scenario.allocation.risk}% • ₿ {scenario.allocation.stable}%</div>
                <div>💵 {scenario.allocation.cash}% • 🧠 {scenario.allocation.self}%</div>
              </div>

              {finalWealth > 0 && (
                <div className="space-y-2">
                  <div className="border-t border-current opacity-20 my-3"></div>

                  <div className="text-center">
                    <div className="text-xs opacity-75 mb-1">Final Wealth</div>
                    <div className="font-bold text-lg">{formatCurrency(finalWealth)}</div>
                  </div>

                  {yearsToGoal && (
                    <div className="text-center">
                      <div className="text-xs opacity-75 mb-1">Years to Goal</div>
                      <div className="font-semibold text-sm">
                        {yearsToGoal} years
                      </div>
                    </div>
                  )}

                  {sleeplessYears > 0 && (
                    <div className="text-center">
                      <div className="text-xs opacity-75 mb-1">Sleepless Years</div>
                      <div className="font-semibold text-sm text-red-400">
                        😵‍💫 {sleeplessYears} years
                      </div>
                    </div>
                  )}

                  {!yearsToGoal && (
                    <div className="text-center">
                      <div className="text-xs opacity-75 text-red-400">Goal not reached</div>
                    </div>
                  )}
                </div>
              )}

              {finalWealth === 0 && (
                <div className="text-center text-xs opacity-50 mt-2">
                  Click to simulate
                </div>
              )}

              {isActive && (
                <div className="text-center mt-3">
                  <div className="inline-flex items-center px-2 py-1 bg-white/10 rounded-full text-xs">
                    <span className="w-2 h-2 bg-current rounded-full mr-1"></span>
                    Active
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Insights */}
      {simulationResults && Object.keys(simulationResults).length > 1 && (
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
          <h4 className="text-white font-semibold mb-3 text-center">💡 Scenario Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {comparisonScenarios.map((scenario) => {
              const key = getScenarioKey(scenario);
              const result = simulationResults[key];
              if (!result) return null;

              const finalWealth = result.finalWealth;
              const yearsToGoal = result.yearsToGoal;
              const sleeplessYears = result.sleeplessYears;

              return (
                <div key={scenario.key} className="text-center">
                  <div className="text-slate-300 mb-1">{scenario.emoji} {scenario.label}</div>
                  <div className="text-white font-bold">{formatCurrency(finalWealth)}</div>
                  {yearsToGoal && (
                    <div className="text-teal-400 text-xs">Goal in {yearsToGoal}y</div>
                  )}
                  {sleeplessYears > 0 && (
                    <div className="text-red-400 text-xs">😵‍💫 {sleeplessYears}y sleepless</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-4 text-center">
        <p className="text-slate-400 text-sm">
          💡 <span className="text-purple-400 font-semibold">The most bullish position is 8 hours of sleep</span>
        </p>
      </div>
    </div>
  );
};

export default ComparisonButtons;