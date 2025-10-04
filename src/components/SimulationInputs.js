import React from 'react';

const SimulationInputs = ({
  inputs,
  onInputChange,
  onSimulate
}) => {
  const handleInputChange = (field, value) => {
    onInputChange(field, value);
  };

  const presetGoals = [
    { label: 'Emergency Fund', value: 25000 },
    { label: 'House Down Payment', value: 50000 },
    { label: 'Freedom Fund', value: 100000 },
    { label: 'Early Retirement', value: 500000 },
    { label: 'Custom', value: 'custom' }
  ];

  const savingsRates = [
    { label: '5%', value: 0.05 },
    { label: '10%', value: 0.10 },
    { label: '15%', value: 0.15 },
    { label: '20%', value: 0.20 },
    { label: '30%', value: 0.30 },
    { label: '40%', value: 0.40 }
  ];

  const riskRates = [
    { label: 'None (0%)', value: 0.00 },
    { label: 'Low (5%)', value: 0.05 },
    { label: 'Medium (10%)', value: 0.10 },
    { label: 'High (20%)', value: 0.20 },
    { label: 'Extreme (40%)', value: 0.40 }
  ];

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-6 text-center">
        🔒 FUTURE MIRROR – Life Path Visualizer
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Age Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Current Age: {inputs.ageStart}
          </label>
          <input
            type="range"
            min="18"
            max="50"
            value={inputs.ageStart}
            onChange={(e) => handleInputChange('ageStart', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>18</span>
            <span>50</span>
          </div>
        </div>

        {/* Monthly Income */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Monthly Income
          </label>
          <input
            type="number"
            value={inputs.monthlyIncome}
            onChange={(e) => handleInputChange('monthlyIncome', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="2000"
          />
        </div>

        {/* Savings Rate */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Savings Rate
          </label>
          <select
            value={inputs.savingsRate}
            onChange={(e) => handleInputChange('savingsRate', parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {savingsRates.map(rate => (
              <option key={rate.value} value={rate.value}>
                {rate.label}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Rate */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Gambling/Risk Rate
          </label>
          <select
            value={inputs.riskRate}
            onChange={(e) => handleInputChange('riskRate', parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {riskRates.map(rate => (
              <option key={rate.value} value={rate.value}>
                {rate.label}
              </option>
            ))}
          </select>
        </div>

        {/* Goal Selection */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Target Goal
          </label>
          <div className="flex gap-2 mb-2">
            {presetGoals.map(goal => (
              <button
                key={goal.value}
                onClick={() => {
                  if (goal.value === 'custom') {
                    // Keep current custom value
                  } else {
                    handleInputChange('goalAmount', goal.value);
                  }
                }}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  inputs.goalAmount === goal.value
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {goal.label}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={inputs.goalAmount}
            onChange={(e) => handleInputChange('goalAmount', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="100000"
          />
        </div>
      </div>

      <button
        onClick={onSimulate}
        className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        🔮 Simulate Your Future
      </button>
    </div>
  );
};

export default SimulationInputs;