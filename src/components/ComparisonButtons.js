import React from 'react';

const ComparisonButtons = ({ currentRate, onRateChange, simulationResults }) => {
  const comparisonRates = [
    { rate: 0.10, label: '10%', description: 'Conservative' },
    { rate: 0.20, label: '20%', description: 'Moderate' },
    { rate: 0.40, label: '40%', description: 'Aggressive' }
  ];

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getYearsToGoal = (rate) => {
    const result = simulationResults?.[rate];
    return result?.yearsToGoal || null;
  };

  const getFinalWealth = (rate) => {
    const result = simulationResults?.[rate];
    return result?.finalSavings || 0;
  };

  const getButtonStyle = (rate) => {
    const isActive = rate === currentRate;
    const result = simulationResults?.[rate];
    const hasResult = result && result.timeline && result.timeline.length > 0;

    if (isActive) {
      return 'bg-teal-600 text-white border-teal-500 shadow-lg transform scale-105';
    } else if (hasResult) {
      return 'bg-slate-700 text-white border-slate-600 hover:bg-slate-600 hover:border-slate-500';
    } else {
      return 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white';
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">
        🔁 Compare Savings Scenarios
      </h3>
      <p className="text-slate-400 text-sm text-center mb-6">
        Click to see how different savings rates change your future
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comparisonRates.map((scenario) => {
          const yearsToGoal = getYearsToGoal(scenario.rate);
          const finalWealth = getFinalWealth(scenario.rate);
          const isActive = scenario.rate === currentRate;

          return (
            <button
              key={scenario.rate}
              onClick={() => onRateChange(scenario.rate)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${getButtonStyle(scenario.rate)}`}
            >
              <div className="text-center mb-3">
                <div className="text-2xl font-bold mb-1">{scenario.label}</div>
                <div className="text-sm opacity-75">{scenario.description}</div>
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

                  {!yearsToGoal && (
                    <div className="text-center">
                      <div className="text-xs opacity-75">Goal not reached</div>
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
          <h4 className="text-white font-semibold mb-3 text-center">💡 Quick Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {comparisonRates.map((scenario) => {
              const result = simulationResults[scenario.rate];
              if (!result) return null;

              const finalWealth = result.finalSavings;
              const yearsToGoal = result.yearsToGoal;

              return (
                <div key={scenario.rate} className="text-center">
                  <div className="text-slate-300 mb-1">{scenario.label} Savings</div>
                  <div className="text-white font-bold">{formatCurrency(finalWealth)}</div>
                  {yearsToGoal && (
                    <div className="text-teal-400 text-xs">Goal in {yearsToGoal}y</div>
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
          Higher savings rates dramatically accelerate your path to financial freedom
        </p>
      </div>
    </div>
  );
};

export default ComparisonButtons;