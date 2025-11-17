import java.util.*;

/**
 * Concrete implementation of a Student representing a university student
 * in the Longhorn Network. This class extends the abstract Student class
 * and implements the connection strength calculation algorithm.
 * 
 * @author LonghornNetwork Team
 * @version 1.0
 */
public class UniversityStudent extends Student {
    /**
     * Constructs a new UniversityStudent with the specified attributes.
     * 
     * @param name The name of the student
     * @param age The age of the student
     * @param gender The gender of the student
     * @param year The academic year (1-4)
     * @param major The major field of study
     * @param gpa The grade point average
     * @param roommatePreferences List of preferred roommate names in order of preference
     * @param previousInternships List of previous internship company names
     */
    public UniversityStudent(String name, int age, String gender, int year, 
                            String major, double gpa, 
                            List<String> roommatePreferences, 
                            List<String> previousInternships) {
        // TODO: Constructor implementation
    }

    /**
     * Calculates the connection strength between this student and another student.
     * The connection strength is calculated based on the following criteria:
     * - Roommate: Add 4 if they are roommates
     * - Shared Internships: Add 3 for each shared internship
     * - Same Major: Add 2 if they share the same major
     * - Same Age: Add 1 if they are the same age
     * 
     * @param other The other student to calculate connection strength with
     * @return An integer representing the connection strength (0 or higher)
     */
    @Override
    public int calculateConnectionStrength(Student other) {
        // TODO: Implementation
        return 0;
    }

    /**
     * Gets the current roommate of this student.
     * 
     * @return The UniversityStudent who is the roommate, or null if no roommate is assigned
     */
    public UniversityStudent getRoommate() {
        // TODO: Implementation
        return null;
    }

    /**
     * Returns a string representation of this UniversityStudent.
     * 
     * @return A string containing the student's information
     */
    @Override
    public String toString() {
        // TODO: Implementation
        return "";
    }
}

