import React, { useState, useEffect } from 'react';
import SimulationInputs from './components/SimulationInputs';
import WealthChart from './components/WealthChart';
import GoalProgress from './components/GoalProgress';
import FutureSelfSnapshot from './components/FutureSelfSnapshot';
import ComparisonButtons from './components/ComparisonButtons';
import { simulateLife } from './utils/simulation';

function App() {
  const [inputs, setInputs] = useState({
    ageStart: 25,
    ageEnd: 65,
    monthlyIncome: 2000,
    savingsRate: 0.10,
    riskRate: 0.00,
    yieldRate: 0.05,
    goalAmount: 100000
  });

  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationResults, setSimulationResults] = useState({});
  const [currentScenario, setCurrentScenario] = useState(0.10);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const runSimulation = (customInputs = null) => {
    const simulationInputs = customInputs || inputs;
    const result = simulateLife(simulationInputs);
    setSimulationResult(result);

    // Store result for the current savings rate
    setSimulationResults(prev => ({
      ...prev,
      [simulationInputs.savingsRate]: result
    }));

    return result;
  };

  const handleScenarioChange = (newRate) => {
    setCurrentScenario(newRate);

    // Check if we already have simulation for this rate
    if (simulationResults[newRate]) {
      setSimulationResult(simulationResults[newRate]);
      setInputs(prev => ({ ...prev, savingsRate: newRate }));
    } else {
      // Run new simulation with the new rate
      const newInputs = { ...inputs, savingsRate: newRate };
      setInputs(newInputs);
      runSimulation(newInputs);
    }
  };

  // Auto-run simulation when inputs change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation();
    }, 500);

    return () => clearTimeout(timer);
  }, [inputs.ageStart, inputs.monthlyIncome, inputs.goalAmount, inputs.riskRate]);

  // Run initial simulation on mount
  useEffect(() => {
    runSimulation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🔮 Future Mirror
          </h1>
          <p className="text-xl text-slate-300 mb-2">Life Path Visualizer</p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            See how your financial choices today shape your future.
            Discover the power of consistent saving vs. the risks of gambling.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="xl:col-span-1 space-y-6">
            <SimulationInputs
              inputs={inputs}
              onInputChange={handleInputChange}
              onSimulate={() => runSimulation()}
            />

            <ComparisonButtons
              currentRate={currentScenario}
              onRateChange={handleScenarioChange}
              simulationResults={simulationResults}
            />
          </div>

          {/* Right Column - Results */}
          <div className="xl:col-span-2 space-y-6">
            <WealthChart
              timeline={simulationResult?.timeline}
              goalAmount={inputs.goalAmount}
              currentScenario={currentScenario}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GoalProgress
                simulationResult={simulationResult}
                inputs={inputs}
              />

              <div className="lg:col-span-1">
                <FutureSelfSnapshot
                  simulationResult={simulationResult}
                  inputs={inputs}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-3">💡 About Future Mirror</h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-4xl mx-auto">
              This tool helps you visualize the long-term impact of your financial decisions.
              By showing the stark contrast between consistent saving and high-risk behavior,
              it empowers you to make informed choices about your financial future.
              The simulations use realistic compound interest calculations and gambling loss models
              to provide accurate projections.
            </p>
            <div className="mt-4 flex justify-center items-center gap-4 text-xs text-slate-400">
              <span>Built with React & Chart.js</span>
              <span>•</span>
              <span>Open Source</span>
              <span>•</span>
              <span>Educational Tool</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;