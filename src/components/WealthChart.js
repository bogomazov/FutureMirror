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
        <h3 className="text-lg font-semibold text-white mb-4">📈 Wealth Over Time</h3>
        <div className="h-64 flex items-center justify-center text-slate-400">
          Run a simulation to see your wealth projection
        </div>
      </div>
    );
  }

  const ages = timeline.map(point => point.age);
  const savingsData = timeline.map(point => point.savings);
  const gamblingData = timeline.map(point => point.gambling);

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
        label: 'Consistent Savings Path',
        data: savingsData,
        borderColor: 'rgb(20, 184, 166)',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(20, 184, 166)',
        pointBorderColor: 'rgb(20, 184, 166)',
      },
      {
        label: 'Gambling/Risk Path',
        data: gamblingData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: 'rgb(239, 68, 68)',
        borderDash: [5, 5],
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
            const age = tooltipItems[0].label;
            const goalReached = timeline[tooltipItems[0].dataIndex]?.goalAchieved;
            if (goalReached) {
              return [`🎯 Goal achieved at age ${age}!`];
            }
            return [];
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
      <h3 className="text-lg font-semibold text-white mb-4">
        📈 Wealth Over Time
        {currentScenario && (
          <span className="ml-2 text-sm text-slate-400">
            (Savings Rate: {(currentScenario * 100).toFixed(0)}%)
          </span>
        )}
      </h3>

      <div className="h-80 mb-4">
        <Line data={data} options={options} />
      </div>

      {goalAmount > 0 && (
        <div className="flex items-center justify-center text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-yellow-500 border-dashed"></div>
            <span>Goal: {formatCurrency(goalAmount)}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4 text-center">
        <div className="bg-slate-700 p-3 rounded-lg">
          <div className="text-teal-400 font-semibold">Savings Final Value</div>
          <div className="text-white text-lg font-bold">
            {formatCurrency(savingsData[savingsData.length - 1] || 0)}
          </div>
        </div>
        <div className="bg-slate-700 p-3 rounded-lg">
          <div className="text-red-400 font-semibold">Gambling Final Value</div>
          <div className="text-white text-lg font-bold">
            {formatCurrency(gamblingData[gamblingData.length - 1] || 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WealthChart;