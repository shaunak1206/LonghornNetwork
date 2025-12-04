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

## ⚡ Quick Start

### Prerequisites
- **Java** (JDK 8 or higher) - [Download here](https://www.oracle.com/java/technologies/downloads/)
- **Node.js** (v14+) - Only needed for React app - [Download here](https://nodejs.org/)

---

## 🚀 How to Run

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

---

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

---

### Option 3: React Web App (Modern Interface)

**Prerequisites Check:**
First, verify you have Node.js installed:
```bash
node --version   # Should show v14.0.0 or higher
npm --version    # Should show v6.0.0 or higher
```

If not installed, download Node.js from [nodejs.org](https://nodejs.org/) (choose LTS version).

**Step-by-Step Instructions:**

1. **Navigate to the React app folder:**
   ```bash
   cd longhorn-network-react
   ```
   *(Make sure you're in the LonghornNetwork root directory first)*

2. **Install dependencies (first time only, takes 1-2 minutes):**
   ```bash
   npm install
   ```
   **Expected output:** `added 1333 packages in 25s` (or similar)
   
   **If you see errors:**
   - Make sure you're in the `longhorn-network-react` folder
   - Try: `npm cache clean --force` then `npm install` again

3. **Start the development server:**
   ```bash
   npm start
   ```
   **What happens:**
   - Compiles the app (takes 10-20 seconds)
   - Browser automatically opens to `http://localhost:3000`
   - You'll see "Compiled successfully!" in the terminal

4. **Using the app:**
   - Select a test case from the dropdown at the top
   - Click "Load Data" to load students
   - Use the sidebar tabs to explore different features
   - Click "Match Roommates" to run Gale-Shapley algorithm
   - Click "Form Pods" to create study groups

**Troubleshooting:**

- **Port 3000 already in use?**
  ```bash
  # Press Y when prompted, or use a different port:
  PORT=3001 npm start
  ```

- **Blank page or errors?**
  - Check browser console (F12) for errors
  - Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
  - Make sure you ran `npm install` first

- **Module not found errors?**
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**✅ Success Checklist:**
After running `npm start`, verify:
- [ ] Terminal shows "Compiled successfully!"
- [ ] Browser opens automatically to `http://localhost:3000`
- [ ] You see the Longhorn Network UI (sidebar on left, main area in center)
- [ ] Test Case dropdown appears at the top
- [ ] "Load Data" button is visible and clickable
- [ ] No red errors in browser console (press F12 to check)

**Quick Test:**
1. Select "Test Case 1" from dropdown
2. Click "Load Data" button
3. You should see a graph visualization with 6 students
4. If you see this, everything is working! 🎉

**If you see errors:** Check the troubleshooting section above or see [React Setup Guide](./longhorn-network-react/SETUP.md).

📖 **More help:**
- [React Quick Start](./longhorn-network-react/README.md) - Detailed usage guide
- [React Setup Guide](./longhorn-network-react/SETUP.md) - Complete troubleshooting
- [React Build Guide](./longhorn-network-react/REACT_BUILD_GUIDE.md) - Build from scratch

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
- **[React README](./longhorn-network-react/README.md)** - React app quick start
- **[React Build Guide](./longhorn-network-react/REACT_BUILD_GUIDE.md)** - Complete React build instructions

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

## 🤘 React Web Implementation

This project includes a complete React web implementation with:
- ✅ All core algorithms (Gale-Shapley, Dijkstra's, Prim's)
- ✅ Interactive graph visualization
- ✅ Multithreading simulation
- ✅ Modern Texas Longhorn-themed UI

See [React README](./longhorn-network-react/README.md) for details.

---

## 💡 Quick Tips

1. **First time?** Start with `java Main` to see automated tests
2. **Want visuals?** Try `java LonghornNetworkUI` for the GUI
3. **Prefer web?** Use the React app for a modern interface
4. **Need help?** Check [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for detailed instructions

---

## 📝 License

This project is part of ECE 422C coursework at UT Austin.
