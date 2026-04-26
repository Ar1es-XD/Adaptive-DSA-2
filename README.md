# Adaptive-DSA-2 🎓

> **Interactive Algorithm Visualization & Adaptive Learning Platform**  
> Master Data Structures and Algorithms through hands-on, visual, adaptive problem-solving.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-4.4+-646cff.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.com/)
[![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red.svg)](#)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Usage & Examples](#-usage--examples)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Support](#-support)

---

## Overview

**Adaptive-DSA-2** is a full-stack web application designed to revolutionize how students learn Data Structures and Algorithms (DSA). Instead of passively watching algorithm animations, learners **interact**, **experiment**, and **discover** through a dynamic, visual learning environment.

### The Problem We're Solving

Traditional DSA learning is frustrating:
- 📺 Static textbooks and generic visualizations feel disconnected from reality
- 🔒 Limited interaction—students can only watch, not experiment
- 📊 Complexity metrics are abstract—students see $O(n^2)$ but don't *feel* the difference
- 🎯 One-size-fits-all problems ignore individual learning paces

### Our Solution

Adaptive-DSA-2 provides:
- ✨ **Real-time visualizations** of algorithm execution with step-by-step control
- 🎛️ **Adaptive problem generation** that responds to learner input and constraints
- 📈 **Performance metrics dashboard** showing exact comparisons, swaps, and array accesses
- 💻 **Interactive code editor** to modify algorithms and see results instantly
- 📚 **Persistent learning paths** to track progress and revisit concepts
- 🎮 **Gamified elements** with leaderboards and achievement tracking

---

## ✨ Features

### 1. **Algorithm Visualization Engine**
- **Real-time step-by-step execution** with play/pause/step controls
- **Speed adjustment** (0.25x to 4x) to match learning pace
- **Multiple visualization modes**: Array-based, tree-based, graph-based
- **Smooth 60 FPS animations** using Canvas API
- Support for:
  - **Sorting**: Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix
  - **Searching**: Linear, Binary, BFS, DFS, A*
  - **Dynamic Programming**: Fibonacci, LCS, Edit Distance, Knapsack, Coin Change
  - **Graph Algorithms**: Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal, Prim, Topological Sort
  - **String Algorithms**: KMP, Rabin-Karp, Boyer-Moore, Z-Algorithm

### 2. **Performance Analysis Dashboard**
- **Live metrics tracking**:
  - Array comparisons: $C(n)$
  - Element swaps: $S(n)$
  - Array accesses: $A(n)$
  - Time complexity: $T(n)$
  - Space complexity: $S(n)$
- **Comparative charts** showing performance across multiple algorithms
- **Complexity visualization** with real data response
- **Big-O notation explanations** with interactive examples

### 3. **Interactive Code Editor**
- **Embedded Monaco Editor** with TypeScript syntax highlighting
- **Live execution** of custom algorithm implementations
- **Instant feedback** on visualization and metrics
- **Pre-built algorithm templates** for quick modification
- **Error highlighting** with helpful debugging messages

### 4. **Adaptive Problem Generation**
- **Dynamic input generation** based on selected difficulty
- **Configurable constraints**:
  - Array size (1 to 100,000)
  - Data distribution (random, sorted, reverse-sorted, nearly-sorted)
  - Value range and data types
- **Problem presets** for common scenarios
- **Custom input support** for targeted learning

### 5. **Learning Progress Tracking**
- **User authentication** with email/password or OAuth
- **Experiment history** automatically saved
- **Progress dashboard** showing:
  - Algorithms learned
  - Problems solved
  - Time spent per concept
  - Mastery levels
- **Resumable sessions** to pick up where you left off
- **Saved experiments** for future reference

### 6. **Competitive & Social Features**
- **Algorithm efficiency leaderboard** comparing solution speeds
- **Problem-based challenges** with time limits
- **Community solutions** to compare approaches
- **Discussion forum** for asking questions
- **Share experiments** with classmates or mentors

### 7. **Educational Content**
- **Concept primers** explaining algorithm intuition
- **Complexity theory explained** with interactive visualizations
- **Real-world applications** showing where algorithms matter
- **Common pitfalls** highlighting typical mistakes
- **Practice problems** with increasing difficulty

---

## 🚀 Quick Start

### For Users (Try It Online)

1. Visit **[Adaptive-DSA-2 Live](https://adaptive-dsa-2.vercel.app)** (or your deployment URL)
2. **Sign up** with email or GitHub
3. **Select an algorithm** from the library
4. **Run the visualization** and experiment!
5. **Adjust parameters** and see how the algorithm responds
6. **Track your progress** in your learning dashboard

### For Developers (Set Up Locally)

```bash
# 1. Clone the repository
git clone https://github.com/Ar1es-XD/Adaptive-DSA-2.git
cd Adaptive-DSA-2

# 2. Install dependencies
bun install
# or: npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Start the development server
bun run dev
# or: npm run dev

# 5. Open your browser
# Navigate to http://localhost:5173
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, TypeScript, Vite | Modern UI with type safety |
| **Styling** | Tailwind CSS, PostCSS | Responsive design system |
| **Visualization** | Canvas API, Recharts, D3.js | Algorithm animations & charts |
| **Code Editor** | Monaco Editor | Interactive code input |
| **State Management** | React Context API, Zustand | Centralized algorithm state |
| **Backend** | Node.js, Express/Fastify | RESTful API server |
| **Database** | Supabase (PostgreSQL) | Persistent data storage |
| **Auth** | Supabase Auth | User authentication & sessions |
| **Real-Time** | Supabase Realtime | Live leaderboard updates |
| **Testing** | Vitest, React Testing Library | Unit & integration tests |
| **Quality** | ESLint, Prettier | Code linting & formatting |
| **Deployment** | Vercel, Netlify | Hosting & CI/CD |
| **Package Manager** | Bun | Fast JavaScript package manager |

---

## 📦 Installation

### Prerequisites

- **Node.js** v16 or higher (or Bun v1.0+)
- **npm**, **yarn**, or **bun** package manager
- **Git** for cloning the repository
- **PostgreSQL** knowledge (optional, for self-hosting database)

### Step-by-Step Setup

#### 1. Clone & Install

```bash
git clone https://github.com/Ar1es-XD/Adaptive-DSA-2.git
cd Adaptive-DSA-2
bun install
```

#### 2. Configure Environment Variables

```bash
# Create .env.local file
cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend API
VITE_API_BASE_URL=http://localhost:3000

# Feature Flags
VITE_ENABLE_LEADERBOARD=true
VITE_ENABLE_COMPETITIONS=true
EOF
```

Get your Supabase credentials:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy `Project URL` and `Anon Key` from project settings

#### 3. Set Up Database

```bash
# Apply migrations
bun run db:migrate

# (Optional) Seed sample data
bun run db:seed
```

#### 4. Start Development Server

```bash
# Frontend development server (Vite HMR)
bun run dev

# In another terminal, start backend (if using local Node server)
bun run server:dev
```

#### 5. Open in Browser

```
http://localhost:5173
```

---

## 📁 Project Structure

```
Adaptive-DSA-2/
├── src/
│   ├── components/           # React components
│   │   ├── Visualizer/      # Algorithm visualization components
│   │   ├── Editor/          # Code editor integration
│   │   ├── Dashboard/       # User dashboard
│   │   ├── Metrics/         # Performance metrics display
│   │   └── Common/          # Reusable components
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAlgorithm.ts  # Algorithm execution logic
│   │   ├── useVisualizer.ts # Animation state management
│   │   └── useMetrics.ts    # Performance tracking
│   │
│   ├── utils/               # Utility functions
│   │   ├── algorithms/      # Algorithm implementations
│   │   │   ├── sorting.ts
│   │   │   ├── searching.ts
│   │   │   ├── graphs.ts
│   │   │   └── dp.ts
│   │   ├── visualization.ts # Canvas rendering helpers
│   │   ├── complexity.ts    # Big-O analysis
│   │   └── validation.ts    # Input validation
│   │
│   ├── services/            # API & external services
│   │   ├── api.ts           # Supabase client
│   │   ├── auth.ts          # Authentication
│   │   └── storage.ts       # Experiment storage
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── algorithm.ts
│   │   ├── visualization.ts
│   │   └── user.ts
│   │
│   ├── styles/              # Global CSS & Tailwind
│   │   ├── globals.css
│   │   └── animations.css
│   │
│   ├── pages/               # Route pages
│   │   ├── Home.tsx
│   │   ├── Visualizer.tsx
│   │   ├── Dashboard.tsx
│   │   └── Leaderboard.tsx
│   │
│   ├── App.tsx              # Main component
│   └── main.tsx             # Entry point
│
├── public/                  # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── supabase/                # Database setup
│   ├── migrations/          # SQL migrations
│   ├── seeds/               # Sample data
│   └── functions/           # Edge functions (optional)
│
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies & scripts
├── bun.lockb                # Lock file for Bun
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS config
├── vitest.config.ts         # Test configuration
├── eslint.config.js         # Linting rules
└── README.md                # This file
```

---

## 💻 Usage & Examples

### Example 1: Visualizing Bubble Sort

```typescript
import { AlgorithmVisualizer } from './components/Visualizer';
import { algorithms } from './utils/algorithms/sorting';

function BubbleSortDemo() {
  const [data, setData] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [speed, setSpeed] = useState(1);

  return (
    <div>
      <AlgorithmVisualizer
        algorithm={algorithms.bubbleSort}
        data={data}
        speed={speed}
        onSpeedChange={setSpeed}
        showMetrics={true}
      />
      <MetricsDisplay
        comparisons={data.length * (data.length - 1) / 2}
        complexity="O(n²)"
      />
    </div>
  );
}
```

### Example 2: Comparing Multiple Algorithms

```typescript
function AlgorithmComparison() {
  const algorithms = ['bubbleSort', 'mergeSort', 'quickSort'];
  const data = Array.from({ length: 100 }, () => Math.random() * 1000);

  const results = algorithms.map(algo => ({
    name: algo,
    metrics: executeAlgorithm(algo, data),
  }));

  return (
    <div>
      <ComparisonChart data={results} />
      <PerformanceTable data={results} />
    </div>
  );
}
```

### Example 3: Custom Algorithm Implementation

```typescript
function CustomAlgorithmEditor() {
  const [code, setCode] = useState(`
    function customSort(arr) {
      // Write your sorting algorithm here
      return arr;
    }
  `);

  return (
    <div className="grid grid-cols-2 gap-4">
      <CodeEditor value={code} onChange={setCode} />
      <AlgorithmVisualizer
        code={code}
        data={[5, 2, 8, 1, 9]}
        trackMetrics={true}
      />
    </div>
  );
}
```

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Browser (Client)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ React Application                                    │   │
│  │ ├─ UI Components (Tailwind CSS)                     │   │
│  │ ├─ Canvas Visualizer (60 FPS animations)            │   │
│  │ ├─ Metrics Dashboard (Recharts)                     │   │
│  │ ├─ Monaco Code Editor                               │   │
│  │ └─ State Management (Context API)                   │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │ REST API / WebSocket               │
└─────────────────────────┼───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────▼──────────┐  ┌──▼────────────┐  ┌▼──────────────┐
│  Backend Server  │  │  Supabase     │  │  Real-Time    │
│  (Express)       │  │  Database     │  │  Subscriptions│
│                  │  │  (PostgreSQL) │  │  (WebSocket)  │
└──────────────────┘  └───────────────┘  └───────────────┘

Data Flow:
1. User inputs algorithm parameters
2. Frontend renders visualization
3. Algorithm engine calculates steps
4. Canvas animates changes
5. Metrics calculated and displayed
6. Results saved to database (async)
7. Real-time updates on leaderboard
```

### Algorithm Execution Flow

```
User Input
    ↓
Validate Input
    ↓
Initialize Algorithm State
    ↓
Generator Step Loop
    ├─ Calculate next operation
    ├─ Update metrics (comparisons, swaps)
    ├─ Enqueue animation frame
    └─ Yield control
    ↓
Visualizer Renders
    ├─ Canvas animation
    ├─ State snapshot
    └─ Metrics update
    ↓
User Controls (play/pause/step)
    ↓
Save to Database
    └─ Experiment history
```

---

## 🧪 Testing

### Run Tests

```bash
# All tests
bun run test

# Watch mode
bun run test:watch

# Coverage report
bun run test:coverage

# E2E tests (if available)
bun run test:e2e
```

### Example Test

```typescript
// tests/unit/algorithms/bubbleSort.test.ts
import { describe, it, expect } from 'vitest';
import { bubbleSort } from '@/utils/algorithms/sorting';

describe('Bubble Sort', () => {
  it('should sort an array correctly', () => {
    const result = bubbleSort([64, 34, 25, 12, 22, 11, 90]);
    expect(result).toEqual([11, 12, 22, 25, 34, 64, 90]);
  });

  it('should handle empty array', () => {
    expect(bubbleSort([])).toEqual([]);
  });

  it('should track comparisons', () => {
    const metrics = bubbleSort.withMetrics([3, 1, 2]);
    expect(metrics.comparisons).toBe(3); // (3 * 2) / 2
  });
});
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Connect your GitHub repo to Vercel
# Vercel auto-deploys on every push to main

# Or deploy manually:
bun run build
bun install -g vercel
vercel
```

### Deploy to Netlify

```bash
# Build
bun run build

# Deploy via CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Self-Host on AWS/GCP

1. **Set up PostgreSQL database**
2. **Deploy backend** to EC2/Cloud Run
3. **Deploy frontend** to S3 + CloudFront
4. **Configure environment variables** in CI/CD

---

## 📊 Database Schema

### Key Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

-- Experiments (saved algorithm runs)
CREATE TABLE experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  algorithm_type VARCHAR NOT NULL,
  input_size INTEGER,
  execution_time_ms INTEGER,
  comparisons INTEGER,
  swaps INTEGER,
  array_accesses INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

-- Leaderboard (algorithm performance)
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  algorithm_type VARCHAR,
  problem_id UUID,
  execution_time_ms INTEGER,
  rank INTEGER,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## 🤝 Contributing

We love contributions! Here's how to get started:

### Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/Adaptive-DSA-2.git
cd Adaptive-DSA-2
git checkout -b feature/your-feature-name
```

### Make Changes

1. **Follow TypeScript conventions**
2. **Write tests** for new features
3. **Run linter** before committing:
   ```bash
   bun run lint
   ```
4. **Format code**:
   ```bash
   bun run format
   ```

### Submit Pull Request

1. Push to your fork
2. Create a Pull Request with clear description
3. Link any related issues
4. Wait for review & feedback

### Development Guidelines

- **Component Structure**: One component per file
- **Naming**: CamelCase for components, camelCase for functions
- **Styling**: Use Tailwind CSS utilities
- **Type Safety**: All React props should have TypeScript types
- **Comments**: Add JSDoc for complex functions
- **Testing**: Aim for >80% code coverage

---

## 🗺️ Roadmap

### Version 1.0 (Current) ✅
- [x] Core algorithm visualizations
- [x] Performance metrics tracking
- [x] User authentication
- [x] Experiment history
- [x] Basic leaderboard

### Version 1.1 (Planned) 🚧
- [ ] Custom algorithm templates
- [ ] Collaborative learning sessions
- [ ] Advanced graph visualizations
- [ ] Mobile app (React Native)
- [ ] Offline mode

### Version 2.0 (Future) 🔮
- [ ] AI-powered hints system
- [ ] Competitive coding integration
- [ ] Certificate generation
- [ ] Virtual classroom features
- [ ] Real-time multiplayer challenges
- [ ] Advanced complexity analysis (cache behavior, branch prediction)

---

## 📚 Learning Resources

### Algorithm Guides
- [Big-O Notation Explained](docs/big-o-notation.md)
- [Sorting Algorithm Comparison](docs/sorting-comparison.md)
- [Graph Theory Basics](docs/graph-theory.md)
- [Dynamic Programming Patterns](docs/dp-patterns.md)

### External Resources
- [Visualgo](https://visualgo.net) – Inspiration for algorithm visualization
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com) – Time complexity reference
- [LeetCode](https://leetcode.com) – Practice problems
- [GeeksforGeeks](https://geeksforgeeks.org) – Algorithm explanations

---

## 🐛 Known Issues & Limitations

| Issue | Status | Workaround |
|-------|--------|-----------|
| Large arrays (>10,000) slow down canvas rendering | Known | Use fast-forward mode |
| Real-time leaderboard updates may lag | Known | Refresh page manually |
| Code editor doesn't support multi-file | Planned | Use external IDE |
| No offline support yet | Planned | Cache experiments locally |

---

## 📄 License

This project is licensed under the **MIT License** – see [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024-2026 Adaptive-DSA-2 Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

---

## 💬 Support & Community

### Getting Help

- **Issues**: Found a bug? [Open an issue](https://github.com/Ar1es-XD/Adaptive-DSA-2/issues)
- **Discussions**: Have a question? [Start a discussion](https://github.com/Ar1es-XD/Adaptive-DSA-2/discussions)
- **Email**: contact@adaptive-dsa.dev
- **Discord**: [Join our community](https://discord.gg/adaptive-dsa) (coming soon)

### Report Security Issues

Please email security@adaptive-dsa.dev with details. Do **not** open public issues for security vulnerabilities.

---

## 🙌 Acknowledgments

Special thanks to:
- 👨‍💻 All contributors who've helped build this project
- 🎓 Educators who've provided feedback
- 🎨 The open-source community for amazing libraries
- 💡 Inspired by [VisuAlgo](https://visualgo.net), [algorithm-visualizer](https://algorithm-visualizer.org), and others

---

## 📈 Project Stats

- **Lines of Code**: ~5,000+
- **Algorithms Implemented**: 25+
- **Test Coverage**: 80%+
- **Documentation**: 100%
- **Contributors**: 1+ (and counting!)

---

<div align="center">

### Made with ❤️ by the Adaptive-DSA-2 Team

⭐ **If you find this project helpful, please consider starring the repository!**

[Visit Live Demo](https://adaptive-dsa.vercel.app/) • 
[Report Bug](https://github.com/Ar1es-XD/Adaptive-DSA-2/issues) • 
[Request Feature](https://github.com/Ar1es-XD/Adaptive-DSA-2/discussions)

</div>

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: Active Development ✨
