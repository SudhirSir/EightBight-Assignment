# Dynamic Portfolio Dashboard

A full-stack, real-time financial portfolio tracking web application built with **Next.js 14**, **React**, **TypeScript**, **Tailwind CSS**, and **Node.js**. 

Developed for the **OctaByte AI (8byte)** Full Stack Engineer Technical Assignment.

![Portfolio Dashboard](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🌟 Key Features

1. **Live Real-Time Market Data Integration**:
   - **Yahoo Finance API Scraper**: Live Current Market Price (CMP) updates for Indian stock tickers (NSE/BSE).
   - **Google Finance Scraper**: Retrieves P/E Ratio (TTM) and Latest Earnings (EPS) data.
   - **Server-Side TTL Caching**: Prevents public API rate limits with a 15-second in-memory cache and graceful fallback simulation.

2. **Full Portfolio Table (`@tanstack/react-table`)**:
   - Display stock name, purchase price, quantity, total investment, portfolio weight %, stock exchange symbol, live CMP, present value, gain/loss, P/E ratio, and latest earnings.
   - **Color-Coded Visual Indicators**: Dynamic green badge for positive gain, red badge for negative loss.
   - **Interactive Column Sorting**: Click any header to sort by investment, present value, returns, or market price.

3. **Sector Grouping & Accordion Summaries**:
   - Group holdings into sectors: **Financial**, **Tech**, **Consumer**, **Power**, **Pipe**, and **Others**.
   - Sector-level financial summaries: Total Sector Investment, Total Sector Present Value, Sector Gain/Loss, Sector Return %, and Sector Portfolio Weight.

4. **Dynamic 15-Second Refresh & Controls**:
   - Automated periodic refresh countdown timer (15s) with toggle control and manual **"Refresh Now"** trigger button.
   - Flash animation indicators when prices update.

5. **Interactive Data Visualizations (`Recharts`)**:
   - **Sector Allocation Donut Chart**: Visualizes portfolio capital distribution across sectors.
   - **Sector Gain/Loss Bar Chart**: Compares sector profitability at a glance.

6. **Deep Stock Insights Modal**:
   - Click any stock row to open an interactive modal displaying detailed financial metrics, calculation breakdowns, and direct links to Yahoo Finance quote pages.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State & Tables**: React Hooks & TanStack Table (`@tanstack/react-table`)
- **Charts & Visuals**: Recharts
- **Icons**: Lucide React
- **API Proxy & Scraper**: Node.js Next.js Server API Routes (`/api/portfolio`, `/api/quote`)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.x` or higher
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/eightbight-portfolio-dashboard.git
   cd eightbight-portfolio-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📦 Production Build & Deployment

### Build Locally
To verify the production build locally:
```bash
npm run build
npm run start
```

### Deploying to Vercel / Netlify

#### Vercel Deployment (Recommended)
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import your GitHub repository.
4. Select Framework: **Next.js**.
5. Click **"Deploy"**.

#### Netlify Deployment
1. Import your project repository into Netlify.
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Click **"Deploy site"**.

---

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── portfolio/route.ts  # Main portfolio API route with caching & calculation
│   │   │   └── quote/route.ts      # Live stock quote endpoint
│   │   ├── globals.css             # Tailwind & theme pulse animations
│   │   ├── layout.tsx              # Root HTML layout
│   │   └── page.tsx                # Main dashboard page
│   ├── components/
│   │   ├── Navbar.tsx              # Header with live refresh controls & timer
│   │   ├── SummaryCards.tsx        # High-level portfolio KPI cards
│   │   ├── ControlsBar.tsx         # Search, sector filter & view switcher
│   │   ├── PortfolioTable.tsx      # TanStack Table component with Gain/Loss badges
│   │   ├── SectorGroupView.tsx     # Accordion grouped sector view with summaries
│   │   ├── ChartsSection.tsx       # Recharts Donut & Bar charts
│   │   └── StockModal.tsx          # Stock detailed view modal
│   ├── data/
│   │   └── portfolioData.json      # Structured holdings parsed from Excel case study
│   ├── lib/
│   │   └── finance/
│   │       ├── yahoo.ts            # Yahoo Finance CMP scraper & API client
│   │       └── google.ts           # Google Finance P/E & EPS scraper
│   └── types/
│       └── portfolio.ts            # TypeScript interfaces
├── TECHNICAL_CHALLENGES.md         # Technical document explaining challenges & solutions
├── package.json
└── README.md
```

---

## 📝 License

This project is created for evaluation purposes for OctaByte AI Pvt Ltd.
