import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WealthChart = ({ timeline, goalAmount, currentScenario }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">📈 Portfolio Growth Over Time</h3>
        <div className="h-64 flex items-center justify-center text-slate-400">
          Run a simulation to see your portfolio projection
        </div>
      </div>
    );
  }

  const ages = timeline.map(point => point.age);
  const riskyData = timeline.map(point => point.risky || 0);
  const stableData = timeline.map(point => point.stable || 0);
  const cashData = timeline.map(point => point.cash || 0);
  const totalWealthData = timeline.map(point => point.totalWealth || 0);
  const stressData = timeline.map(point => point.stress || 0);
  const sleeplessNights = timeline.filter(point => point.sleeplessNights).length;

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const data = {
    labels: ages,
    datasets: [
      {
        label: '💵 TradFi (Cash/Bonds)',
        data: cashData,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        stack: 'portfolio'
      },
      {
        label: '₿ Stable Crypto (BTC/ETH)',
        data: stableData,
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 1,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        stack: 'portfolio'
      },
      {
        label: '🎲 Risky Trades (Degen)',
        data: riskyData,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        stack: 'portfolio'
      },
      {
        label: 'Total Portfolio Value',
        data: totalWealthData,
        borderColor: 'rgb(20, 184, 166)',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointRadius: 1,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(20, 184, 166)',
        pointBorderColor: 'rgb(20, 184, 166)',
        type: 'line'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(203, 213, 225)',
          usePointStyle: true,
          pointStyle: 'line',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(20, 184, 166, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = formatCurrency(context.parsed.y);
            return `${label}: ${value}`;
          },
          afterBody: function(tooltipItems) {
            const dataIndex = tooltipItems[0].dataIndex;
            const age = tooltipItems[0].label;
            const point = timeline[dataIndex];

            if (!point) return [];

            const extraInfo = [];

            if (point.goalAchieved) {
              extraInfo.push(`🎯 Goal achieved at age ${age}!`);
            }

            if (point.sleeplessNights) {
              extraInfo.push(`😵‍💫 Sleepless nights from stress (${point.stress})`);
            }

            if (point.stress > 70) {
              extraInfo.push(`⚠️ High stress reduces income growth`);
            }

            extraInfo.push(`❤️ Health: ${point.health}/100`);
            extraInfo.push(`🙂 Happiness: ${point.happiness}/100`);

            return extraInfo;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Age',
          color: 'rgb(148, 163, 184)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          color: 'rgb(148, 163, 184)',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Wealth ($)',
          color: 'rgb(148, 163, 184)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          color: 'rgb(148, 163, 184)',
          font: {
            size: 12
          },
          callback: function(value) {
            return formatCurrency(value);
          }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  // Add goal line annotation if goal is set
  if (goalAmount > 0) {
    const goalLine = {
      type: 'line',
      mode: 'horizontal',
      scaleID: 'y',
      value: goalAmount,
      borderColor: 'rgba(234, 179, 8, 0.8)',
      borderWidth: 2,
      borderDash: [10, 5],
      label: {
        content: `Goal: ${formatCurrency(goalAmount)}`,
        enabled: true,
        position: 'end'
      }
    };
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          📈 Portfolio Growth Over Time
        </h3>
        {sleeplessNights > 0 && (
          <div className="flex items-center gap-2 text-red-400">
            <span className="animate-pulse">😵‍💫</span>
            <span className="text-sm">{sleeplessNights} sleepless years</span>
          </div>
        )}
      </div>

      <div className="h-80 mb-4">
        <Line data={data} options={options} />
      </div>

      {goalAmount > 0 && (
        <div className="flex items-center justify-center text-sm text-slate-400 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-yellow-500 border-dashed"></div>
            <span>Goal: {formatCurrency(goalAmount)}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className="bg-slate-700 p-3 rounded-lg">
          <div className="text-green-400 font-semibold text-sm">💵 TradFi</div>
          <div className="text-white text-lg font-bold">
            {formatCurrency(cashData[cashData.length - 1] || 0)}
          </div>
        </div>
        <div className="bg-slate-700 p-3 rounded-lg">
          <div className="text-orange-400 font-semibold text-sm">₿ Stable</div>
          <div className="text-white text-lg font-bold">
            {formatCurrency(stableData[stableData.length - 1] || 0)}
          </div>
        </div>
        <div className="bg-slate-700 p-3 rounded-lg">
          <div className="text-red-400 font-semibold text-sm">🎲 Risky</div>
          <div className="text-white text-lg font-bold">
            {formatCurrency(riskyData[riskyData.length - 1] || 0)}
          </div>
        </div>
        <div className="bg-slate-700 p-3 rounded-lg border-2 border-teal-500">
          <div className="text-teal-400 font-semibold text-sm">💎 Total</div>
          <div className="text-white text-lg font-bold">
            {formatCurrency(totalWealthData[totalWealthData.length - 1] || 0)}
          </div>
        </div>
      </div>

      {sleeplessNights > 0 && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
          <div className="text-red-400 text-sm text-center">
            💡 <strong>APY of peace > APY of panic</strong> - High stress cost you {sleeplessNights} years of quality sleep
          </div>
        </div>
      )}
    </div>
  );
};

export default WealthChart;