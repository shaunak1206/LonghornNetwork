# Longhorn Network

A social network simulation where students are matched with roommates and find referral paths for internships using graph algorithms.

## 🎥 Demo Video

**Watch the demo:** [https://www.loom.com/share/d82df7e8d8704199ae6844e77d66af31](https://www.loom.com/share/d82df7e8d8704199ae6844e77d66af31)

See the Longhorn Network in action with a complete walkthrough of all features!

---

## 📋 What This Project Does

- **Roommate Matching**: Uses Gale-Shapley algorithm to pair students
- **Referral Path Finding**: Uses Dijkstra's algorithm to find connections to internships
- **Study Pod Formation**: Uses Prim's algorithm to form student groups
- **Social Features**: Simulates friend requests and chat with multithreading

---

## ⚡ Quick Start

### Prerequisites
- **Java** (JDK 8 or higher) - [Download here](https://www.oracle.com/java/technologies/downloads/)
- **Node.js** (v14+) - Only needed for React app - [Download here](https://nodejs.org/)

### Option 1: Java Command Line (Automated Tests)

```bash
# Compile all Java files
javac -d . src/*.java

# Run automated test suite
java Main
```

**What it does:**
- Runs 3 test cases automatically
- Tests all algorithms (Gale-Shapley, Dijkstra's, Prim's)
- Displays scores and results

### Option 2: Java Swing UI (Graphical Interface)

```bash
# Compile (if not already done)
javac -d . src/*.java

# Launch the GUI
java LonghornNetworkUI
```

**Features:**
- Visualize student graph
- Match roommates
- Form study pods
- Find referral paths
- View student details

📖 **Detailed UI guide:** [UI_USAGE.md](./UI_USAGE.md)

### Option 3: React Web App (Modern Interface)

**Quick Start:**
```bash
cd longhorn-network-react
npm install
npm start
```

The app will open at `http://localhost:3000`

📖 **For detailed setup instructions, troubleshooting, and extra credit documentation, see the [Extra Credit Assignment](#-extra-credit-assignment-react-ui-implementation) section below.**

---

## 🎯 For Students

This is **ECE 422C Lab 4, 5, and 6**. 

**Need detailed instructions?** See [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for:
- Complete implementation requirements
- Step-by-step instructions
- Due dates and grading criteria
- Algorithm details and edge cases
- Testing guidelines

---

## 📝 Extra Credit Assignment: React UI Implementation

As discussed in class on Tuesday, 12/2, you can earn **1 extra point** to your overall grade by using React for your Longhorn Network Lab UI. Three conditions need to be met:

1. **Use React for Longhorn Network Lab UI**, with the same features and video as needed on your original assignment. Submit your video to the original assignment.

2. **Submit a .zip file** of your code alongside a README (txt or markdown) that documents step-by-step how to reproduce your React UI for the Longhorn Network Lab. This needs to work within the first try (i.e., needs to be documented near-perfectly with what OS was used, what libraries were used, what commands were used, etc.)

3. **Answer the following questions** in your README (see below).

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

The following libraries are installed via `npm install` (see `longhorn-network-react/package.json`):

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

## 📁 Project Structure

```
LonghornNetwork/
├── src/                    # Java source code
├── testing/                # Test input/output files
├── longhorn-network-react/ # React web application
├── README.md              # This file (quick start)
└── PROJECT_GUIDE.md       # Complete project instructions
```

---

## 📚 Documentation

- **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** - Complete project instructions, requirements, and implementation details
- **[UI_USAGE.md](./UI_USAGE.md)** - Detailed Swing UI usage guide
- **[React README](./longhorn-network-react/README.md)** - React app detailed documentation
- **[React Setup Guide](./longhorn-network-react/SETUP.md)** - Complete React troubleshooting guide
- **[React Build Guide](./longhorn-network-react/REACT_BUILD_GUIDE.md)** - Build from scratch instructions

---

## 💡 Quick Tips

1. **First time?** Start with `java Main` to see automated tests
2. **Want visuals?** Try `java LonghornNetworkUI` for the GUI
3. **Prefer web?** Use the React app for a modern interface
4. **Need help?** Check [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for detailed instructions

---

## 📝 License

This project is part of ECE 422C coursework at UT Austin.
