# 🤘 Longhorn Network - React Implementation

A sophisticated, fully-functional React implementation of the Longhorn Network social networking platform for university students, featuring advanced graph algorithms, beautiful UI, and comprehensive documentation.

## 🌟 Overview

Longhorn Network is a university social network that helps students:
- **Match with roommates** using the Gale-Shapley stable matching algorithm
- **Find internship referrals** through their network using Dijkstra's shortest path algorithm
- **Form study pods/groups** with strong connections using Prim's minimum spanning tree algorithm
- **Visualize their social network** with an interactive graph visualization
- **Simulate concurrent social interactions** with friend requests and messaging

This React implementation mirrors the Java version while providing a modern, responsive web interface with stunning visuals.

## ✨ Features

### Core Algorithms (All Fully Implemented)

1. **Gale-Shapley Roommate Matching** (`src/algorithms/GaleShapley.ts`)
   - Stable matching algorithm for roommate assignment
   - Handles incomplete preferences and edge cases
   - O(n²) time complexity
   - Guarantees no blocking pairs

2. **Dijkstra's Referral Path Finding** (`src/algorithms/ReferralPathFinder.ts`)
   - Finds strongest connection path to students with specific internships
   - Inverts edge weights to prioritize strong connections
   - O((V + E) log V) time complexity
   - Early termination optimization

3. **Prim's Pod Formation** (`src/algorithms/PodFormation.ts`)
   - Forms optimal student groups using minimum spanning tree
   - Handles disconnected components
   - O(n * podSize * log(podSize)) time complexity
   - Maximizes intra-group connection strength

4. **Multithreading Simulation** (`src/utils/ThreadingSimulation.ts`)
   - Simulates concurrent friend requests and chat messages
   - Uses Promises and async/await for asynchronous execution
   - Thread-safe operations with proper ordering
   - Mimics Java's ExecutorService pattern

### User Interface

- **Modern Design**: Texas Longhorn-themed with burnt orange (#BF5700) and cream tones
- **Responsive**: Works beautifully on desktop, tablet, and mobile
- **Interactive Graph**: Canvas-based network visualization with animated nodes
- **Smooth Animations**: Professional micro-interactions and transitions
- **Accessible**: WCAG-compliant with keyboard navigation support

### Data Structures

- **Student Graph** (`src/models/StudentGraph.ts`): Weighted undirected graph with adjacency list
- **University Student** (`src/models/UniversityStudent.ts`): Complete student model with all attributes
- **Test Data Generator** (`src/utils/TestDataGenerator.ts`): Three test cases matching Java implementation

## 📋 Requirements Fulfillment

This implementation fulfills **ALL** lab requirements:

### ✅ Core Components (Step 3 & 4)
- [x] Data parsing (test data generation)
- [x] Student Graph with adjacency list representation
- [x] Gale-Shapley stable matching algorithm
- [x] Dijkstra's shortest path for referral finding
- [x] Prim's MST for pod formation
- [x] Connection strength calculation (roommate +4, shared internship +3, same major +2, same age +1)
- [x] Multithreading simulation with friend requests and chat

### ✅ UI Requirements (Step 5)
- [x] Load data from test cases (3 test cases available)
- [x] Visualize data as a graph with students and weighted edges
- [x] Visualize roommates within pods
- [x] Visualize referral path finder results
- [x] Visualize friend requests and chat history
- [x] Intuitive & friendly user interface with vibrant design

### ✅ Documentation
- [x] Comprehensive inline code documentation (JSDoc style)
- [x] README with setup instructions
- [x] Well-documented algorithms with complexity analysis
- [x] Type safety with TypeScript throughout

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

### Installation & Running

```bash
# Navigate to the React app directory
cd longhorn-network-react

# Install dependencies
npm install

# Start the development server
npm start
```

The app will automatically open in your browser at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
# Create optimized production build
npm run build

# The build folder will contain the production-ready app
# Serve it with any static file server
```

## 🎯 How to Use

### 1. Select a Test Case
- Click one of the three test case buttons at the top
- Each test case loads different student data with unique scenarios

### 2. Run Algorithms
- **Match Roommates**: Runs Gale-Shapley algorithm to pair students
- **Form Pods**: Uses Prim's algorithm to create study groups (size 3)
- **Run Social Sim**: Simulates concurrent friend requests and messages

### 3. Find Referral Paths
- Select a starting student from the dropdown
- Enter a target company name (e.g., "Google", "DummyCompany")
- Click "Find Path" to see the referral path visualization

### 4. Explore Different Views
- **Graph**: Interactive network visualization
- **Roommates**: View all roommate pairs
- **Pods**: See formed study groups
- **Referrals**: Explore referral paths
- **Social**: View friend lists and chat history

## 📁 Project Structure

```
longhorn-network-react/
├── src/
│   ├── models/
│   │   ├── Student.ts                 # Abstract student base class
│   │   ├── UniversityStudent.ts       # Concrete student implementation
│   │   └── StudentGraph.ts            # Graph data structure
│   ├── algorithms/
│   │   ├── GaleShapley.ts            # Roommate matching algorithm
│   │   ├── ReferralPathFinder.ts     # Dijkstra's pathfinding
│   │   └── PodFormation.ts           # Prim's pod formation
│   ├── utils/
│   │   ├── ThreadingSimulation.ts    # Async threading simulation
│   │   └── TestDataGenerator.ts      # Test case generation
│   ├── App.tsx                        # Main application component
│   ├── App.css                        # Beautiful styling
│   └── index.tsx                      # React entry point
└── package.json
```

## 🎨 Design Philosophy

### Color Palette
- **Burnt Orange** (#BF5700): Primary brand color (Texas Longhorns)
- **Cream/Ivory** (#F5F1E8, #FFFDF7): Warm backgrounds
- **Charcoal** (#2D2A26): Text and accents
- **White** (#FFFFFF): Cards and highlights

### Typography
- **Display Font**: Spectral (serif) - for headings and titles
- **Body Font**: Manrope (sans-serif) - for content and UI elements

### Animations
- Smooth page transitions (300ms)
- Staggered card appearances
- Pulsing connection indicators
- Animated graph nodes
- Hover micro-interactions

## 🧪 Test Cases

### Test Case 1: Two Groups
- 6 students in two groups
- Group 1: Alice, Bob, Charlie, Frank (Computer Science/Math/Chemistry)
- Group 2: Dana, Evan (Biology)
- Tests full mutual preferences and shared internships

### Test Case 2: Referral Path Test
- 3 Economics students: Greg, Helen, Ivy
- Ivy has "DummyCompany" internship
- Designed to test referral path finding

### Test Case 3: Unpaired Student
- 3 History students: Jack, Kim, Leo
- Jack and Kim have mutual preferences
- Leo has no preferences (remains unpaired)

## 🔧 Technical Details

### Algorithms Complexity

| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Gale-Shapley | O(n²) | O(n) |
| Dijkstra's | O((V + E) log V) | O(V) |
| Prim's MST | O(n * k * log k) | O(n) |
| Graph Construction | O(n²) | O(n + e) |

### Connection Strength Formula

```typescript
strength = 0
if (roommates) strength += 4
for (each shared internship) strength += 3
if (same major) strength += 2
if (same age) strength += 1
```

### Graph Representation
- **Structure**: Adjacency List (Map<Student, Edge[]>)
- **Edges**: Undirected with integer weights
- **Nodes**: UniversityStudent objects
- **Sparse**: Only non-zero connections stored

## 📚 Documentation Quality

Every file includes:
- **File-level documentation**: Purpose, responsibilities, algorithm details
- **Class documentation**: Design patterns, use cases, examples
- **Method documentation**:
  - Purpose and behavior
  - Parameters with types
  - Return values
  - Time/space complexity
  - Edge cases
  - Usage examples
- **Inline comments**: Complex logic explanations

## 🎓 Educational Value

This implementation demonstrates:
- **Graph Algorithms**: Practical applications of classic algorithms
- **Data Structures**: Efficient graph representation
- **TypeScript**: Advanced type safety and interfaces
- **React Patterns**: Modern hooks, state management, effects
- **Async Programming**: Promise-based concurrent operations
- **UI/UX Design**: Professional, accessible interfaces
- **Documentation**: Industry-standard code documentation

## 🐛 Known Limitations

- Canvas rendering may be slow with 100+ nodes (current max: 20 students per test)
- Thread simulation is single-threaded (true parallelism not possible in JavaScript)
- No persistent storage (state resets on page refresh)

## 🔮 Future Enhancements

Potential improvements:
- File upload for custom student data
- WebGL-based graph visualization for larger networks
- Real-time collaboration features
- Export results to PDF/CSV
- Advanced filtering and search
- Animated algorithm visualization (step-by-step)

## 📝 License

This project is part of ECE 422C coursework at UT Austin.

## 👥 Author

Built with ❤️ using React, TypeScript, and modern web technologies.

---

## 🎉 Acknowledgments

- **Texas Longhorns** for the color inspiration
- **Gale & Shapley** for the stable matching algorithm
- **Dijkstra** for the shortest path algorithm
- **Prim** for the minimum spanning tree algorithm

**Hook 'em Horns!** 🤘
