# Longhorn Network UI - Usage Guide

## Running the UI

To launch the Swing UI application, run:

```bash
java LonghornNetworkUI
```

Or compile and run:

```bash
javac -d . src/*.java
java LonghornNetworkUI
```

## Features

### 1. Loading Data (20 points)
- Use the **Test Case** dropdown to select Test Case 1, 2, or 3
- Click **Load Data** to load the selected test case
- The output log will show confirmation of data loading

### 2. Student Graph Visualization (30 points)
- Navigate to the **Student Graph** tab
- The graph displays:
  - Students as circular nodes with their names
  - Connections as colored edges between students
  - Edge weights (connection strengths) displayed on each edge
  - Color intensity indicates connection strength (darker = stronger)

### 3. Roommate Visualization (15 points)
- Navigate to the **Roommates** tab
- Click **Match Roommates** button in the control panel
- View all roommate pairings with their preferences
- Unpaired students are also displayed

### 4. Pod Formation Visualization (15 points)
- Navigate to the **Pod Formation** tab
- Set the desired pod size using the spinner (2-10)
- Click **Form Pods** button
- View all formed pods with student names listed

### 5. Referral Path Finder (15 points)
- Navigate to the **Referral Paths** tab
- Select a starting student from the dropdown
- Enter a target company name in the text field
- Click **Find Path** button
- View the referral path from start to a student with the target internship
- Path shows step-by-step connections

### 6. Student Details - Friends & Chat History (10 points)
- Navigate to the **Student Details** tab
- Select a student from the dropdown
- View:
  - Basic information (age, gender, year, major, GPA)
  - Current roommate (or "None")
  - List of friends (or "None")
  - Chat history with all other students (or "None")

### 7. Intuitive & Friendly UI (10 points)
- **Colorful interface** with distinct colors for different actions
- **Tabbed interface** for easy navigation
- **Control panel** at the top with all main actions
- **Output log** at the bottom showing all operations
- **Refresh button** to update all visualizations
- **Clear labels** and organized layout

## Controls

- **Load Data**: Loads the selected test case
- **Match Roommates**: Runs Gale-Shapley algorithm to assign roommates
- **Form Pods**: Forms pods using Prim's algorithm (uses default size 3)
- **Refresh All**: Updates all visualizations with current data

## Tips

1. Always **Load Data** first before running any algorithms
2. Run **Match Roommates** before viewing roommate assignments
3. Use **Form Pods** in the Pod Formation tab to see pod visualizations
4. The graph visualization automatically updates when data is loaded
5. Student details update when you select different students

## Video Script Points Covered

✅ Loading data from Main.java - Test cases can be loaded and displayed  
✅ Visualize data as a graph - Interactive graph with nodes and weighted edges  
✅ Visualize roommates - Complete roommate pairing display  
✅ Visualize referral path finder - Path visualization with step-by-step display  
✅ Visualize friend requests and chat history - Complete student details panel  
✅ Intuitive & Friendly UI - Colorful, organized, easy-to-use interface  

