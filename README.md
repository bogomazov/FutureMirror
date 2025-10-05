# 🏃 Freedom Run Simulator

**📊 [View Project Presentation](https://docs.google.com/presentation/d/1OyH27jy8BqmxGlio_Ahe1osx2LZhC1zZw2rvP46hOC8/edit?usp=sharing)**

**See your life before it gets rekt.**

A data-driven financial planning simulator designed to help young investors navigate stagflation and increasing wealth gaps by visualizing the long-term outcomes of different investment strategies.

## 🎯 Purpose

Convincing a young generation to save during stagflation with an ever-increasing wealth gap is a challenge. Is there even hope of financial freedom, or should one rather stay present and risk it all?

Future Mirror visualizes the outcomes of life by retirement age, depending on the strategy you choose. It explores the possibility of achieving financial freedom through:
- Disciplined self-investment + hedge approach
- High-risk investments/gambling
- Balanced portfolio strategies

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd liferun
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the app.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🎮 How to Use

### Investment Scenarios

Choose from three preset strategies or customize your own:

1. **🎲 DEGEN** (70% risk, 15% stable, 10% cash, 5% self)
   - High-risk, high-reward approach
   - Maximum volatility with potential for extreme gains/losses

2. **⚖️ BALANCED** (25% risk, 30% stable, 25% cash, 20% self)
   - Moderate risk with steady growth
   - Balanced approach between safety and growth

3. **🔒 LOCK-IN** (5% risk, 35% stable, 30% cash, 30% self)
   - Conservative approach with heavy self-investment
   - Lower volatility, higher long-term compounding

### Key Features

- **Interactive Allocation Sliders**: Adjust your portfolio allocation in real-time
- **Wealth Timeline Visualization**: See how your wealth grows over 40 years
- **Goal Progress Tracking**: Monitor progress toward your financial freedom target
- **Future Self Snapshot**: Visualize your health, stress, and income at retirement
- **Scenario Comparison**: Compare different strategies side-by-side

### Parameters You Can Adjust

- **Starting Age**: When you begin investing (default: 25)
- **Retirement Age**: Your target retirement age (default: 65)
- **Annual Income**: Your current yearly income
- **Goal Amount**: Your financial freedom target (default: $500,000)
- **Risk Allocation**: Percentage in high-risk investments
- **Stable Allocation**: Percentage in stable crypto/assets
- **Cash Allocation**: Percentage in cash/bonds
- **Self Investment**: Percentage invested in personal development

## 🧮 The Simulation Model

The app simulates financial growth using:

- **Market Volatility**: Realistic boom/bust cycles affecting different asset classes
- **Self-Investment Compounding**: Skills and health improvements that increase earning potential
- **Stress Factors**: How risk levels affect health and decision-making
- **Income Growth**: Career progression based on self-investment levels

## 💡 Key Insights

- **"Invest in Self" grows slower short-term, but compounds way harder later**
- High-risk strategies may spike wealth but often collapse health and income growth
- Self-investment reduces stress and creates exponential long-term growth
- Balanced approaches often provide the best risk-adjusted returns

## 🛠 Technology Stack

- **React 18** - Frontend framework
- **Chart.js** - Data visualization
- **Tailwind CSS** - Styling and responsive design
- **Create React App** - Development tooling

## 📁 Project Structure

```
src/
├── components/
│   ├── SimulationInputs.js    # Input controls and sliders
│   ├── WealthChart.js         # Main wealth timeline chart
│   ├── GoalProgress.js        # Goal achievement tracking
│   ├── FutureSelfSnapshot.js  # Health/stress visualization
│   └── ComparisonButtons.js   # Scenario selection buttons
├── utils/
│   └── simulation.js          # Core simulation logic
└── App.js                     # Main application component
```

## 🎨 Design Philosophy

Built for Web3 gamblers to visualize how allocation choices ripple across decades. The interface uses:

- **Dark, crypto-inspired theme**
- **Real-time updates** as you adjust parameters
- **Intuitive sliders** for easy experimentation
- **Clear visual feedback** on long-term outcomes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

---

*"Stablecoins are for your wallet • Stability is for your mind • Data-driven mirror"*