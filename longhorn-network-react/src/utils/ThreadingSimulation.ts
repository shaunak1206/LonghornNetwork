/**
 * ThreadingSimulation.ts
 *
 * Simulates multithreading behavior using JavaScript Promises and async/await.
 * This provides concurrent execution of friend requests and chat messages,
 * similar to the Java threading implementation.
 *
 * JavaScript Threading Model:
 * - JavaScript is single-threaded but supports asynchronous operations
 * - Uses Promises to simulate concurrent operations
 * - Uses async/await for cleaner asynchronous code
 * - Simulates thread-safe operations with proper sequencing
 *
 * Key Concepts:
 * - FriendRequestThread: Simulates sending friend requests concurrently
 * - ChatThread: Simulates sending messages concurrently
 * - Thread-safe operations: Uses proper ordering to avoid conflicts
 *
 * @author LonghornNetwork Team
 * @version 1.0
 */

import { UniversityStudent } from '../models/UniversityStudent';

/**
 * Simulates a thread that processes a friend request between two students.
 *
 * In JavaScript, we use Promises to simulate asynchronous execution.
 * This class mimics the Java Runnable interface pattern.
 *
 * Thread Safety:
 * - Uses consistent ordering (alphabetical by name) to avoid deadlocks
 * - Ensures both students are updated atomically
 * - Logs actions for debugging and verification
 */
export class FriendRequestThread {
  /** The student sending the friend request */
  private sender: UniversityStudent;

  /** The student receiving the friend request */
  private receiver: UniversityStudent;

  /** Array to collect log messages */
  private logs: string[];

  /**
   * Constructs a FriendRequestThread to send a friend request from sender to receiver.
   *
   * Example:
   * ```typescript
   * const thread = new FriendRequestThread(alice, bob, logs);
   * await thread.run();
   * // Now alice and bob are friends
   * ```
   *
   * @param sender - The UniversityStudent sending the friend request
   * @param receiver - The UniversityStudent receiving the friend request
   * @param logs - Array to append log messages to
   */
  constructor(sender: UniversityStudent, receiver: UniversityStudent, logs: string[]) {
    this.sender = sender;
    this.receiver = receiver;
    this.logs = logs;
  }

  /**
   * Executes the friend request operation asynchronously.
   *
   * This method simulates thread execution using async/await.
   * It adds a small delay to simulate processing time and make
   * concurrent execution more visible.
   *
   * Thread Safety Strategy:
   * - Orders students alphabetically to ensure consistent lock ordering
   * - This prevents deadlocks when multiple friend requests happen simultaneously
   * - In Java, this would use synchronized blocks
   *
   * Algorithm:
   * 1. Determine lock order (alphabetical by name)
   * 2. Simulate processing delay
   * 3. Add receiver to sender's friend list
   * 4. Add sender to receiver's friend list
   * 5. Log the action
   *
   * Time Complexity: O(1) for the operations, O(n) for the delay simulation
   *
   * @returns A Promise that resolves when the friend request is processed
   */
  public async run(): Promise<void> {
    // Simulate processing time (helps visualize concurrent execution)
    await this.delay(Math.random() * 100 + 50);

    // Use consistent ordering to prevent deadlocks
    // In a real multi-threaded environment, this would be synchronized blocks
    const first = this.sender.getName().localeCompare(this.receiver.getName()) < 0 ? this.sender : this.receiver;
    const second = first === this.sender ? this.receiver : this.sender;

    // Simulate locked section (would be synchronized in Java)
    // Add receiver to sender's friend list
    this.sender.addFriend(this.receiver);

    // Add sender to receiver's friend list (bidirectional friendship)
    this.receiver.addFriend(this.sender);

    // Log the action
    const logMessage = `${this.sender.getName()} sent a friend request to ${this.receiver.getName()}`;
    this.logs.push(logMessage);
    console.log(logMessage);
  }

  /**
   * Helper method to simulate processing delay.
   *
   * @param ms - Milliseconds to delay
   * @returns A Promise that resolves after the delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Simulates a thread that processes a chat message between two students.
 *
 * This class handles asynchronous message sending with proper
 * synchronization to ensure chat history consistency.
 *
 * Thread Safety:
 * - Uses consistent ordering to avoid race conditions
 * - Updates both sender and receiver's chat history
 * - Ensures messages are added in the correct order
 */
export class ChatThread {
  /** The student sending the message */
  private sender: UniversityStudent;

  /** The student receiving the message */
  private receiver: UniversityStudent;

  /** The message content to be sent */
  private message: string;

  /** Array to collect log messages */
  private logs: string[];

  /**
   * Constructs a ChatThread to send a message from sender to receiver.
   *
   * Example:
   * ```typescript
   * const thread = new ChatThread(alice, bob, "Hello!", logs);
   * await thread.run();
   * // Message added to both alice and bob's chat history
   * ```
   *
   * @param sender - The UniversityStudent sending the message
   * @param receiver - The UniversityStudent receiving the message
   * @param message - The message content to be sent
   * @param logs - Array to append log messages to
   */
  constructor(sender: UniversityStudent, receiver: UniversityStudent, message: string, logs: string[]) {
    this.sender = sender;
    this.receiver = receiver;
    this.message = message;
    this.logs = logs;
  }

  /**
   * Executes the chat operation asynchronously.
   *
   * This method simulates thread execution using async/await.
   * It updates the chat history for both sender and receiver.
   *
   * Thread Safety Strategy:
   * - Orders students alphabetically for consistent lock ordering
   * - Updates both chat histories atomically
   * - Prevents concurrent modification issues
   *
   * Algorithm:
   * 1. Determine lock order (alphabetical by name)
   * 2. Simulate processing delay
   * 3. Add message to sender's chat history with receiver
   * 4. Add message to receiver's chat history with sender
   * 5. Log the action (optional, commented out to reduce noise)
   *
   * Time Complexity: O(1) for the operations
   *
   * @returns A Promise that resolves when the message is processed
   */
  public async run(): Promise<void> {
    // Simulate processing time
    await this.delay(Math.random() * 100 + 50);

    // Use consistent ordering to prevent deadlocks
    const first = this.sender.getName().localeCompare(this.receiver.getName()) < 0 ? this.sender : this.receiver;
    const second = first === this.sender ? this.receiver : this.sender;

    // Simulate locked section (would be synchronized in Java)
    // Add message to sender's chat history with receiver
    this.sender.addChatMessage(this.receiver, this.message);

    // Also add to receiver's chat history with sender (bidirectional history)
    this.receiver.addChatMessage(this.sender, this.message);

    // Optional: Log the action (commented out to reduce log noise)
    // const logMessage = `${this.sender.getName()} sent message to ${this.receiver.getName()}: "${this.message}"`;
    // this.logs.push(logMessage);
  }

  /**
   * Helper method to simulate processing delay.
   *
   * @param ms - Milliseconds to delay
   * @returns A Promise that resolves after the delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * ThreadPool class simulates a thread pool executor similar to Java's ExecutorService.
 *
 * This provides a convenient way to run multiple operations concurrently
 * and wait for all of them to complete.
 *
 * Key Features:
 * - Submit multiple tasks (friend requests, chat messages)
 * - Execute all tasks concurrently using Promise.all
 * - Wait for completion with timeout support
 * - Collect logs from all operations
 */
export class ThreadPool {
  /** Array of pending tasks (Promises) */
  private tasks: Promise<void>[] = [];

  /** Array of log messages from all tasks */
  private logs: string[] = [];

  /**
   * Constructs a new ThreadPool.
   */
  constructor() {
    // Initialize empty
  }

  /**
   * Submits a friend request task to the pool.
   *
   * @param sender - The student sending the friend request
   * @param receiver - The student receiving the friend request
   */
  public submitFriendRequest(sender: UniversityStudent, receiver: UniversityStudent): void {
    const thread = new FriendRequestThread(sender, receiver, this.logs);
    this.tasks.push(thread.run());
  }

  /**
   * Submits a chat message task to the pool.
   *
   * @param sender - The student sending the message
   * @param receiver - The student receiving the message
   * @param message - The message content
   */
  public submitChat(sender: UniversityStudent, receiver: UniversityStudent, message: string): void {
    const thread = new ChatThread(sender, receiver, message, this.logs);
    this.tasks.push(thread.run());
  }

  /**
   * Executes all submitted tasks concurrently and waits for completion.
   *
   * This is similar to ExecutorService.shutdown() + awaitTermination() in Java.
   *
   * Example:
   * ```typescript
   * const pool = new ThreadPool();
   * pool.submitFriendRequest(alice, bob);
   * pool.submitChat(alice, bob, "Hi!");
   * await pool.awaitCompletion();
   * // All tasks completed
   * ```
   *
   * @param timeoutMs - Maximum time to wait in milliseconds (default: 5000)
   * @returns A Promise that resolves when all tasks complete or timeout occurs
   * @throws Error if tasks don't complete within timeout
   */
  public async awaitCompletion(timeoutMs: number = 5000): Promise<void> {
    // Create a timeout promise
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('Thread pool timeout')), timeoutMs);
    });

    // Race between all tasks completing and timeout
    try {
      await Promise.race([Promise.all(this.tasks), timeoutPromise]);
      console.log(`Thread pool completed: ${this.tasks.length} tasks executed successfully`);
    } catch (error) {
      console.error('Thread pool execution failed:', error);
      throw error;
    }
  }

  /**
   * Gets the collected logs from all tasks.
   *
   * @returns An array of log messages
   */
  public getLogs(): string[] {
    return [...this.logs];
  }

  /**
   * Gets the number of submitted tasks.
   *
   * @returns The number of tasks in the pool
   */
  public getTaskCount(): number {
    return this.tasks.length;
  }
}
