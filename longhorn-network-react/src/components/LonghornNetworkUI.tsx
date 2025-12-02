/**
 * LonghornNetworkUI.tsx
 *
 * Main UI component for the Longhorn Network social graph analytics application.
 * Provides a comprehensive interface for visualizing and analyzing student social networks.
 *
 * ============================================================================
 * ARCHITECTURE OVERVIEW
 * ============================================================================
 *
 * Layout Structure (3-column design, fits in 100vh):
 * ┌─────────────┬──────────────────────────────┬──────────────────┐
 * │   Sidebar   │        Main Content          │  Activity Log    │
 * │   (280px)   │       (flex: 1)              │  (50px/380px)    │
 * │             │                              │  (expandable)    │
 * │  - Logo     │  - Toolbar (fixed height)    │                  │
 * │  - Nav      │  - Content Area (scrollable) │  - Toggle Button │
 * │  - Quick    │    • Student Graph           │  - Log Entries   │
 * │    Start    │    • Roommate Matching       │    (scrollable)  │
 * │             │    • Pod Formation           │                  │
 * │             │    • Referral Paths          │                  │
 * │             │    • Student Details         │                  │
 * └─────────────┴──────────────────────────────┴──────────────────┘
 *
 * ============================================================================
 * KEY FEATURES
 * ============================================================================
 *
 * 1. **Student Graph Visualization** (Canvas-based)
 *    - Circular node layout using polar coordinates
 *    - Color-coded edges by connection strength (cyan/green/amber/gray)
 *    - Interactive legend showing connection strengths
 *    - Names rendered inside circles (white text, 11px bold)
 *    - Weights displayed in colored circles at line midpoints
 *
 * 2. **Roommate Matching** (Gale-Shapley Algorithm)
 *    - Stable matching based on preferences
 *    - Displays matched pairs with preference lists
 *    - Shows unmatched students
 *
 * 3. **Pod Formation** (Graph-based Grouping)
 *    - Forms study groups of configurable size
 *    - Uses connection strength to create cohesive groups
 *    - Displays all pods with member lists
 *
 * 4. **Referral Path Finder** (BFS Algorithm)
 *    - Finds shortest path to company via social network
 *    - Validates company exists in internship data
 *    - Shows step-by-step referral chain
 *
 * 5. **Student Details & Social Interactions**
 *    - View student profiles (age, major, GPA, etc.)
 *    - Send friend requests (bidirectional)
 *    - Send chat messages (bidirectional history)
 *    - Test concurrent social interactions with ThreadPool
 *
 * ============================================================================
 * STATE MANAGEMENT
 * ============================================================================
 *
 * Core State:
 * - currentStudents: Array of UniversityStudent objects
 * - currentGraph: StudentGraph instance (adjacency list representation)
 * - activeTab: Which feature is currently displayed
 * - logExpanded: Whether activity log sidebar is expanded
 *
 * Feature-Specific State:
 * - roommateData, podData, referralData: Formatted output strings
 * - detailStudent: Selected student for profile view
 * - testCase: Which test data set is loaded (1-3)
 *
 * UI State:
 * - tooltip: Hover tooltips with position
 * - outputLog: Activity log messages with timestamps
 *
 * ============================================================================
 * GRAPH VISUALIZATION ALGORITHM
 * ============================================================================
 *
 * Node Positioning (Circular Layout):
 * 1. Calculate center point of canvas
 * 2. Determine radius (32% of min(width, height))
 * 3. Distribute nodes evenly around circle using:
 *    - angle = (index * 2π / nodeCount) - π/2
 *    - x = centerX + radius * cos(angle)
 *    - y = centerY + radius * sin(angle)
 *
 * Rendering Order:
 * 1. Draw edges first (to appear behind nodes)
 *    - Use consistent ordering to avoid duplicates
 *    - Color by weight: ≥8 cyan, ≥5 green, ≥3 amber, <3 gray
 *    - Draw weight in colored circle at exact midpoint
 * 2. Draw nodes second
 *    - Outer shadow (8px blur)
 *    - Dark circle (#334155, 28px radius)
 *    - Inner circle (#475569, 24px radius)
 *    - Cyan border ring (3px stroke)
 *    - Name text centered inside (white, 11px)
 *
 * ============================================================================
 * DESIGN SYSTEM (Texas Sunset Theme)
 * ============================================================================
 *
 * Colors:
 * - Primary: Burnt Orange (#BF5700) - UT Austin brand color
 * - Accents: Sunset gradients (#F97316, #FB923C, #EA580C)
 * - Sidebar: Dark slate (#0F172A) with orange highlights
 * - Background: Warm gradient (#FFF7ED → #FFEDD5 → #FED7AA)
 *
 * Typography:
 * - Display: 'Sora' - Used for headings and emphasis
 * - Body: 'Plus Jakarta Sans' - Used for content
 * - Monospace: 'SF Mono' / 'Monaco' - Used for output areas
 *
 * Spacing: 8px base unit (--spacing-unit)
 *
 * ============================================================================
 * THREADING SIMULATION
 * ============================================================================
 *
 * Uses JavaScript Promises to simulate concurrent operations:
 * - FriendRequestThread: Async friend request handling
 * - ChatThread: Async message sending
 * - ThreadPool: Manages concurrent operations with Promise.all
 * - Thread-safe via consistent alphabetical ordering (prevents deadlocks)
 *
 * ============================================================================
 * RESPONSIVE DESIGN
 * ============================================================================
 *
 * Breakpoints:
 * - Desktop (default): 3-column layout, 100vh height
 * - Tablet (≤1024px): Sidebar on top, 2-column below
 * - Mobile (≤768px): Single column, reduced padding
 *
 * @author LonghornNetwork Team
 * @version 2.0 - React TypeScript Implementation
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UniversityStudent } from '../models/UniversityStudent';
import { StudentGraph } from '../models/StudentGraph';
import { GaleShapley } from '../algorithms/GaleShapley';
import { PodFormation } from '../algorithms/PodFormation';
import { ReferralPathFinder } from '../algorithms/ReferralPathFinder';
import { TestDataGenerator } from '../utils/TestDataGenerator';
import { FriendRequestThread, ChatThread, ThreadPool } from '../utils/ThreadingSimulation';
import './LonghornNetworkUI.css';

/** Valid tab types for navigation */
type TabType = 'graph' | 'roommates' | 'pods' | 'referrals' | 'details';

/** Position of a node on the canvas */
interface GraphPosition {
  x: number;
  y: number;
}

/** State for tooltip positioning and visibility */
interface TooltipState {
  show: boolean;
  content: string;
  x: number;
  y: number;
}

/**
 * Main UI Component
 *
 * This is a functional React component that manages all state and rendering
 * for the Longhorn Network application. It uses React hooks extensively:
 * - useState: For all state management
 * - useRef: For canvas reference
 * - useEffect: For canvas rendering when graph changes
 * - useCallback: For memoized event handlers
 */
export const LonghornNetworkUI: React.FC = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /** Core application state */
  const [currentStudents, setCurrentStudents] = useState<UniversityStudent[]>([]);
  const [currentGraph, setCurrentGraph] = useState<StudentGraph | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('graph');
  const [testCase, setTestCase] = useState<number>(1);
  const [outputLog, setOutputLog] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState>({ show: false, content: '', x: 0, y: 0 });
  const [logExpanded, setLogExpanded] = useState<boolean>(false);

  /** Roommate matching feature state */
  const [roommateData, setRoommateData] = useState<string>('');

  /** Pod formation feature state */
  const [podSize, setPodSize] = useState<number>(3);
  const [podData, setPodData] = useState<string>('');

  /** Referral path finder feature state */
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [targetCompany, setTargetCompany] = useState<string>('');
  const [referralData, setReferralData] = useState<string>('');

  /** Student details feature state */
  const [detailStudent, setDetailStudent] = useState<string>('');
  const [friendTarget, setFriendTarget] = useState<string>('');
  const [chatTarget, setChatTarget] = useState<string>('');
  const [chatMessage, setChatMessage] = useState<string>('');
  const [detailData, setDetailData] = useState<string>('');

  /** Canvas ref for graph visualization - used to access canvas element for 2D rendering */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Adds a timestamped message to the activity log
   * @param message - The message to log
   * @param type - Type of message (info, success, or error) - determines icon
   */
  const addLog = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : '→';
    setOutputLog(prev => [...prev, `${prefix} ${timestamp} - ${message}`]);
  }, []);

  /**
   * Shows a tooltip above the hovered element
   * @param content - Tooltip text to display
   * @param event - Mouse event to get position from
   */
  const showTooltip = (content: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setTooltip({
      show: true,
      content,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  /** Hides the currently displayed tooltip */
  const hideTooltip = () => {
    setTooltip({ ...tooltip, show: false });
  };

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  /**
   * Loads test case data and initializes the graph
   *
   * Process:
   * 1. Generate students from TestDataGenerator
   * 2. Create StudentGraph from students
   * 3. Initialize all dropdowns with first/second students
   * 4. Clear previous feature data
   * 5. Log success message
   */
  const loadTestData = () => {
    try {
      const students = TestDataGenerator.generateTestCase(testCase);
      setCurrentStudents(students);
      const graph = new StudentGraph(students);
      setCurrentGraph(graph);

      // Update selectors
      if (students.length > 0) {
        setSelectedStudent(students[0].getName());
        setDetailStudent(students[0].getName());
        if (students.length > 1) {
          setFriendTarget(students[1].getName());
          setChatTarget(students[1].getName());
        }
      }

      addLog(`Loaded Test Case ${testCase} with ${students.length} students`, 'success');
      addLog(`Graph created with ${graph.getEdgeCount() / 2} connections`);

      // Clear previous data
      setRoommateData('');
      setPodData('');
      setReferralData('');
      updateStudentDetails(students[0]);
    } catch (error) {
      addLog(`Error loading data: ${error}`, 'error');
    }
  };

  // ============================================================================
  // FEATURE IMPLEMENTATIONS
  // ============================================================================

  /**
   * Runs the Gale-Shapley roommate matching algorithm
   *
   * Algorithm: Stable matching where students propose to preferred roommates
   * - Each student has a preference list
   * - Algorithm ensures no two students would prefer each other over current matches
   * - Results in stable pairings (no blocking pairs)
   *
   * Output: Displays matched pairs with their preference lists
   */
  const runRoommateMatching = () => {
    if (!currentStudents.length) {
      addLog('Please load data first!', 'error');
      return;
    }

    addLog('Running Gale-Shapley roommate matching algorithm...');
    GaleShapley.assignRoommates(currentStudents);

    // Rebuild graph
    const graph = new StudentGraph(currentStudents);
    setCurrentGraph(graph);

    // Generate roommate display text and log matches
    let text = '=== Roommate Assignments ===\n\n';
    const processed = new Set<UniversityStudent>();
    let pairCount = 0;
    const matches: string[] = [];

    for (const student of currentStudents) {
      if (!processed.has(student)) {
        const roommate = student.getRoommate();
        if (roommate && !processed.has(roommate)) {
          pairCount++;
          const match = `${student.getName()} ↔ ${roommate.getName()}`;
          matches.push(match);
          text += `Pair ${pairCount}:\n`;
          text += `  ${student.getName()} <-> ${roommate.getName()}\n`;
          text += `  ${student.getName()} preferences: ${student.getRoommatePreferences().join(', ')}\n`;
          text += `  ${roommate.getName()} preferences: ${roommate.getRoommatePreferences().join(', ')}\n\n`;
          processed.add(student);
          processed.add(roommate);
        } else if (!roommate && student.getRoommatePreferences().length > 0) {
          text += `Unpaired: ${student.getName()} (has preferences but no match)\n\n`;
          processed.add(student);
        }
      }
    }

    setRoommateData(text);
    addLog(`Roommate matching completed: ${pairCount} pairs formed`, 'success');
    matches.forEach(match => addLog(`  ${match}`));
  };

  /**
   * Forms study pods of specified size
   *
   * Algorithm: Groups students based on connection strength
   * - Uses graph connectivity to form cohesive groups
   * - Attempts to maximize within-group connections
   * - Size is configurable (default: 3)
   *
   * Output: Displays all formed pods with member lists
   */
  const runPodFormation = () => {
    if (!currentGraph) {
      addLog('Please load data first!', 'error');
      return;
    }

    addLog(`Forming pods of size ${podSize}...`);
    const podFormation = new PodFormation(currentGraph);
    podFormation.formPods(podSize);

    let text = `=== Pod Formation (Size: ${podSize}) ===\n\n`;
    const pods = podFormation.getPods();

    pods.forEach((pod, i) => {
      text += `Pod ${i + 1}:\n`;
      text += `  ${pod.map(s => s.getName()).join(', ')}\n\n`;
    });

    setPodData(text);
    addLog(`Pod formation completed: ${pods.length} pods created`, 'success');
    pods.forEach((pod, i) => {
      addLog(`  Pod ${i + 1}: ${pod.map(s => s.getName()).join(', ')}`);
    });
  };

  /**
   * Finds referral path from selected student to target company
   *
   * Algorithm: Breadth-First Search (BFS) through social network
   * - Starts from selected student
   * - Explores friends level by level
   * - Stops when finding someone who interned at target company
   * - Returns shortest path (minimum number of referrals needed)
   *
   * Validation:
   * - Checks if company exists in any student's internship list
   * - Shows available companies if target not found
   *
   * Output: Step-by-step referral chain with arrows
   */
  const findReferralPath = () => {
    if (!currentGraph || !currentStudents.length) {
      addLog('Please load data first!', 'error');
      return;
    }

    if (!selectedStudent || !targetCompany) {
      addLog('Please select a student and enter a company name!', 'error');
      return;
    }

    const start = currentStudents.find(s => s.getName() === selectedStudent);
    if (!start) {
      addLog('Student not found!', 'error');
      return;
    }

    addLog(`Searching for referral path from ${selectedStudent} to ${targetCompany}...`);

    // Check if company exists
    const companyExists = currentStudents.some(s =>
      s.getPreviousInternships().some(intern => intern === targetCompany)
    );

    if (!companyExists) {
      let text = `=== Referral Path to ${targetCompany} ===\n\n`;
      text += `Starting from: ${start.getName()}\n\n`;
      text += `ERROR: No student in the current test case has interned at "${targetCompany}".\n\n`;
      text += 'Available internships in current test case:\n';

      const allInternships = new Set<string>();
      currentStudents.forEach(s => {
        s.getPreviousInternships().forEach(intern => {
          if (intern !== 'None' && intern !== '') {
            allInternships.add(intern);
          }
        });
      });

      if (allInternships.size === 0) {
        text += '  (None)\n';
      } else {
        allInternships.forEach(intern => {
          text += `  - ${intern}\n`;
        });
      }

      setReferralData(text);
      addLog(`Company "${targetCompany}" not found in current test case`, 'error');
      return;
    }

    const pathFinder = new ReferralPathFinder(currentGraph);
    const path = pathFinder.findReferralPath(start, targetCompany);

    let text = `=== Referral Path to ${targetCompany} ===\n\n`;
    text += `Starting from: ${start.getName()}\n\n`;

    if (path.length === 0) {
      text += `No path found to a student who interned at ${targetCompany}.\n`;
      addLog(`No path found to ${targetCompany}`, 'error');
    } else {
      text += `Path found (${path.length} students):\n\n`;
      path.forEach((student, i) => {
        text += `${i + 1}. ${student.getName()}`;
        if (student.getPreviousInternships().includes(targetCompany)) {
          text += ` ✓ (has internship at ${targetCompany})`;
        }
        text += '\n';
        if (i < path.length - 1) {
          text += '   ↓\n';
        }
      });
      addLog(`Referral path found: ${path.length} hops to ${targetCompany}`, 'success');
      addLog(`  Path: ${path.map(s => s.getName()).join(' → ')}`);
    }

    setReferralData(text);
  };

  /**
   * Updates the student details display panel
   *
   * Shows:
   * - Basic info (age, gender, year, major, GPA)
   * - Current roommate
   * - Friend list
   * - Chat history with all other students
   *
   * @param student - The student to display details for
   */
  const updateStudentDetails = useCallback((student: UniversityStudent | undefined) => {
    if (!student) return;

    let text = `=== Student Details: ${student.getName()} ===\n\n`;
    text += 'Basic Information:\n';
    text += `  Age: ${student.getAge()}\n`;
    text += `  Gender: ${student.getGender()}\n`;
    text += `  Year: ${student.getYear()}\n`;
    text += `  Major: ${student.getMajor()}\n`;
    text += `  GPA: ${student.getGpa()}\n\n`;

    const roommate = student.getRoommate();
    text += 'Roommate: ';
    text += roommate ? `${roommate.getName()}\n\n` : 'None\n\n';

    const friends = student.getFriends();
    text += `Friends (${friends.length}):\n`;
    if (friends.length === 0) {
      text += '  None\n\n';
    } else {
      friends.forEach(friend => {
        text += `  - ${friend.getName()}\n`;
      });
      text += '\n';
    }

    text += 'Chat History:\n';
    let hasChatHistory = false;
    currentStudents.forEach(other => {
      if (other.getName() === student.getName()) return;
      const messages = student.getChatHistory(other);
      if (messages && messages.length > 0) {
        hasChatHistory = true;
        text += `  With ${other.getName()}:\n`;
        messages.forEach(msg => {
          text += `    - ${msg}\n`;
        });
      }
    });

    if (!hasChatHistory) {
      text += '  None\n';
    }

    setDetailData(text);
  }, [currentStudents]);

  /**
   * Effect: Updates student details whenever selected student changes
   */
  useEffect(() => {
    const student = currentStudents.find(s => s.getName() === detailStudent);
    if (student) {
      updateStudentDetails(student);
    }
  }, [detailStudent, currentStudents, updateStudentDetails]);

  // ============================================================================
  // SOCIAL INTERACTION FEATURES
  // ============================================================================

  /**
   * Sends a bidirectional friend request between two students
   *
   * Threading: Uses FriendRequestThread to simulate async operation
   * - Adds both students to each other's friend lists
   * - Thread-safe via alphabetical ordering
   *
   * Updates: Refreshes student details to show new friend
   */
  const sendFriendRequest = async () => {
    if (!currentStudents.length) {
      addLog('Please load data first!', 'error');
      return;
    }

    const sender = currentStudents.find(s => s.getName() === detailStudent);
    const receiver = currentStudents.find(s => s.getName() === friendTarget);

    if (!sender || !receiver) {
      addLog('Student not found!', 'error');
      return;
    }

    if (sender.getName() === receiver.getName()) {
      addLog('Cannot send friend request to yourself!', 'error');
      return;
    }

    const logs: string[] = [];
    const thread = new FriendRequestThread(sender, receiver, logs);
    await thread.run();
    addLog(`${sender.getName()} sent friend request to ${receiver.getName()}`, 'success');
    updateStudentDetails(sender);
  };

  /**
   * Sends a chat message between two students
   *
   * Threading: Uses ChatThread to simulate async operation
   * - Adds message to both students' chat histories
   * - Bidirectional history (both see the message)
   * - Thread-safe via alphabetical ordering
   *
   * Updates: Refreshes student details to show new message
   */
  const sendMessage = async () => {
    if (!currentStudents.length) {
      addLog('Please load data first!', 'error');
      return;
    }

    if (!chatMessage.trim()) {
      addLog('Please enter a message!', 'error');
      return;
    }

    const sender = currentStudents.find(s => s.getName() === detailStudent);
    const receiver = currentStudents.find(s => s.getName() === chatTarget);

    if (!sender || !receiver) {
      addLog('Student not found!', 'error');
      return;
    }

    if (sender.getName() === receiver.getName()) {
      addLog('Cannot send message to yourself!', 'error');
      return;
    }

    const logs: string[] = [];
    const thread = new ChatThread(sender, receiver, chatMessage, logs);
    await thread.run();
    addLog(`${sender.getName()} → ${receiver.getName()}: "${chatMessage}"`, 'success');
    setChatMessage('');
    updateStudentDetails(sender);
  };

  /**
   * Tests concurrent social interactions using ThreadPool
   *
   * Simulates:
   * - Multiple friend requests happening simultaneously
   * - Multiple chat messages being sent concurrently
   * - Uses ThreadPool to manage Promise.all execution
   *
   * Demonstrates thread-safe concurrent operations without race conditions
   */
  const testSocialInteractions = async () => {
    if (!currentStudents.length) {
      addLog('Please load data first!', 'error');
      return;
    }

    if (currentStudents.length < 2) {
      addLog('Need at least 2 students for social interactions!', 'error');
      return;
    }

    const s1 = currentStudents[0];
    const s2 = currentStudents[1];

    addLog('Running concurrent social interaction test...');
    const pool = new ThreadPool();
    pool.submitFriendRequest(s1, s2);
    pool.submitChat(s1, s2, 'Hello there!');
    pool.submitFriendRequest(s2, s1);
    pool.submitChat(s2, s1, 'Hi back!');

    await pool.awaitCompletion();

    addLog('Social interaction test completed', 'success');
    addLog(`  ${s1.getName()} ↔ ${s2.getName()} are now friends`);
    addLog(`  2 messages exchanged`);

    const student = currentStudents.find(s => s.getName() === detailStudent);
    if (student) {
      updateStudentDetails(student);
    }
  };

  // ============================================================================
  // GRAPH VISUALIZATION (Canvas Rendering)
  // ============================================================================

  /**
   * Effect: Renders the student graph on canvas whenever graph or tab changes
   *
   * RENDERING ALGORITHM:
   *
   * 1. Setup:
   *    - Get canvas 2D context
   *    - Set canvas size with devicePixelRatio for crisp rendering
   *    - Clear previous frame
   *
   * 2. Calculate Node Positions (Circular Layout):
   *    - centerX = canvas.width / 2
   *    - centerY = canvas.height / 2
   *    - radius = min(width, height) * 0.32
   *    - For each node i:
   *      * angle = (i * 2π / nodeCount) - π/2
   *      * x = centerX + radius * cos(angle)
   *      * y = centerY + radius * sin(angle)
   *
   * 3. Draw Edges (bottom layer):
   *    - Iterate through all edges (avoid duplicates with Set)
   *    - Color by weight:
   *      * ≥8: Cyan (#06B6D4) - Strong connection
   *      * ≥5: Green (#10B981) - Medium connection
   *      * ≥3: Amber (#F59E0B) - Weak connection
   *      * <3: Gray (#E5E7EB) - Very weak connection
   *    - Draw line from node1 to node2
   *    - Calculate midpoint: (x1+x2)/2, (y1+y2)/2
   *    - Draw colored circle (radius 14px) at midpoint
   *    - Draw weight number in white text (centered)
   *
   * 4. Draw Nodes (top layer):
   *    - Outer shadow (8px blur, 2px offset)
   *    - Dark circle: #334155, radius 28px
   *    - Inner circle: #475569, radius 24px
   *    - Border ring: Cyan (#06B6D4), 3px stroke, radius 28px
   *    - Name text: White (#FFFFFF), 11px bold, centered
   *
   * Result: Clean, professional graph with clear visual hierarchy
   */
  useEffect(() => {
    if (!canvasRef.current || !currentGraph) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    const nodes = Array.from(currentGraph.getAllNodes());
    if (nodes.length === 0) return;

    // Calculate positions in a circle
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(rect.width, rect.height) * 0.32;

    const positions = new Map<UniversityStudent, GraphPosition>();
    const angleStep = (2 * Math.PI) / nodes.length;

    nodes.forEach((node, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.set(node, { x, y });
    });

    // Draw edges with better coloring
    ctx.lineWidth = 2.5;
    const drawn = new Set<string>();

    // Color scale based on weight
    const getEdgeColor = (weight: number): string => {
      if (weight >= 8) return '#06B6D4'; // Strong - Cyan
      if (weight >= 5) return '#10B981'; // Medium - Green
      if (weight >= 3) return '#F59E0B'; // Weak - Amber
      return '#E5E7EB'; // Very weak - Gray
    };

    nodes.forEach(student => {
      const p1 = positions.get(student)!;
      const edges = currentGraph.getNeighbors(student);

      edges.forEach(edge => {
        const key = [student.getName(), edge.neighbor.getName()].sort().join('-');
        if (drawn.has(key)) return;
        drawn.add(key);

        const p2 = positions.get(edge.neighbor)!;
        const weight = edge.weight;

        ctx.strokeStyle = getEdgeColor(weight);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Draw weight on edge with colored circle at exact midpoint
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        // Background circle for weight label (same color as line)
        ctx.fillStyle = getEdgeColor(weight);
        ctx.beginPath();
        ctx.arc(midX, midY, 14, 0, 2 * Math.PI);
        ctx.fill();

        // Weight text (white on colored circle)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(weight.toString(), midX, midY);
      });
    });

    // Draw nodes
    nodes.forEach(student => {
      const pos = positions.get(student)!;

      // Node shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;

      // Draw circle
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 28, 0, 2 * Math.PI);
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Inner circle
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 24, 0, 2 * Math.PI);
      ctx.fill();

      // Border ring
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 28, 0, 2 * Math.PI);
      ctx.stroke();

      // Name text inside circle (white, no background)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(student.getName(), pos.x, pos.y);
    });

  }, [currentGraph, activeTab]);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Refreshes all visualizations and data displays
   * - Triggers canvas re-render with fade effect
   * - Updates student details panel
   * - Logs refresh action
   */
  const refreshAll = () => {
    if (currentGraph) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.opacity = '0';
        setTimeout(() => {
          canvas.style.opacity = '1';
        }, 50);
      }
    }

    const student = currentStudents.find(s => s.getName() === detailStudent);
    if (student) {
      updateStudentDetails(student);
    }

    addLog('Views refreshed', 'success');
  };

  /**
   * Gets list of students excluding the currently selected one
   * Used to populate friend request and chat target dropdowns
   */
  const getOtherStudents = () => {
    return currentStudents.filter(s => s.getName() !== detailStudent);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  /**
   * Main component render
   *
   * Structure:
   * - .ln-app (flex container, 100vh)
   *   - .ln-sidebar (280px, dark background)
   *     - Logo
   *     - Navigation (5 tabs)
   *     - Quick Start guide
   *   - .ln-main-wrapper (flex: 1)
   *     - .ln-toolbar (fixed height, flex-end aligned buttons)
   *     - .ln-content-scroll (scrollable content area)
   *       - Tab content (conditionally rendered based on activeTab)
   *   - .ln-log-sidebar (50px collapsed / 380px expanded)
   *     - Toggle button
   *     - Activity log entries
   *   - Tooltip (absolute positioned)
   */
  return (
    <div className="ln-app">
      {/* Sidebar Navigation */}
      <aside className="ln-sidebar">
        <div className="ln-logo">
          <div className="ln-logo-icon">🤘</div>
          <div className="ln-logo-text">
            <h1>Longhorn Network</h1>
            <p>Social Graph Analytics</p>
          </div>
        </div>

        <nav className="ln-nav">
          <button
            className={`ln-nav-item ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('graph')}
            onMouseEnter={(e) => showTooltip('Visualize the student connection graph', e)}
            onMouseLeave={hideTooltip}
          >
            <span className="ln-nav-icon">📊</span>
            <span className="ln-nav-label">Student Graph</span>
          </button>
          <button
            className={`ln-nav-item ${activeTab === 'roommates' ? 'active' : ''}`}
            onClick={() => setActiveTab('roommates')}
            onMouseEnter={(e) => showTooltip('Run Gale-Shapley algorithm for roommate matching', e)}
            onMouseLeave={hideTooltip}
          >
            <span className="ln-nav-icon">🏠</span>
            <span className="ln-nav-label">Roommates</span>
          </button>
          <button
            className={`ln-nav-item ${activeTab === 'pods' ? 'active' : ''}`}
            onClick={() => setActiveTab('pods')}
            onMouseEnter={(e) => showTooltip('Form study groups based on connections', e)}
            onMouseLeave={hideTooltip}
          >
            <span className="ln-nav-icon">👥</span>
            <span className="ln-nav-label">Pod Formation</span>
          </button>
          <button
            className={`ln-nav-item ${activeTab === 'referrals' ? 'active' : ''}`}
            onClick={() => setActiveTab('referrals')}
            onMouseEnter={(e) => showTooltip('Find referral paths to companies via BFS', e)}
            onMouseLeave={hideTooltip}
          >
            <span className="ln-nav-icon">🔗</span>
            <span className="ln-nav-label">Referral Paths</span>
          </button>
          <button
            className={`ln-nav-item ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
            onMouseEnter={(e) => showTooltip('View student profiles and social interactions', e)}
            onMouseLeave={hideTooltip}
          >
            <span className="ln-nav-icon">👤</span>
            <span className="ln-nav-label">Student Details</span>
          </button>
        </nav>

        <div className="ln-help-card">
          <h3>💡 Quick Start</h3>
          <ol>
            <li>Load a test case</li>
            <li>Explore the graph</li>
            <li>Run algorithms</li>
            <li>View results</li>
          </ol>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ln-main-wrapper">
        {/* Top Control Bar */}
        <div className="ln-toolbar">
          <div className="ln-toolbar-section">
            <label className="ln-label">
              <span className="ln-label-text">Test Case</span>
              <select
                value={testCase}
                onChange={(e) => setTestCase(Number(e.target.value))}
                className="ln-select-modern"
              >
                <option value={1}>Test Case 1 - Two Groups</option>
                <option value={2}>Test Case 2 - Referral Paths</option>
                <option value={3}>Test Case 3 - Unpaired Student</option>
              </select>
            </label>

            <button
              onClick={loadTestData}
              className="ln-btn-modern ln-btn-primary"
              onMouseEnter={(e) => showTooltip('Load student data and build graph', e)}
              onMouseLeave={hideTooltip}
            >
              <span className="ln-btn-icon">📥</span>
              Load Data
            </button>
          </div>

          <div className="ln-toolbar-section">
            <button
              onClick={runRoommateMatching}
              className="ln-btn-modern ln-btn-success"
              onMouseEnter={(e) => showTooltip('Stable matching using Gale-Shapley', e)}
              onMouseLeave={hideTooltip}
            >
              Match Roommates
            </button>
            <button
              onClick={runPodFormation}
              className="ln-btn-modern ln-btn-warning"
              onMouseEnter={(e) => showTooltip('Group students into pods', e)}
              onMouseLeave={hideTooltip}
            >
              Form Pods
            </button>
            <button
              onClick={testSocialInteractions}
              className="ln-btn-modern ln-btn-accent"
              onMouseEnter={(e) => showTooltip('Simulate concurrent social interactions', e)}
              onMouseLeave={hideTooltip}
            >
              Test Social
            </button>
            <button
              onClick={refreshAll}
              className="ln-btn-modern ln-btn-ghost"
              onMouseEnter={(e) => showTooltip('Refresh all visualizations', e)}
              onMouseLeave={hideTooltip}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="ln-content-scroll">
          {/* Graph Tab */}
          {activeTab === 'graph' && (
            <div className="ln-card">
              <div className="ln-card-header">
                <h2 className="ln-card-title">Student Connection Graph</h2>
                <p className="ln-card-subtitle">Visualizing relationships and connection strengths</p>
              </div>
              <div className="ln-graph-wrapper">
                {currentGraph ? (
                  <>
                    <canvas ref={canvasRef} className="ln-canvas-modern" />
                    <div className="ln-legend">
                      <h4>Connection Strength</h4>
                      <div className="ln-legend-item">
                        <span className="ln-legend-line" style={{backgroundColor: '#06B6D4'}}></span>
                        <span>Strong (8+)</span>
                      </div>
                      <div className="ln-legend-item">
                        <span className="ln-legend-line" style={{backgroundColor: '#10B981'}}></span>
                        <span>Medium (5-7)</span>
                      </div>
                      <div className="ln-legend-item">
                        <span className="ln-legend-line" style={{backgroundColor: '#F59E0B'}}></span>
                        <span>Weak (3-4)</span>
                      </div>
                      <div className="ln-legend-item">
                        <span className="ln-legend-line" style={{backgroundColor: '#E5E7EB'}}></span>
                        <span>Very Weak (1-2)</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="ln-empty-modern">
                    <div className="ln-empty-icon">📊</div>
                    <h3>No Graph Data</h3>
                    <p>Load a test case to visualize the student network</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Roommates Tab */}
          {activeTab === 'roommates' && (
            <div className="ln-card">
              <div className="ln-card-header">
                <h2 className="ln-card-title">Roommate Assignments</h2>
                <p className="ln-card-subtitle">Stable matching via Gale-Shapley algorithm</p>
              </div>
              <pre className="ln-output-modern">{roommateData || 'Click "Match Roommates" to see assignments'}</pre>
            </div>
          )}

          {/* Pods Tab */}
          {activeTab === 'pods' && (
            <div className="ln-card">
              <div className="ln-card-header">
                <h2 className="ln-card-title">Pod Formation</h2>
                <p className="ln-card-subtitle">Group students into study pods</p>
              </div>
              <div className="ln-pod-controls-modern">
                <label className="ln-label">
                  <span className="ln-label-text">Pod Size</span>
                  <input
                    type="number"
                    value={podSize}
                    onChange={(e) => setPodSize(Number(e.target.value))}
                    min={2}
                    max={10}
                    className="ln-input-modern"
                  />
                </label>
                <button onClick={runPodFormation} className="ln-btn-modern ln-btn-warning">
                  Form Pods
                </button>
              </div>
              <pre className="ln-output-modern">{podData || 'Configure pod size and click "Form Pods"'}</pre>
            </div>
          )}

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <div className="ln-card">
              <div className="ln-card-header">
                <h2 className="ln-card-title">Referral Path Finder</h2>
                <p className="ln-card-subtitle">Find shortest path to company via BFS</p>
              </div>
              <div className="ln-referral-controls-modern">
                <label className="ln-label">
                  <span className="ln-label-text">Start Student</span>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="ln-select-modern"
                  >
                    {currentStudents.map(s => (
                      <option key={s.getName()} value={s.getName()}>
                        {s.getName()}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="ln-label">
                  <span className="ln-label-text">Target Company</span>
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g., Google, DummyCompany"
                    className="ln-input-modern"
                  />
                </label>

                <button onClick={findReferralPath} className="ln-btn-modern ln-btn-accent">
                  🔍 Find Path
                </button>
              </div>
              <pre className="ln-output-modern">{referralData || 'Select a student and company to find referral path'}</pre>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="ln-card">
              <div className="ln-card-header">
                <h2 className="ln-card-title">Student Details</h2>
                <p className="ln-card-subtitle">Profile, friends, and chat history</p>
              </div>

              <div className="ln-detail-grid">
                <div className="ln-detail-section">
                  <label className="ln-label">
                    <span className="ln-label-text">Select Student</span>
                    <select
                      value={detailStudent}
                      onChange={(e) => setDetailStudent(e.target.value)}
                      className="ln-select-modern"
                    >
                      {currentStudents.map(s => (
                        <option key={s.getName()} value={s.getName()}>
                          {s.getName()}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="ln-detail-section">
                  <h3 className="ln-section-title">Send Friend Request</h3>
                  <div className="ln-action-row">
                    <select
                      value={friendTarget}
                      onChange={(e) => setFriendTarget(e.target.value)}
                      className="ln-select-modern"
                    >
                      {getOtherStudents().map(s => (
                        <option key={s.getName()} value={s.getName()}>
                          {s.getName()}
                        </option>
                      ))}
                    </select>
                    <button onClick={sendFriendRequest} className="ln-btn-modern ln-btn-success">
                      + Add Friend
                    </button>
                  </div>
                </div>

                <div className="ln-detail-section">
                  <h3 className="ln-section-title">Send Message</h3>
                  <div className="ln-action-row">
                    <select
                      value={chatTarget}
                      onChange={(e) => setChatTarget(e.target.value)}
                      className="ln-select-modern"
                    >
                      {getOtherStudents().map(s => (
                        <option key={s.getName()} value={s.getName()}>
                          {s.getName()}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="ln-input-modern"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage} className="ln-btn-modern ln-btn-accent">
                      ✉ Send
                    </button>
                  </div>
                </div>
              </div>

              <pre className="ln-output-modern">{detailData || 'Select a student to view details'}</pre>
            </div>
          )}
        </div>
      </main>

      {/* Activity Log Sidebar */}
      <aside className={`ln-log-sidebar ${logExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="ln-log-toggle" onClick={() => setLogExpanded(!logExpanded)}>
          <span className="ln-log-toggle-icon">{logExpanded ? '»' : '«'}</span>
          <span className="ln-log-toggle-text">Activity Log</span>
        </div>
        {logExpanded && (
          <div className="ln-log-sidebar-content">
            <div className="ln-log-sidebar-header">
              <h3>Activity Log</h3>
              <button
                className="ln-log-clear"
                onClick={() => setOutputLog([])}
                onMouseEnter={(e) => showTooltip('Clear all logs', e)}
                onMouseLeave={hideTooltip}
              >
                Clear
              </button>
            </div>
            <div className="ln-log-sidebar-entries">
              {outputLog.length === 0 ? (
                <div className="ln-log-empty">No activity yet. Load data to get started.</div>
              ) : (
                outputLog.map((log, i) => (
                  <div key={i} className="ln-log-entry">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="ln-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};
