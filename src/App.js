import React, { useState, useEffect } from "react";
import SimulationInputs from "./components/SimulationInputs";
import WealthChart from "./components/WealthChart";
import GoalProgress from "./components/GoalProgress";
import FutureSelfSnapshot from "./components/FutureSelfSnapshot";
import ComparisonButtons from "./components/ComparisonButtons";
import { simulateCryptoLife } from "./utils/simulation";

function App() {
  const [inputs, setInputs] = useState({
    ageStart: 25,
    ageEnd: 65,
    annualIncome: 30000,
    allocRisk: 0.3, // 30% risky trades
    allocStable: 0.2, // 20% stable crypto
    allocCash: 0.2, // 20% cash/bonds
    allocSelf: 0.1, // 10% self investment
    goalAmount: 500000,
  });

  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationResults, setSimulationResults] = useState({});
  const [currentScenario, setCurrentScenario] = useState("balanced");

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const runSimulation = (customInputs = null) => {
    const simulationInputs = customInputs || inputs;
    const result = simulateCryptoLife(simulationInputs);
    setSimulationResult(result);

    // Store result for the current scenario
    const scenarioKey = getScenarioKey(simulationInputs);
    setSimulationResults((prev) => ({
      ...prev,
      [scenarioKey]: result,
    }));

    return result;
  };

  const getScenarioKey = (inputParams) => {
    const { allocRisk, allocStable, allocCash, allocSelf } = inputParams;
    return `${allocRisk}-${allocStable}-${allocCash}-${allocSelf}`;
  };

  const presetScenarios = {
    degen: {
      allocRisk: 0.7,
      allocStable: 0.15,
      allocCash: 0.1,
      allocSelf: 0.05,
    },
    balanced: {
      allocRisk: 0.25,
      allocStable: 0.3,
      allocCash: 0.25,
      allocSelf: 0.2,
    },
    lockin: {
      allocRisk: 0.05,
      allocStable: 0.35,
      allocCash: 0.3,
      allocSelf: 0.3,
    },
  };

  const handleScenarioChange = (scenarioName) => {
    setCurrentScenario(scenarioName);
    const scenario = presetScenarios[scenarioName];

    if (scenario) {
      const newInputs = { ...inputs, ...scenario };
      setInputs(newInputs);

      // Check if we already have simulation for this scenario
      const scenarioKey = getScenarioKey(newInputs);
      if (simulationResults[scenarioKey]) {
        setSimulationResult(simulationResults[scenarioKey]);
      } else {
        runSimulation(newInputs);
      }
    }
  };

  // Auto-run simulation when inputs change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    inputs.ageStart,
    inputs.annualIncome,
    inputs.goalAmount,
    inputs.allocRisk,
    inputs.allocStable,
    inputs.allocCash,
    inputs.allocSelf,
  ]);

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
            🏃 FREEDOM RUN SIMULATOR
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            See How Your Allocation Ripples Across Decades
          </p>
          <p className="text-slate-400 max-w-3xl mx-auto">
            Every spike you chase costs you a night of sleep. The most bullish
            position is 8 hours of sleep.
            <span className="text-purple-400 font-semibold">
              {" "}
              APY of peace > APY of panic.
            </span>
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
              currentScenario={currentScenario}
              onScenarioChange={handleScenarioChange}
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
            <h3 className="text-white font-semibold mb-3">💡 The Real Alpha</h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-4xl mx-auto">
              Built for Web3 gamblers to visualize how allocation choices ripple
              across decades. When you crank the 'risk' slider, wealth might
              spike — but health and sleep collapse. When you invest in yourself
              and balance risk, stress drops and the curve smooths.
              <span className="text-teal-400 font-semibold">
                {" "}
                You can't 100× if you 0× your health.
              </span>
            </p>
            <div className="mt-4 flex justify-center items-center gap-4 text-xs text-slate-400">
              <span>🔥 Stablecoins are for your wallet</span>
              <span>•</span>
              <span>💤 Stability is for your mind</span>
              <span>•</span>
              <span>📈 Data-driven mirror</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
