import java.util.*;

/**
 * Abstract base class representing a student in the Longhorn Network.
 * This class provides the foundation for student-related functionality,
 * including connection strength calculation and student attributes.
 * 
 * @author LonghornNetwork Team
 * @version 1.0
 */
public abstract class Student {
    /** The name of the student */
    protected String name;
    
    /** The age of the student */
    protected int age;
    
    /** The gender of the student */
    protected String gender;
    
    /** The academic year of the student (1-4) */
    protected int year;
    
    /** The major field of study */
    protected String major;
    
    /** The grade point average (GPA) of the student */
    protected double gpa;
    
    /** List of preferred roommate names in order of preference */
    protected List<String> roommatePreferences;
    
    /** List of previous internship company names */
    protected List<String> previousInternships;

    /**
     * Calculates the connection strength between this student and another student.
     * Connection strength is based on shared attributes such as roommate status,
     * shared internships, same major, and same age.
     * 
     * @param other The other student to calculate connection strength with
     * @return An integer representing the connection strength (higher values indicate stronger connections)
     */
    public abstract int calculateConnectionStrength(Student other);
}
