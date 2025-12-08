# 🤘 Longhorn Network - React Implementation

A sophisticated, fully-functional React implementation of the Longhorn Network social networking platform for university students, featuring advanced graph algorithms, beautiful UI, and comprehensive documentation.

---

## 📝 Extra Credit Assignment Documentation

This document provides step-by-step instructions to reproduce the React UI for the Longhorn Network Lab, as required for the extra credit assignment.

### Step-by-Step Reproduction Instructions

#### Operating System Used
- **macOS** (Darwin 23.3.0)
- The instructions below are written for macOS/Linux. For Windows, use equivalent commands (e.g., `set` instead of `export` for environment variables).

#### Required Software & Versions

1. **Node.js** (v14.0.0 or higher)
   - Download from: https://nodejs.org/
   - Recommended: LTS (Long Term Support) version
   - Verify installation: `node --version`
   - Expected output: `v14.x.x` or higher

2. **npm** (v6.0.0 or higher)
   - Comes bundled with Node.js
   - Verify installation: `npm --version`
   - Expected output: `6.x.x` or higher

#### Libraries & Dependencies Used

The following libraries are installed via `npm install` (see `package.json`):

**Core Libraries:**
- `react` (^19.2.0) - React UI library
- `react-dom` (^19.2.0) - React DOM rendering
- `react-scripts` (5.0.1) - Create React App build tools
- `typescript` (^4.9.5) - TypeScript compiler

**Type Definitions:**
- `@types/react` (^19.2.7)
- `@types/react-dom` (^19.2.3)
- `@types/node` (^16.18.126)
- `@types/jest` (^27.5.2)

**Testing Libraries:**
- `@testing-library/react` (^16.3.0)
- `@testing-library/jest-dom` (^6.9.1)
- `@testing-library/user-event` (^13.5.0)
- `@testing-library/dom` (^10.4.1)

**Other:**
- `web-vitals` (^2.1.4) - Web performance metrics

#### Step-by-Step Commands

**Step 1: Extract the Zip File**

```bash
# Navigate to where you downloaded the zip file
cd ~/Downloads  # or wherever you saved the zip file

# Extract the zip file
# macOS/Linux:
unzip LonghornNetwork.zip

# Windows: Right-click the zip file and select "Extract All"
# Or use PowerShell:
Expand-Archive -Path LonghornNetwork.zip -DestinationPath .
```

**Expected Result:**
- A folder named `LonghornNetwork` is created
- This folder contains the project files including the `longhorn-network-react` subdirectory

**Directory Structure After Extraction:**
```
LonghornNetwork/
├── longhorn-network-react/    ← This is where the React app is
│   ├── package.json
│   ├── src/
│   └── ...
├── src/                        ← Java source code
└── ...
```

**Step 2: Navigate to the React App Directory**

```bash
# Navigate into the extracted project folder
cd LonghornNetwork

# Navigate into the React app subdirectory
cd longhorn-network-react
```

**Note:** If you extracted to a different location, adjust the path accordingly. For example:
- If extracted to Desktop: `cd ~/Desktop/LonghornNetwork/longhorn-network-react`
- If extracted to Documents: `cd ~/Documents/LonghornNetwork/longhorn-network-react` (macOS/Linux)
- If extracted to Documents: `cd C:\Users\YourUsername\Documents\LonghornNetwork\longhorn-network-react` (Windows)

**Verify you're in the right place:**
```bash
# You should see package.json in the current directory
ls package.json  # macOS/Linux
dir package.json  # Windows (Command Prompt)
Get-ChildItem package.json  # Windows (PowerShell)

# You should also see these directories:
# - src/
# - public/
# - node_modules/ (after Step 3)
```

**Step 3: Install Dependencies**

```bash
npm install
```

**Expected Output:**
```
added 1333 packages in 25s
```

**Time Required:** 1-3 minutes (depending on internet speed)

**If you encounter errors:**
- Ensure you're in the `longhorn-network-react` directory (check with `pwd` on macOS/Linux or `cd` on Windows)
- Verify `package.json` exists in the current directory
- Try: `npm cache clean --force` then `npm install` again
- On Windows, you may need to run as Administrator
- If the `longhorn-network-react` folder doesn't exist, make sure you extracted the entire zip file

**Step 4: Start the Development Server**

```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view longhorn-network-react in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

**What Happens:**
1. TypeScript files are compiled (10-20 seconds)
2. JavaScript and CSS are bundled
3. Development server starts on port 3000
4. Browser automatically opens to `http://localhost:3000`

**Step 5: Verify the Application Works**

1. **Browser opens automatically** to `http://localhost:3000`
2. **You should see:**
   - Longhorn Network UI with sidebar on the left
   - Test Case dropdown at the top
   - "Load Data" button
   - Graph visualization area in the center
3. **Quick Test:**
   - Select "Test Case 1" from dropdown
   - Click "Load Data"
   - You should see a graph with 6 students
   - If this works, the setup is successful! ✅

**Troubleshooting Common Issues:**

**Issue: Port 3000 already in use**
```bash
# macOS/Linux
PORT=3001 npm start

# Windows (PowerShell)
$env:PORT=3001; npm start

# Windows (Command Prompt)
set PORT=3001 && npm start
```

**Issue: Module not found errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue: Blank page or compilation errors**
- Check browser console (F12) for errors
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Ensure `npm install` completed successfully

**Issue: TypeScript errors**
```bash
# Clear cache and rebuild
rm -rf node_modules/.cache
npm start
```

#### Verification Checklist

After following the steps above, verify:
- [ ] Terminal shows "Compiled successfully!"
- [ ] Browser opens to `http://localhost:3000`
- [ ] UI displays with sidebar and main content area
- [ ] Test Case dropdown is visible
- [ ] "Load Data" button works
- [ ] Graph visualization displays students
- [ ] No errors in browser console (F12)

#### Additional Commands

**Build for Production:**
```bash
npm run build
```
Creates optimized production build in `build/` folder.

**Run Tests:**
```bash
npm test
```

**Type Check (without building):**
```bash
npx tsc --noEmit
```

---

### Required Questions

#### a. Did you use AI to code the UI? If so, what were the sources that the AI used, what was the AI good at and what was it not so good at? What did you do to fill in the gaps?

**Answer:** Yes, I used AI (specifically Cursor AI and ChatGPT) to assist with coding the React UI. 

**Sources the AI used:**
- The existing Java codebase (Student.java, StudentGraph.java, GaleShapley.java, etc.)
- React and TypeScript documentation patterns
- Common React patterns and best practices from the AI's training data

**What the AI was good at:**
1. **Code structure and organization**: The AI excelled at creating a well-organized file structure with proper separation of concerns (models, algorithms, utils, components)
2. **TypeScript type definitions**: Generated comprehensive type definitions that matched the Java classes, ensuring type safety
3. **React component structure**: Created functional components with hooks following modern React patterns
4. **Basic styling**: Generated CSS with a cohesive color scheme and layout

**What the AI was not so good at:**
1. **Graph visualization**: The initial canvas-based graph rendering was basic and didn't handle edge cases well (overlapping nodes, edge routing, etc.). The AI struggled with the complex math for node positioning and edge drawing.
2. **State management complexity**: When managing multiple interdependent states (selected test case, algorithm results, active view), the AI sometimes created overly complex state structures that needed simplification.
3. **UI/UX polish**: The initial UI was functional but lacked the professional polish - animations, transitions, and micro-interactions needed manual refinement.
4. **Error handling**: The AI didn't always include comprehensive error handling for edge cases (empty graphs, invalid inputs, etc.).
5. **Performance optimization**: Initial implementations didn't consider performance for larger datasets or re-render optimization.

**What I did to fill in the gaps:**
1. **Graph visualization improvements**: I manually refined the canvas rendering code to:
   - Implement force-directed layout algorithm for better node positioning
   - Add edge routing to avoid overlapping with nodes
   - Implement zoom and pan functionality
   - Add visual feedback for hover states and selections
2. **State management refactoring**: I simplified the state structure by:
   - Consolidating related states into objects
   - Using useReducer for complex state logic
   - Implementing proper memoization with useMemo and useCallback
3. **UI/UX enhancements**: I added:
   - Smooth CSS transitions and animations
   - Loading states and visual feedback
   - Better color contrast and accessibility
   - Responsive design improvements
4. **Error handling**: I added:
   - Input validation
   - Try-catch blocks around algorithm calls
   - User-friendly error messages
   - Graceful degradation for edge cases
5. **Testing and debugging**: I manually tested all features, fixed bugs the AI missed, and optimized performance bottlenecks.

#### b. If you did not use AI, what sources did you use to learn React, and what were the hardest things to learn?

**Answer:** N/A - I used AI assistance as described above.

#### c. We are planning to cover React next semester for this class, in what unit do you think this would be appropriate to teach?

**Answer:** Based on the course schedule, I think React would be most appropriate to teach in **Week 15 (Advanced Topics)** or as a **follow-up unit after Week 13**. Here's my reasoning:

**Prerequisites from the Course Schedule:**

1. **Weeks 1-4**: Core Java fundamentals (objects, classes, inheritance, polymorphism, exceptions)
   - Essential foundation for understanding programming concepts
   - Students need OOP knowledge before component-based thinking

2. **Weeks 5-7**: Generics, Collections (JCF), Linked Lists, Hash Tables
   - Understanding data structures helps with React state management
   - Collections knowledge translates to working with arrays/objects in React

3. **Week 8-9**: Networking & Multithreading
   - Multithreading concepts help understand async operations in React
   - Networking knowledge useful for future API integration

4. **Week 10**: Swing (Java UI framework)
   - **Critical prerequisite**: Students learn UI concepts, event handling, and component-based design
   - Perfect comparison point: Swing vs React component models
   - Students understand the UI requirements of the Longhorn Network lab

5. **Week 13**: Graphs (BFS/DFS, shortest paths, MSTs)
   - **Essential prerequisite**: Students learn the graph algorithms used in Longhorn Network
   - Gale-Shapley, Dijkstra's, and Prim's algorithms are covered
   - Students understand the problem domain before implementing in React

**Recommended Placement: Week 15 (Advanced Topics)**

**Why Week 15 is ideal:**
- Students have completed all prerequisites:
  - ✅ Java fundamentals (Weeks 1-4)
  - ✅ Data structures (Weeks 5-7)
  - ✅ UI concepts via Swing (Week 10)
  - ✅ Graph algorithms (Week 13)
  - ✅ Multithreading (Weeks 8-9)
- Natural fit for "Advanced Topics" alongside Design Patterns, Parallel Streams, etc.
- Students have already completed the Longhorn Network lab in Java, so they understand the problem domain
- Perfect timing for extra credit assignment (as mentioned on Tuesday, 12/2)
- Allows students to compare imperative (Java/Swing) vs declarative (React) programming paradigms

**Suggested React Curriculum (Week 15):**

- **Tuesday (Advanced Topics - React Part 1)**: 
  - Introduction to React and modern web development
  - JSX syntax, components, props
  - Comparison with Swing: component-based architecture similarities/differences
  - Setting up React development environment

- **Thursday (Final Review - React Part 2)**:
  - State management (useState, useEffect)
  - Event handling and forms
  - Component composition and lifting state
  - TypeScript basics (if time permits)
  - Converting Longhorn Network: translating Java algorithms to React

**Alternative Placement: After Week 13 (if extending course)**

If the course could be extended or React replaces another topic, teaching React **immediately after Week 13** would also work well:
- Students just learned graph algorithms, so the concepts are fresh
- They can immediately apply Dijkstra's, Prim's, and graph traversal in React
- More time for a comprehensive React project
- Could span Weeks 14-15 (though Week 14 is Thanksgiving break)

**Benefits of Week 15 Timing:**
1. **Complete prerequisite knowledge**: All foundational concepts covered
2. **Natural comparison**: Students can directly compare Swing UI vs React UI implementations
3. **Algorithm understanding**: Students know the algorithms before translating to React
4. **Meaningful project**: Converting Longhorn Network demonstrates full understanding
5. **Modern relevance**: React is industry-standard, valuable for students' careers
6. **Extra credit opportunity**: Aligns with when the extra credit was announced

**Implementation Suggestion:**
Week 15 could offer React as one of several "Advanced Topics" options:
- Option A: Design Patterns in Java
- Option B: React & Modern Web Development
- Option C: Parallel Streams & Functional Programming
- Option D: Garbage Collection & JVM Internals

This gives students choice while ensuring React is available for those interested in modern web development.

---

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


