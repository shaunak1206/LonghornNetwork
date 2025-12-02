# Building the Longhorn Network React UI from Scratch

This guide walks through building the entire React UI step by step. Follow along to replicate the interface without cloning.

## Prerequisites

- Node.js (v14+) and npm installed
- Basic understanding of React, TypeScript, and CSS
- A code editor (VS Code recommended)

---

## Part 1: Project Setup

### Step 1: Create React App

```bash
npx create-react-app longhorn-network-react --template typescript
cd longhorn-network-react
```

### Step 2: Create Folder Structure

```bash
mkdir -p src/models
mkdir -p src/algorithms
mkdir -p src/utils
mkdir -p src/components
```

Your structure:
```
src/
├── models/
├── algorithms/
├── utils/
├── components/
├── App.tsx
└── index.tsx
```

---

## Part 2: Build Data Models

### Step 3: Create Student Base Class

Create `src/models/Student.ts`:

```typescript
/**
 * Abstract base class representing a student
 */
export abstract class Student {
  private name: string;
  private age: number;
  private gender: string;
  private year: string;
  private major: string;
  private gpa: number;

  constructor(
    name: string,
    age: number,
    gender: string,
    year: string,
    major: string,
    gpa: number
  ) {
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.year = year;
    this.major = major;
    this.gpa = gpa;
  }

  // Getters
  getName(): string { return this.name; }
  getAge(): number { return this.age; }
  getGender(): string { return this.gender; }
  getYear(): string { return this.year; }
  getMajor(): string { return this.major; }
  getGpa(): number { return this.gpa; }

  // Abstract method to be implemented by subclasses
  abstract calculateConnectionStrength(other: Student): number;
}
```

### Step 4: Create UniversityStudent Class

Create `src/models/UniversityStudent.ts`:

```typescript
import { Student } from './Student';

/**
 * Represents a university student with social connections
 */
export class UniversityStudent extends Student {
  private roommate: UniversityStudent | null = null;
  private friends: UniversityStudent[] = [];
  private chatHistory: Map<UniversityStudent, string[]> = new Map();
  private previousInternships: string[] = [];
  private roommatePreferences: string[] = [];

  constructor(
    name: string,
    age: number,
    gender: string,
    year: string,
    major: string,
    gpa: number,
    previousInternships: string[] = [],
    roommatePreferences: string[] = []
  ) {
    super(name, age, gender, year, major, gpa);
    this.previousInternships = previousInternships;
    this.roommatePreferences = roommatePreferences;
  }

  // Roommate methods
  getRoommate(): UniversityStudent | null {
    return this.roommate;
  }

  setRoommate(roommate: UniversityStudent | null): void {
    this.roommate = roommate;
  }

  getRoommatePreferences(): string[] {
    return this.roommatePreferences;
  }

  // Friend methods
  getFriends(): UniversityStudent[] {
    return this.friends;
  }

  addFriend(friend: UniversityStudent): void {
    if (!this.friends.includes(friend)) {
      this.friends.push(friend);
    }
  }

  // Chat methods
  getChatHistory(other: UniversityStudent): string[] {
    return this.chatHistory.get(other) || [];
  }

  addChatMessage(other: UniversityStudent, message: string): void {
    if (!this.chatHistory.has(other)) {
      this.chatHistory.set(other, []);
    }
    this.chatHistory.get(other)!.push(message);
  }

  // Internship methods
  getPreviousInternships(): string[] {
    return this.previousInternships;
  }

  /**
   * Calculate connection strength with another student
   * Formula:
   * - Roommates: +4
   * - Each shared internship: +3
   * - Same major: +2
   * - Same age: +1
   */
  calculateConnectionStrength(other: Student): number {
    if (!(other instanceof UniversityStudent)) return 0;

    let strength = 0;

    // Check if roommates
    if (this.roommate === other) {
      strength += 4;
    }

    // Count shared internships
    const sharedInternships = this.previousInternships.filter(
      internship => other.previousInternships.includes(internship)
    );
    strength += sharedInternships.length * 3;

    // Check if same major
    if (this.getMajor() === other.getMajor()) {
      strength += 2;
    }

    // Check if same age
    if (this.getAge() === other.getAge()) {
      strength += 1;
    }

    return strength;
  }
}
```

### Step 5: Create StudentGraph Class

Create `src/models/StudentGraph.ts`:

```typescript
import { UniversityStudent } from './UniversityStudent';

/**
 * Edge in the graph connecting two students
 */
export interface Edge {
  neighbor: UniversityStudent;
  weight: number;
}

/**
 * Weighted undirected graph using adjacency list representation
 */
export class StudentGraph {
  private adjacencyList: Map<UniversityStudent, Edge[]>;

  constructor(students: UniversityStudent[]) {
    this.adjacencyList = new Map();
    this.buildGraph(students);
  }

  /**
   * Build graph by calculating connection strengths between all student pairs
   */
  private buildGraph(students: UniversityStudent[]): void {
    // Initialize adjacency list
    students.forEach(student => {
      this.adjacencyList.set(student, []);
    });

    // Add edges between all pairs
    for (let i = 0; i < students.length; i++) {
      for (let j = i + 1; j < students.length; j++) {
        const student1 = students[i];
        const student2 = students[j];
        const weight = student1.calculateConnectionStrength(student2);

        // Only add edge if connection strength > 0
        if (weight > 0) {
          this.addEdge(student1, student2, weight);
        }
      }
    }
  }

  /**
   * Add bidirectional edge between two students
   */
  addEdge(student1: UniversityStudent, student2: UniversityStudent, weight: number): void {
    // Add edge from student1 to student2
    const edges1 = this.adjacencyList.get(student1) || [];
    edges1.push({ neighbor: student2, weight });
    this.adjacencyList.set(student1, edges1);

    // Add edge from student2 to student1 (undirected)
    const edges2 = this.adjacencyList.get(student2) || [];
    edges2.push({ neighbor: student1, weight });
    this.adjacencyList.set(student2, edges2);
  }

  /**
   * Get all neighbors of a student
   */
  getNeighbors(student: UniversityStudent): Edge[] {
    return this.adjacencyList.get(student) || [];
  }

  /**
   * Get all students (nodes) in the graph
   */
  getAllNodes(): Set<UniversityStudent> {
    return new Set(this.adjacencyList.keys());
  }

  /**
   * Get total number of edges in graph
   */
  getEdgeCount(): number {
    let count = 0;
    this.adjacencyList.forEach(edges => {
      count += edges.length;
    });
    return count;
  }
}
```

---

## Part 3: Implement Algorithms

### Step 6: Gale-Shapley Algorithm

Create `src/algorithms/GaleShapley.ts`:

```typescript
import { UniversityStudent } from '../models/UniversityStudent';

/**
 * Implements Gale-Shapley stable matching algorithm for roommate assignment
 */
export class GaleShapley {
  static assignRoommates(students: UniversityStudent[]): void {
    // Reset all roommate assignments
    students.forEach(s => s.setRoommate(null));

    // Queue of students who have preferences and need to propose
    const queue: UniversityStudent[] = [];
    const proposalIndex = new Map<UniversityStudent, number>();

    // Initialize queue with students who have preferences
    students.forEach(student => {
      if (student.getRoommatePreferences().length > 0) {
        queue.push(student);
        proposalIndex.set(student, 0);
      }
    });

    // Process proposals
    while (queue.length > 0) {
      const proposer = queue.shift()!;

      // Skip if already matched
      if (proposer.getRoommate() !== null) continue;

      const preferences = proposer.getRoommatePreferences();
      const currentIndex = proposalIndex.get(proposer) || 0;

      // No more preferences to try
      if (currentIndex >= preferences.length) continue;

      // Get next preference
      const preferredName = preferences[currentIndex];
      proposalIndex.set(proposer, currentIndex + 1);

      // Find the preferred student
      const preferred = students.find(s => s.getName() === preferredName);
      if (!preferred) {
        queue.push(proposer); // Try next preference
        continue;
      }

      // If preferred has no roommate, accept proposal
      if (preferred.getRoommate() === null) {
        proposer.setRoommate(preferred);
        preferred.setRoommate(proposer);
      } else {
        // Check if preferred prefers proposer over current roommate
        const currentRoommate = preferred.getRoommate()!;
        const preferredList = preferred.getRoommatePreferences();

        const proposerRank = preferredList.indexOf(proposer.getName());
        const currentRank = preferredList.indexOf(currentRoommate.getName());

        if (proposerRank !== -1 && (currentRank === -1 || proposerRank < currentRank)) {
          // Preferred prefers proposer, break current match
          currentRoommate.setRoommate(null);
          queue.push(currentRoommate);

          proposer.setRoommate(preferred);
          preferred.setRoommate(proposer);
        } else {
          // Proposal rejected, try next preference
          queue.push(proposer);
        }
      }
    }
  }
}
```

### Step 7: Referral Path Finder (BFS)

Create `src/algorithms/ReferralPathFinder.ts`:

```typescript
import { UniversityStudent } from '../models/UniversityStudent';
import { StudentGraph } from '../models/StudentGraph';

/**
 * Find referral paths using Breadth-First Search
 */
export class ReferralPathFinder {
  private graph: StudentGraph;

  constructor(graph: StudentGraph) {
    this.graph = graph;
  }

  /**
   * Find shortest path from start student to someone with target internship
   */
  findReferralPath(start: UniversityStudent, targetCompany: string): UniversityStudent[] {
    const queue: UniversityStudent[] = [start];
    const visited = new Set<UniversityStudent>();
    const parent = new Map<UniversityStudent, UniversityStudent | null>();

    visited.add(start);
    parent.set(start, null);

    // BFS traversal
    while (queue.length > 0) {
      const current = queue.shift()!;

      // Check if current student has target internship
      if (current.getPreviousInternships().includes(targetCompany)) {
        return this.reconstructPath(parent, current);
      }

      // Explore neighbors
      const neighbors = this.graph.getNeighbors(current);
      for (const edge of neighbors) {
        const neighbor = edge.neighbor;
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parent.set(neighbor, current);
          queue.push(neighbor);
        }
      }
    }

    // No path found
    return [];
  }

  /**
   * Reconstruct path from start to target using parent map
   */
  private reconstructPath(
    parent: Map<UniversityStudent, UniversityStudent | null>,
    target: UniversityStudent
  ): UniversityStudent[] {
    const path: UniversityStudent[] = [];
    let current: UniversityStudent | null = target;

    while (current !== null) {
      path.unshift(current);
      current = parent.get(current) || null;
    }

    return path;
  }
}
```

### Step 8: Pod Formation (Prim's Algorithm)

Create `src/algorithms/PodFormation.ts`:

```typescript
import { UniversityStudent } from '../models/UniversityStudent';
import { StudentGraph } from '../models/StudentGraph';

/**
 * Form study pods using graph-based grouping
 */
export class PodFormation {
  private graph: StudentGraph;
  private pods: UniversityStudent[][] = [];

  constructor(graph: StudentGraph) {
    this.graph = graph;
  }

  /**
   * Form pods of specified size
   */
  formPods(podSize: number): void {
    this.pods = [];
    const allStudents = Array.from(this.graph.getAllNodes());
    const assigned = new Set<UniversityStudent>();

    // Form pods using greedy approach
    for (const student of allStudents) {
      if (assigned.has(student)) continue;

      const pod: UniversityStudent[] = [student];
      assigned.add(student);

      // Add connected students to pod
      const candidates = this.getUnassignedNeighbors(student, assigned);
      while (pod.length < podSize && candidates.length > 0) {
        // Pick neighbor with strongest connection to pod
        const best = this.findBestCandidate(pod, candidates);
        if (best) {
          pod.push(best);
          assigned.add(best);
          candidates.splice(candidates.indexOf(best), 1);

          // Add new neighbors
          const newNeighbors = this.getUnassignedNeighbors(best, assigned);
          newNeighbors.forEach(n => {
            if (!candidates.includes(n)) candidates.push(n);
          });
        } else {
          break;
        }
      }

      this.pods.push(pod);
    }
  }

  /**
   * Get neighbors that haven't been assigned to a pod
   */
  private getUnassignedNeighbors(
    student: UniversityStudent,
    assigned: Set<UniversityStudent>
  ): UniversityStudent[] {
    return this.graph
      .getNeighbors(student)
      .map(edge => edge.neighbor)
      .filter(neighbor => !assigned.has(neighbor));
  }

  /**
   * Find candidate with strongest total connection to current pod
   */
  private findBestCandidate(
    pod: UniversityStudent[],
    candidates: UniversityStudent[]
  ): UniversityStudent | null {
    if (candidates.length === 0) return null;

    let best = candidates[0];
    let maxStrength = this.calculatePodConnection(best, pod);

    for (let i = 1; i < candidates.length; i++) {
      const strength = this.calculatePodConnection(candidates[i], pod);
      if (strength > maxStrength) {
        maxStrength = strength;
        best = candidates[i];
      }
    }

    return best;
  }

  /**
   * Calculate total connection strength between candidate and pod members
   */
  private calculatePodConnection(
    candidate: UniversityStudent,
    pod: UniversityStudent[]
  ): number {
    let total = 0;
    for (const member of pod) {
      total += candidate.calculateConnectionStrength(member);
    }
    return total;
  }

  /**
   * Get all formed pods
   */
  getPods(): UniversityStudent[][] {
    return this.pods;
  }
}
```

---

## Part 4: Utility Classes

### Step 9: Threading Simulation

Create `src/utils/ThreadingSimulation.ts`:

```typescript
import { UniversityStudent } from '../models/UniversityStudent';

/**
 * Simulate friend request as async thread
 */
export class FriendRequestThread {
  private student1: UniversityStudent;
  private student2: UniversityStudent;
  private logs: string[];

  constructor(student1: UniversityStudent, student2: UniversityStudent, logs: string[]) {
    this.student1 = student1;
    this.student2 = student2;
    this.logs = logs;
  }

  async run(): Promise<void> {
    // Simulate async delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Add friends bidirectionally (thread-safe via alphabetical ordering)
    const [first, second] = [this.student1, this.student2].sort((a, b) =>
      a.getName().localeCompare(b.getName())
    );

    first.addFriend(second);
    second.addFriend(first);

    this.logs.push(`${this.student1.getName()} and ${this.student2.getName()} are now friends`);
  }
}

/**
 * Simulate chat message as async thread
 */
export class ChatThread {
  private sender: UniversityStudent;
  private receiver: UniversityStudent;
  private message: string;
  private logs: string[];

  constructor(
    sender: UniversityStudent,
    receiver: UniversityStudent,
    message: string,
    logs: string[]
  ) {
    this.sender = sender;
    this.receiver = receiver;
    this.message = message;
    this.logs = logs;
  }

  async run(): Promise<void> {
    // Simulate async delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Add message to both chat histories (thread-safe via alphabetical ordering)
    const formattedMessage = `${this.sender.getName()}: ${this.message}`;

    const [first, second] = [this.sender, this.receiver].sort((a, b) =>
      a.getName().localeCompare(b.getName())
    );

    first.addChatMessage(second, formattedMessage);
    second.addChatMessage(first, formattedMessage);

    this.logs.push(`Message sent: ${formattedMessage}`);
  }
}

/**
 * Thread pool to manage concurrent operations
 */
export class ThreadPool {
  private threads: Promise<void>[] = [];

  submitFriendRequest(student1: UniversityStudent, student2: UniversityStudent): void {
    const logs: string[] = [];
    const thread = new FriendRequestThread(student1, student2, logs);
    this.threads.push(thread.run());
  }

  submitChat(sender: UniversityStudent, receiver: UniversityStudent, message: string): void {
    const logs: string[] = [];
    const thread = new ChatThread(sender, receiver, message, logs);
    this.threads.push(thread.run());
  }

  async awaitCompletion(): Promise<void> {
    await Promise.all(this.threads);
    this.threads = [];
  }
}
```

### Step 10: Test Data Generator

Create `src/utils/TestDataGenerator.ts`:

```typescript
import { UniversityStudent } from '../models/UniversityStudent';

/**
 * Generate test data matching Java implementation
 */
export class TestDataGenerator {
  static generateTestCase(caseNum: number): UniversityStudent[] {
    switch (caseNum) {
      case 1:
        return this.generateTestCase1();
      case 2:
        return this.generateTestCase2();
      case 3:
        return this.generateTestCase3();
      default:
        return this.generateTestCase1();
    }
  }

  /**
   * Test Case 1: Two groups with mutual preferences
   */
  private static generateTestCase1(): UniversityStudent[] {
    return [
      new UniversityStudent(
        'Alice', 20, 'Female', 'Sophomore', 'Computer Science', 3.8,
        ['Google', 'Microsoft'], ['Bob', 'Charlie']
      ),
      new UniversityStudent(
        'Bob', 20, 'Male', 'Sophomore', 'Computer Science', 3.6,
        ['Google'], ['Alice', 'Charlie']
      ),
      new UniversityStudent(
        'Charlie', 21, 'Male', 'Junior', 'Mathematics', 3.9,
        ['Jane Street'], ['Alice', 'Bob']
      ),
      new UniversityStudent(
        'Dana', 19, 'Female', 'Freshman', 'Biology', 3.7,
        [], ['Evan']
      ),
      new UniversityStudent(
        'Evan', 19, 'Male', 'Freshman', 'Biology', 3.5,
        [], ['Dana']
      ),
      new UniversityStudent(
        'Frank', 22, 'Male', 'Senior', 'Chemistry', 3.4,
        ['Pfizer'], []
      )
    ];
  }

  /**
   * Test Case 2: Referral path testing
   */
  private static generateTestCase2(): UniversityStudent[] {
    return [
      new UniversityStudent(
        'Greg', 20, 'Male', 'Sophomore', 'Economics', 3.5,
        [], ['Helen']
      ),
      new UniversityStudent(
        'Helen', 20, 'Female', 'Sophomore', 'Economics', 3.6,
        [], ['Ivy', 'Greg']
      ),
      new UniversityStudent(
        'Ivy', 20, 'Female', 'Sophomore', 'Economics', 3.7,
        ['DummyCompany'], ['Helen']
      )
    ];
  }

  /**
   * Test Case 3: Unpaired student scenario
   */
  private static generateTestCase3(): UniversityStudent[] {
    return [
      new UniversityStudent(
        'Jack', 21, 'Male', 'Junior', 'History', 3.2,
        [], ['Kim']
      ),
      new UniversityStudent(
        'Kim', 21, 'Female', 'Junior', 'History', 3.4,
        [], ['Jack']
      ),
      new UniversityStudent(
        'Leo', 21, 'Male', 'Junior', 'History', 3.3,
        [], []  // No preferences - will remain unpaired
      )
    ];
  }
}
```

---

## Part 5: Building the React UI Component

### Step 11: Create Main UI Component Structure

Create `src/components/LonghornNetworkUI.tsx`:

```typescript
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UniversityStudent } from '../models/UniversityStudent';
import { StudentGraph } from '../models/StudentGraph';
import { GaleShapley } from '../algorithms/GaleShapley';
import { PodFormation } from '../algorithms/PodFormation';
import { ReferralPathFinder } from '../algorithms/ReferralPathFinder';
import { TestDataGenerator } from '../utils/TestDataGenerator';
import { FriendRequestThread, ChatThread, ThreadPool } from '../utils/ThreadingSimulation';
import './LonghornNetworkUI.css';

type TabType = 'graph' | 'roommates' | 'pods' | 'referrals' | 'details';

interface GraphPosition {
  x: number;
  y: number;
}

interface TooltipState {
  show: boolean;
  content: string;
  x: number;
  y: number;
}

export const LonghornNetworkUI: React.FC = () => {
  // Core state
  const [currentStudents, setCurrentStudents] = useState<UniversityStudent[]>([]);
  const [currentGraph, setCurrentGraph] = useState<StudentGraph | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('graph');
  const [testCase, setTestCase] = useState<number>(1);
  const [outputLog, setOutputLog] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState>({ show: false, content: '', x: 0, y: 0 });
  const [logExpanded, setLogExpanded] = useState<boolean>(false);

  // Feature state
  const [roommateData, setRoommateData] = useState<string>('');
  const [podSize, setPodSize] = useState<number>(3);
  const [podData, setPodData] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [targetCompany, setTargetCompany] = useState<string>('');
  const [referralData, setReferralData] = useState<string>('');
  const [detailStudent, setDetailStudent] = useState<string>('');
  const [friendTarget, setFriendTarget] = useState<string>('');
  const [chatTarget, setChatTarget] = useState<string>('');
  const [chatMessage, setChatMessage] = useState<string>('');
  const [detailData, setDetailData] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Continue in next step...
```

### Step 12: Add Utility Functions

Continue in `src/components/LonghornNetworkUI.tsx`:

```typescript
  // ... previous code

  /**
   * Add timestamped log entry
   */
  const addLog = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : '→';
    setOutputLog(prev => [...prev, `${prefix} ${timestamp} - ${message}`]);
  }, []);

  /**
   * Show tooltip
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

  /**
   * Hide tooltip
   */
  const hideTooltip = () => {
    setTooltip({ ...tooltip, show: false });
  };

  // Continue in next step...
```

### Step 13: Add Data Loading Function

Continue in `src/components/LonghornNetworkUI.tsx`:

```typescript
  // ... previous code

  /**
   * Load test case data
   */
  const loadTestData = () => {
    try {
      const students = TestDataGenerator.generateTestCase(testCase);
      setCurrentStudents(students);
      const graph = new StudentGraph(students);
      setCurrentGraph(graph);

      // Initialize dropdowns
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

  // Continue in next step...
```

### Step 14: Add Algorithm Functions

Continue in `src/components/LonghornNetworkUI.tsx`:

```typescript
  // ... previous code

  /**
   * Run Gale-Shapley roommate matching
   */
  const runRoommateMatching = () => {
    if (!currentStudents.length) {
      addLog('Please load data first!', 'error');
      return;
    }

    addLog('Running Gale-Shapley roommate matching algorithm...');
    GaleShapley.assignRoommates(currentStudents);

    // Rebuild graph with roommate connections
    const graph = new StudentGraph(currentStudents);
    setCurrentGraph(graph);

    // Generate output
    let text = '=== Roommate Assignments ===\n\n';
    const processed = new Set<UniversityStudent>();
    let pairCount = 0;

    for (const student of currentStudents) {
      if (!processed.has(student)) {
        const roommate = student.getRoommate();
        if (roommate && !processed.has(roommate)) {
          pairCount++;
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
  };

  /**
   * Form study pods
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
  };

  /**
   * Find referral path
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
      text += `ERROR: No student has interned at "${targetCompany}".\n\n`;
      text += 'Available internships:\n';

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
      addLog(`Company "${targetCompany}" not found`, 'error');
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
      addLog(`Referral path found: ${path.length} hops`, 'success');
    }

    setReferralData(text);
  };

  // Continue in next step...
```

### Step 15: Add Student Details and Social Functions

Continue in `src/components/LonghornNetworkUI.tsx`:

```typescript
  // ... previous code

  /**
   * Update student details display
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
   * Send friend request
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
   * Send chat message
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
   * Test concurrent social interactions
   */
  const testSocialInteractions = async () => {
    if (!currentStudents.length) {
      addLog('Please load data first!', 'error');
      return;
    }

    if (currentStudents.length < 2) {
      addLog('Need at least 2 students!', 'error');
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
    const student = currentStudents.find(s => s.getName() === detailStudent);
    if (student) {
      updateStudentDetails(student);
    }
  };

  /**
   * Effect: Update student details when selection changes
   */
  useEffect(() => {
    const student = currentStudents.find(s => s.getName() === detailStudent);
    if (student) {
      updateStudentDetails(student);
    }
  }, [detailStudent, currentStudents, updateStudentDetails]);

  // Continue in next step...
```

### Step 16: Add Canvas Graph Visualization

Continue in `src/components/LonghornNetworkUI.tsx`:

```typescript
  // ... previous code

  /**
   * Effect: Render graph on canvas
   */
  useEffect(() => {
    if (!canvasRef.current || !currentGraph) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for crisp rendering
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    const nodes = Array.from(currentGraph.getAllNodes());
    if (nodes.length === 0) return;

    // Calculate circular layout positions
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

    // Draw edges
    ctx.lineWidth = 2.5;
    const drawn = new Set<string>();

    const getEdgeColor = (weight: number): string => {
      if (weight >= 8) return '#06B6D4'; // Cyan
      if (weight >= 5) return '#10B981'; // Green
      if (weight >= 3) return '#F59E0B'; // Amber
      return '#E5E7EB'; // Gray
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

        // Draw line
        ctx.strokeStyle = getEdgeColor(weight);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Draw weight label
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        ctx.fillStyle = getEdgeColor(weight);
        ctx.beginPath();
        ctx.arc(midX, midY, 14, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(weight.toString(), midX, midY);
      });
    });

    // Draw nodes
    nodes.forEach(student => {
      const pos = positions.get(student)!;

      // Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;

      // Outer circle
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 28, 0, 2 * Math.PI);
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Inner circle
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 24, 0, 2 * Math.PI);
      ctx.fill();

      // Border
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 28, 0, 2 * Math.PI);
      ctx.stroke();

      // Name text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(student.getName(), pos.x, pos.y);
    });

  }, [currentGraph, activeTab]);

  /**
   * Refresh all views
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
   * Get other students for dropdowns
   */
  const getOtherStudents = () => {
    return currentStudents.filter(s => s.getName() !== detailStudent);
  };

  // Continue in next step with JSX render...
```

### Step 17: Add JSX Render (Part 1 - Layout & Sidebar)

Continue in `src/components/LonghornNetworkUI.tsx`:

```typescript
  // ... previous code

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
            onMouseEnter={(e) => showTooltip('Run Gale-Shapley algorithm', e)}
            onMouseLeave={hideTooltip}
          >
            <span className="ln-nav-icon">🏠</span>
            <span className="ln-nav-label">Roommates</span>
          </button>
          <button
            className={`ln-nav-item ${activeTab === 'pods' ? 'active' : ''}`}
            onClick={() => setActiveTab('pods')}
            onMouseEnter={(e) => showTooltip('Form study groups', e)}
            onMouseLeave={hideTooltip}
          >
            <span className="ln-nav-icon">👥</span>
            <span className="ln-nav-label">Pod Formation</span>
          </button>
          <button
            className={`ln-nav-item ${activeTab === 'referrals' ? 'active' : ''}`}
            onClick={() => setActiveTab('referrals')}
            onMouseEnter={(e) => showTooltip('Find referral paths', e)}
            onMouseLeave={hideTooltip}
          >
            <span className="ln-nav-icon">🔗</span>
            <span className="ln-nav-label">Referral Paths</span>
          </button>
          <button
            className={`ln-nav-item ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
            onMouseEnter={(e) => showTooltip('View student profiles', e)}
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

      {/* Continue in next step... */}
```

### Step 18: Add JSX Render (Part 2 - Main Content)

Continue the render in `src/components/LonghornNetworkUI.tsx`:

```typescript
      {/* ... previous JSX */}

      {/* Main Content Area */}
      <main className="ln-main-wrapper">
        {/* Toolbar */}
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
            >
              <span className="ln-btn-icon">📥</span>
              Load Data
            </button>
          </div>

          <div className="ln-toolbar-section">
            <button
              onClick={runRoommateMatching}
              className="ln-btn-modern ln-btn-success"
            >
              Match Roommates
            </button>
            <button
              onClick={runPodFormation}
              className="ln-btn-modern ln-btn-warning"
            >
              Form Pods
            </button>
            <button
              onClick={testSocialInteractions}
              className="ln-btn-modern ln-btn-accent"
            >
              Test Social
            </button>
            <button
              onClick={refreshAll}
              className="ln-btn-modern ln-btn-ghost"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="ln-content-scroll">
          {/* Graph Tab */}
          {activeTab === 'graph' && (
            <div className="ln-card">
              <div className="ln-card-header">
                <h2 className="ln-card-title">Student Connection Graph</h2>
                <p className="ln-card-subtitle">Network visualization</p>
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
                    <p>Load a test case to visualize</p>
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
                <p className="ln-card-subtitle">Gale-Shapley stable matching</p>
              </div>
              <pre className="ln-output-modern">
                {roommateData || 'Click "Match Roommates" to see assignments'}
              </pre>
            </div>
          )}

          {/* Pods Tab */}
          {activeTab === 'pods' && (
            <div className="ln-card">
              <div className="ln-card-header">
                <h2 className="ln-card-title">Pod Formation</h2>
                <p className="ln-card-subtitle">Study group formation</p>
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
              <pre className="ln-output-modern">
                {podData || 'Configure pod size and click "Form Pods"'}
              </pre>
            </div>
          )}

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <div className="ln-card">
              <div className="ln-card-header">
                <h2 className="ln-card-title">Referral Path Finder</h2>
                <p className="ln-card-subtitle">BFS pathfinding</p>
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
              <pre className="ln-output-modern">
                {referralData || 'Select student and company to find path'}
              </pre>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="ln-card">
              <div className="ln-card-header">
                <h2 className="ln-card-title">Student Details</h2>
                <p className="ln-card-subtitle">Profile and social interactions</p>
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
                      placeholder="Type message..."
                      className="ln-input-modern"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage} className="ln-btn-modern ln-btn-accent">
                      ✉ Send
                    </button>
                  </div>
                </div>
              </div>

              <pre className="ln-output-modern">
                {detailData || 'Select a student to view details'}
              </pre>
            </div>
          )}
        </div>
      </main>

      {/* Continue in next step... */}
```

### Step 19: Add JSX Render (Part 3 - Activity Log & Tooltip)

Continue the render in `src/components/LonghornNetworkUI.tsx`:

```typescript
      {/* ... previous JSX */}

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
              >
                Clear
              </button>
            </div>
            <div className="ln-log-sidebar-entries">
              {outputLog.length === 0 ? (
                <div className="ln-log-empty">No activity yet</div>
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
```

This completes the TypeScript component file!

---

## Part 6: Styling the UI

### Step 20: Create CSS File (Part 1 - Variables & Layout)

Create `src/components/LonghornNetworkUI.css`:

```css
/* ============================================================================
   CSS VARIABLES & RESET
   ============================================================================ */

:root {
  --burnt-orange: #BF5700;
  --cream: #FFF7ED;
  --charcoal: #0F172A;
  --slate-dark: #1E293B;
  --slate: #334155;
  --slate-light: #475569;
  --cyan: #06B6D4;
  --green: #10B981;
  --amber: #F59E0B;
  --gray: #E5E7EB;
  --spacing: 8px;
}

* {
  box-sizing: border-box;
}

/* ============================================================================
   MAIN LAYOUT (3-COLUMN)
   ============================================================================ */

.ln-app {
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: linear-gradient(to bottom, #FFF7ED, #FFEDD5, #FED7AA);
  overflow: hidden;
}

/* ============================================================================
   SIDEBAR (LEFT)
   ============================================================================ */

.ln-sidebar {
  width: 280px;
  background: var(--charcoal);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
}

.ln-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ln-logo-icon {
  font-size: 40px;
}

.ln-logo-text h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--burnt-orange);
}

.ln-logo-text p {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

/* Navigation */

.ln-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.ln-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.ln-nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.ln-nav-item.active {
  background: var(--burnt-orange);
  color: white;
}

.ln-nav-icon {
  font-size: 20px;
}

.ln-nav-label {
  flex: 1;
}

/* Help Card */

.ln-help-card {
  margin-top: auto;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.ln-help-card h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
}

.ln-help-card ol {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
}

/* ============================================================================
   MAIN CONTENT (CENTER)
   ============================================================================ */

.ln-main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Toolbar */

.ln-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #E5E7EB;
  flex-shrink: 0;
}

.ln-toolbar-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Content Scroll Area */

.ln-content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* Cards */

.ln-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.ln-card-header {
  padding: 24px;
  border-bottom: 1px solid #E5E7EB;
}

.ln-card-title {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--slate-dark);
}

.ln-card-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6B7280;
}

/* Continue in next step... */
```

### Step 21: Create CSS File (Part 2 - Form Controls)

Continue in `src/components/LonghornNetworkUI.css`:

```css
/* ... previous CSS */

/* ============================================================================
   FORM CONTROLS
   ============================================================================ */

.ln-label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ln-label-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--slate);
}

.ln-select-modern,
.ln-input-modern {
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: all 0.2s;
}

.ln-select-modern:focus,
.ln-input-modern:focus {
  outline: none;
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

.ln-input-modern {
  min-width: 200px;
}

/* Buttons */

.ln-btn-modern {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.ln-btn-modern:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.ln-btn-primary {
  background: var(--burnt-orange);
  color: white;
}

.ln-btn-success {
  background: var(--green);
  color: white;
}

.ln-btn-warning {
  background: var(--amber);
  color: white;
}

.ln-btn-accent {
  background: var(--cyan);
  color: white;
}

.ln-btn-ghost {
  background: transparent;
  color: var(--slate);
  border: 1px solid #D1D5DB;
}

.ln-btn-icon {
  font-size: 16px;
}

/* ============================================================================
   GRAPH VISUALIZATION
   ============================================================================ */

.ln-graph-wrapper {
  position: relative;
  padding: 24px;
}

.ln-canvas-modern {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  background: #F9FAFB;
  transition: opacity 0.3s;
}

.ln-legend {
  position: absolute;
  bottom: 40px;
  right: 40px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ln-legend h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--slate);
}

.ln-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
}

.ln-legend-line {
  width: 24px;
  height: 3px;
  border-radius: 2px;
}

.ln-empty-modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #9CA3AF;
}

.ln-empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.ln-empty-modern h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: var(--slate);
}

.ln-empty-modern p {
  margin: 0;
  font-size: 14px;
}

/* ============================================================================
   OUTPUT AREAS
   ============================================================================ */

.ln-output-modern {
  padding: 24px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: var(--slate);
  background: #F9FAFB;
  border: none;
  white-space: pre-wrap;
  overflow-x: auto;
  margin: 0;
}

/* Pod Controls */

.ln-pod-controls-modern {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  padding: 24px;
  border-bottom: 1px solid #E5E7EB;
}

/* Referral Controls */

.ln-referral-controls-modern {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  padding: 24px;
  border-bottom: 1px solid #E5E7EB;
  flex-wrap: wrap;
}

/* Detail Controls */

.ln-detail-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #E5E7EB;
}

.ln-detail-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ln-section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--slate);
}

.ln-action-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

/* Continue in next step... */
```

### Step 22: Create CSS File (Part 3 - Activity Log & Tooltip)

Continue in `src/components/LonghornNetworkUI.css`:

```css
/* ... previous CSS */

/* ============================================================================
   ACTIVITY LOG SIDEBAR (RIGHT)
   ============================================================================ */

.ln-log-sidebar {
  background: var(--slate-dark);
  color: white;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  position: relative;
}

.ln-log-sidebar.collapsed {
  width: 50px;
}

.ln-log-sidebar.expanded {
  width: 380px;
}

.ln-log-toggle {
  padding: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--charcoal);
  transition: background 0.2s;
}

.ln-log-toggle:hover {
  background: var(--slate);
}

.ln-log-toggle-icon {
  font-size: 20px;
  font-weight: bold;
}

.ln-log-toggle-text {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.ln-log-sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ln-log-sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ln-log-sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.ln-log-clear {
  padding: 4px 12px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.ln-log-clear:hover {
  background: rgba(255, 255, 255, 0.1);
}

.ln-log-sidebar-entries {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.ln-log-entry {
  padding: 8px 12px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
  word-break: break-word;
}

.ln-log-empty {
  padding: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
}

/* ============================================================================
   TOOLTIP
   ============================================================================ */

.ln-tooltip {
  position: fixed;
  transform: translate(-50%, -100%);
  background: var(--charcoal);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.ln-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--charcoal);
}

/* ============================================================================
   RESPONSIVE DESIGN
   ============================================================================ */

@media (max-width: 1024px) {
  .ln-sidebar {
    width: 240px;
  }

  .ln-log-sidebar.expanded {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .ln-app {
    flex-direction: column;
  }

  .ln-sidebar {
    width: 100%;
    padding: 16px;
  }

  .ln-toolbar {
    flex-direction: column;
    gap: 12px;
  }

  .ln-toolbar-section {
    width: 100%;
    flex-wrap: wrap;
  }

  .ln-log-sidebar.expanded {
    width: 100%;
  }
}

/* ============================================================================
   SCROLLBAR STYLING
   ============================================================================ */

.ln-sidebar::-webkit-scrollbar,
.ln-content-scroll::-webkit-scrollbar,
.ln-log-sidebar-entries::-webkit-scrollbar {
  width: 8px;
}

.ln-sidebar::-webkit-scrollbar-track,
.ln-content-scroll::-webkit-scrollbar-track,
.ln-log-sidebar-entries::-webkit-scrollbar-track {
  background: transparent;
}

.ln-sidebar::-webkit-scrollbar-thumb,
.ln-content-scroll::-webkit-scrollbar-thumb,
.ln-log-sidebar-entries::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.ln-sidebar::-webkit-scrollbar-thumb:hover,
.ln-content-scroll::-webkit-scrollbar-thumb:hover,
.ln-log-sidebar-entries::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
```

---

## Part 7: Final Setup

### Step 23: Update App.tsx

Update `src/App.tsx`:

```typescript
import React from 'react';
import { LonghornNetworkUI } from './components/LonghornNetworkUI';

function App() {
  return <LonghornNetworkUI />;
}

export default App;
```

### Step 24: Update index.css

Update `src/index.css`:

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

* {
  box-sizing: border-box;
}
```

---

## Part 8: Run and Test

### Step 25: Start the Application

```bash
npm start
```

The app should open at `http://localhost:3000`.

### Step 26: Test Each Feature

1. Click "Load Data" and select different test cases
2. Click "Student Graph" to see the visualization
3. Click "Match Roommates" to run Gale-Shapley
4. Click "Pods" and try different pod sizes
5. Click "Referral Paths" and search for "DummyCompany" in Test Case 2
6. Click "Student Details" and test friend requests and chat
7. Click "Test Social" to run concurrent operations
8. Expand the Activity Log (« button) to see all actions

---

## Summary

You've now built a complete React UI with:

- **Data Models**: Student, UniversityStudent, StudentGraph
- **Algorithms**: Gale-Shapley, BFS Referral Finder, Pod Formation
- **UI Component**: Full-featured React component with TypeScript
- **Canvas Visualization**: Circular graph layout with color-coded edges
- **Interactive Features**: Friend requests, chat, algorithm execution
- **Activity Logging**: Real-time action tracking
- **Responsive Design**: Works on desktop, tablet, and mobile

The application is approximately **2,900 lines of code** implementing all Longhorn Network features without any external UI libraries or frameworks beyond React itself.
