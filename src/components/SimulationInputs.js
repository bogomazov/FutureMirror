import React from 'react';

const SimulationInputs = ({
  inputs,
  onInputChange,
  onSimulate
}) => {
  const handleInputChange = (field, value) => {
    onInputChange(field, value);
  };

  const handleAllocationChange = (field, value) => {
    const newValue = parseFloat(value);
    const updatedInputs = { ...inputs, [field]: newValue };

    // Auto-balance allocations to ensure they sum to a reasonable total
    const total = updatedInputs.allocRisk + updatedInputs.allocStable + updatedInputs.allocCash + updatedInputs.allocSelf;
    if (total > 1.0) {
      // Scale down other allocations proportionally
      const excess = total - 1.0;
      const others = ['allocRisk', 'allocStable', 'allocCash', 'allocSelf'].filter(f => f !== field);
      others.forEach(otherField => {
        if (updatedInputs[otherField] > 0) {
          const reduction = Math.min(updatedInputs[otherField], excess / others.length);
          updatedInputs[otherField] = Math.max(0, updatedInputs[otherField] - reduction);
        }
      });
    }

    // Update all changed fields
    Object.keys(updatedInputs).forEach(key => {
      if (updatedInputs[key] !== inputs[key]) {
        onInputChange(key, updatedInputs[key]);
      }
    });
  };

  const presetGoals = [
    { label: 'Lambo Fund', value: 200000 },
    { label: 'Escape Velocity', value: 500000 },
    { label: 'Generational Wealth', value: 1000000 },
    { label: 'Diamond Hands Goal', value: 2000000 },
    { label: 'Custom', value: 'custom' }
  ];

  const totalAllocation = inputs.allocRisk + inputs.allocStable + inputs.allocCash + inputs.allocSelf;
  const remainingAllocation = Math.max(0, 1.0 - totalAllocation);

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        🚀 WEB3 LIFE SIMULATOR
      </h2>
      <p className="text-slate-400 text-sm text-center mb-6">
        See how your allocation choices ripple across decades
      </p>

      <div className="space-y-6 mb-6">
        {/* Age and Income */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Annual Income
            </label>
            <input
              type="number"
              value={inputs.annualIncome}
              onChange={(e) => handleInputChange('annualIncome', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="30000"
            />
          </div>
        </div>

        {/* Allocation Controls */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">💰 Portfolio Allocation</h3>

          {/* Risk Assets */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-red-300">
                🎲 Risky Trades (Leverage/Memecoins/Degen)
              </label>
              <span className="text-red-400 font-bold">{(inputs.allocRisk * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              value={inputs.allocRisk}
              onChange={(e) => handleAllocationChange('allocRisk', e.target.value)}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${inputs.allocRisk * 125}%, #475569 ${inputs.allocRisk * 125}%, #475569 100%)`
              }}
            />
            <div className="text-xs text-slate-400 mt-1">
              High risk, high reward... and high stress
            </div>
          </div>

          {/* Stable Crypto */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-orange-300">
                ₿ Stable Crypto (BTC/ETH/Blue Chips)
              </label>
              <span className="text-orange-400 font-bold">{(inputs.allocStable * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.6"
              step="0.05"
              value={inputs.allocStable}
              onChange={(e) => handleAllocationChange('allocStable', e.target.value)}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #f97316 0%, #f97316 ${inputs.allocStable * 167}%, #475569 ${inputs.allocStable * 167}%, #475569 100%)`
              }}
            />
            <div className="text-xs text-slate-400 mt-1">
              Moderate growth with lower volatility
            </div>
          </div>

          {/* Cash/Bonds */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-green-300">
                💵 TradFi (Cash/Bonds/Index Funds)
              </label>
              <span className="text-green-400 font-bold">{(inputs.allocCash * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={inputs.allocCash}
              onChange={(e) => handleAllocationChange('allocCash', e.target.value)}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${inputs.allocCash * 200}%, #475569 ${inputs.allocCash * 200}%, #475569 100%)`
              }}
            />
            <div className="text-xs text-slate-400 mt-1">
              Boring but stable safety net
            </div>
          </div>

          {/* Self Investment */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-purple-300">
                🧠 Self Investment (Skills/Health/Sleep)
              </label>
              <span className="text-purple-400 font-bold">{(inputs.allocSelf * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.3"
              step="0.05"
              value={inputs.allocSelf}
              onChange={(e) => handleAllocationChange('allocSelf', e.target.value)}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${inputs.allocSelf * 333}%, #475569 ${inputs.allocSelf * 333}%, #475569 100%)`
              }}
            />
            <div className="text-xs text-slate-400 mt-1">
              Boosts future income & reduces stress
            </div>
          </div>

          {/* Allocation Summary */}
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Total Allocated:</span>
              <span className={`font-bold ${totalAllocation > 1.0 ? 'text-red-400' : totalAllocation > 0.9 ? 'text-green-400' : 'text-yellow-400'}`}>
                {(totalAllocation * 100).toFixed(0)}%
              </span>
            </div>
            {remainingAllocation > 0 && (
              <div className="text-xs text-slate-400 mt-1">
                {(remainingAllocation * 100).toFixed(0)}% unallocated (lifestyle spending)
              </div>
            )}
            {totalAllocation > 1.0 && (
              <div className="text-xs text-red-400 mt-1">
                ⚠️ Over-allocated! Adjust sliders above
              </div>
            )}
          </div>
        </div>

        {/* Goal Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            🎯 Diamond Hands Goal
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
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
                className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
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
            placeholder="1000000"
          />
        </div>
      </div>

      <button
        onClick={onSimulate}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        🚀 Run Simulation
      </button>
    </div>
  );
};

export default SimulationInputs;