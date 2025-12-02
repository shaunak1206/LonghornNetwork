/**
 * TestDataGenerator.ts
 *
 * Generates test data for the Longhorn Network application.
 * This mirrors the test cases from the Java Main.java file.
 *
 * Test Cases:
 * - Test Case 1: Two groups with full mutual roommate preferences
 * - Test Case 2: Students with "DummyCompany" internship for referral testing
 * - Test Case 3: Students where one has no roommate preferences
 *
 * @author LonghornNetwork Team
 * @version 1.0
 */

import { UniversityStudent } from '../models/UniversityStudent';

/**
 * TestDataGenerator class provides static methods to generate
 * predefined test cases for testing and demonstration.
 */
export class TestDataGenerator {
  /**
   * Generates Test Case 1: Two groups of students.
   * Group 1 contains four students with full mutual roommate preferences.
   * Group 2 contains a pair of students.
   *
   * Expected Behavior:
   * - Group 1 students should pair with each other based on Gale-Shapley
   * - Group 2 students (Dana and Evan) should pair together
   * - Strong connections within groups for pod formation
   *
   * Connection Strengths:
   * - Within Computer Science group: shared major (2 pts) + age variations
   * - Alice-Bob: Same major(2) + shared internship Google(3) = 5
   * - Bob has more connections due to multiple shared internships
   * - Dana-Evan: Same age(1) + same major(2) + shared internship Pfizer(3) = 6
   *
   * @returns An array of UniversityStudent objects for Test Case 1
   */
  public static generateTestCase1(): UniversityStudent[] {
    const students: UniversityStudent[] = [];

    // Group 1: 4 students with full mutual roommate preferences
    students.push(
      new UniversityStudent(
        'Alice',
        20,
        'Female',
        2,
        'Computer Science',
        3.5,
        ['Bob', 'Charlie', 'Frank'],
        ['Google']
      )
    );

    students.push(
      new UniversityStudent(
        'Bob',
        21,
        'Male',
        3,
        'Computer Science',
        3.7,
        ['Alice', 'Charlie', 'Frank'],
        ['Google', 'Microsoft']
      )
    );

    students.push(
      new UniversityStudent(
        'Charlie',
        20,
        'Male',
        2,
        'Mathematics',
        3.2,
        ['Alice', 'Bob', 'Frank'],
        ['None']
      )
    );

    students.push(
      new UniversityStudent(
        'Frank',
        23,
        'Male',
        3,
        'Chemistry',
        3.1,
        ['Alice', 'Bob', 'Charlie'],
        []
      )
    );

    // Group 2: 2 students
    students.push(
      new UniversityStudent(
        'Dana',
        22,
        'Female',
        4,
        'Biology',
        3.8,
        ['Evan'],
        ['Pfizer']
      )
    );

    students.push(
      new UniversityStudent(
        'Evan',
        22,
        'Male',
        4,
        'Biology',
        3.6,
        ['Dana'],
        ['Moderna', 'Pfizer']
      )
    );

    return students;
  }

  /**
   * Generates Test Case 2: Three students where one has "DummyCompany" as a previous internship.
   * This test case is designed to test the referral path finder.
   *
   * Expected Behavior:
   * - Searching for "DummyCompany" should find Ivy
   * - Path from Greg to "DummyCompany": Greg -> Helen -> Ivy or Greg -> Ivy
   * - All three students are in Economics, so they share major connections
   *
   * Connection Strengths:
   * - All same age (24/25 mostly) and same major (Economics)
   * - Greg-Helen: Same age(1) + same major(2) = 3
   * - Helen-Ivy: Same major(2) = 2
   * - Greg-Ivy: Same major(2) = 2
   *
   * @returns An array of UniversityStudent objects for Test Case 2
   */
  public static generateTestCase2(): UniversityStudent[] {
    const students: UniversityStudent[] = [];

    students.push(
      new UniversityStudent(
        'Greg',
        24,
        'Male',
        4,
        'Economics',
        3.4,
        ['Helen', 'Ivy'],
        ['InternshipA']
      )
    );

    students.push(
      new UniversityStudent(
        'Helen',
        24,
        'Female',
        4,
        'Economics',
        3.5,
        ['Greg', 'Ivy'],
        ['InternshipB']
      )
    );

    students.push(
      new UniversityStudent(
        'Ivy',
        25,
        'Female',
        4,
        'Economics',
        3.8,
        ['Helen', 'Greg'],
        ['DummyCompany']
      )
    );

    return students;
  }

  /**
   * Generates Test Case 3: Three students where one has no roommate preferences.
   * Two of them can be paired and one remains unpaired.
   *
   * Expected Behavior:
   * - Jack and Kim should be paired as roommates (mutual preference)
   * - Leo should remain unpaired (no preferences)
   * - Pod formation should group all three together if pod size >= 3
   *
   * Connection Strengths:
   * - All are History majors
   * - Jack-Kim: Same age(1) + same major(2) + shared internship(3) = 6
   * - Leo-Jack: Same major(2) = 2
   * - Leo-Kim: Same major(2) = 2
   *
   * @returns An array of UniversityStudent objects for Test Case 3
   */
  public static generateTestCase3(): UniversityStudent[] {
    const students: UniversityStudent[] = [];

    students.push(
      new UniversityStudent(
        'Jack',
        19,
        'Male',
        1,
        'History',
        3.0,
        ['Kim'],
        ['MuseumIntern']
      )
    );

    students.push(
      new UniversityStudent(
        'Kim',
        19,
        'Female',
        1,
        'History',
        3.2,
        ['Jack'],
        ['MuseumIntern']
      )
    );

    students.push(
      new UniversityStudent(
        'Leo',
        20,
        'Male',
        1,
        'History',
        3.5,
        [],
        ['None']
      )
    );

    return students;
  }

  /**
   * Gets all test cases.
   *
   * Useful for running all tests at once or displaying in a dropdown.
   *
   * @returns An array of test case objects with name and students
   */
  public static getAllTestCases(): Array<{ name: string; students: UniversityStudent[] }> {
    return [
      { name: 'Test Case 1: Two Groups', students: TestDataGenerator.generateTestCase1() },
      { name: 'Test Case 2: Referral Path Test', students: TestDataGenerator.generateTestCase2() },
      { name: 'Test Case 3: Unpaired Student', students: TestDataGenerator.generateTestCase3() },
    ];
  }

  /**
   * Generates a specific test case by number.
   *
   * @param testCaseNumber - The test case number (1, 2, or 3)
   * @returns An array of UniversityStudent objects for the specified test case
   */
  public static generateTestCase(testCaseNumber: number): UniversityStudent[] {
    switch (testCaseNumber) {
      case 1:
        return TestDataGenerator.generateTestCase1();
      case 2:
        return TestDataGenerator.generateTestCase2();
      case 3:
        return TestDataGenerator.generateTestCase3();
      default:
        return TestDataGenerator.generateTestCase1();
    }
  }

  /**
   * Generates a custom test case with random data.
   *
   * This is useful for stress testing and generating larger datasets.
   *
   * @param count - Number of students to generate
   * @returns An array of randomly generated students
   */
  public static generateRandomTestCase(count: number): UniversityStudent[] {
    const students: UniversityStudent[] = [];
    const names = [
      'Alice',
      'Bob',
      'Charlie',
      'Dana',
      'Evan',
      'Frank',
      'Grace',
      'Henry',
      'Iris',
      'Jack',
      'Kim',
      'Leo',
      'Mia',
      'Noah',
      'Olivia',
      'Peter',
      'Quinn',
      'Rachel',
      'Sam',
      'Tina',
    ];
    const majors = ['Computer Science', 'Mathematics', 'Economics', 'Biology', 'Chemistry', 'History', 'Physics', 'Engineering'];
    const companies = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook', 'Tesla', 'Netflix', 'Adobe', 'Intel', 'IBM'];
    const genders = ['Male', 'Female'];

    for (let i = 0; i < count; i++) {
      const name = i < names.length ? names[i] : `Student${i + 1}`;
      const age = 18 + Math.floor(Math.random() * 8); // 18-25
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const year = 1 + Math.floor(Math.random() * 4); // 1-4
      const major = majors[Math.floor(Math.random() * majors.length)];
      const gpa = 2.0 + Math.random() * 2.0; // 2.0-4.0

      // Random roommate preferences (0-3 preferences)
      const prefCount = Math.floor(Math.random() * 4);
      const roommatePreferences: string[] = [];
      for (let j = 0; j < prefCount; j++) {
        const randomIndex = Math.floor(Math.random() * names.length);
        const prefName = names[randomIndex];
        if (prefName !== name && !roommatePreferences.includes(prefName)) {
          roommatePreferences.push(prefName);
        }
      }

      // Random internships (0-2 internships)
      const internCount = Math.floor(Math.random() * 3);
      const previousInternships: string[] = [];
      for (let j = 0; j < internCount; j++) {
        const randomIndex = Math.floor(Math.random() * companies.length);
        const company = companies[randomIndex];
        if (!previousInternships.includes(company)) {
          previousInternships.push(company);
        }
      }

      students.push(
        new UniversityStudent(
          name,
          age,
          gender,
          year,
          major,
          parseFloat(gpa.toFixed(1)),
          roommatePreferences,
          previousInternships
        )
      );
    }

    return students;
  }
}
