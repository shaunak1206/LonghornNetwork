import java.io.*;
import java.util.*;

/**
 * Utility class for parsing student data from input files.
 * This class handles reading and parsing student information from text files
 * and creating UniversityStudent objects.
 * 
 * @author LonghornNetwork Team
 * @version 1.0
 */
public class DataParser {
    /**
     * Parses student information from a file and creates a list of UniversityStudent objects.
     * 
     * The input file format should follow this structure:
     * Student:
     * Name: [name]
     * Age: [age]
     * Gender: [gender]
     * Year: [year]
     * Major: [major]
     * GPA: [gpa]
     * RoommatePreferences: [comma-separated list]
     * PreviousInternships: [comma-separated list]
     * 
     * @param filename The path to the input file containing student data
     * @return A list of UniversityStudent objects parsed from the file
     * @throws IOException If an I/O error occurs while reading the file
     * @throws IllegalArgumentException If the file format is invalid or data is missing
     */
    public static List<UniversityStudent> parseStudents(String filename) throws IOException {
        List<UniversityStudent> students = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            String name = null;
            int age = 0;
            String gender = null;
            int year = 0;
            String major = null;
            double gpa = 0.0;
            List<String> roommatePreferences = new ArrayList<>();
            List<String> previousInternships = new ArrayList<>();
            
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                
                // Skip empty lines
                if (line.isEmpty()) {
                    continue;
                }
                
                // Check if this is the start of a new student
                if (line.equals("Student:")) {
                    // If we have a previous student, add it before starting a new one
                    if (name != null) {
                        students.add(new UniversityStudent(name, age, gender, year, major, gpa,
                                roommatePreferences, previousInternships));
                    }
                    // Reset for new student
                    name = null;
                    age = 0;
                    gender = null;
                    year = 0;
                    major = null;
                    gpa = 0.0;
                    roommatePreferences = new ArrayList<>();
                    previousInternships = new ArrayList<>();
                    continue;
                }
                
                // Parse fields
                if (line.startsWith("Name:")) {
                    name = line.substring(5).trim();
                } else if (line.startsWith("Age:")) {
                    try {
                        age = Integer.parseInt(line.substring(4).trim());
                    } catch (NumberFormatException e) {
                        throw new IllegalArgumentException("Invalid age format: " + line);
                    }
                } else if (line.startsWith("Gender:")) {
                    gender = line.substring(7).trim();
                } else if (line.startsWith("Year:")) {
                    try {
                        year = Integer.parseInt(line.substring(5).trim());
                    } catch (NumberFormatException e) {
                        throw new IllegalArgumentException("Invalid year format: " + line);
                    }
                } else if (line.startsWith("Major:")) {
                    major = line.substring(6).trim();
                } else if (line.startsWith("GPA:")) {
                    try {
                        gpa = Double.parseDouble(line.substring(4).trim());
                    } catch (NumberFormatException e) {
                        throw new IllegalArgumentException("Invalid GPA format: " + line);
                    }
                } else if (line.startsWith("RoommatePreferences:")) {
                    String prefs = line.substring(20).trim();
                    if (!prefs.isEmpty() && !prefs.equals("None")) {
                        String[] prefsArray = prefs.split(",");
                        for (String pref : prefsArray) {
                            String trimmed = pref.trim();
                            if (!trimmed.isEmpty()) {
                                roommatePreferences.add(trimmed);
                            }
                        }
                    }
                } else if (line.startsWith("PreviousInternships:")) {
                    String internships = line.substring(20).trim();
                    if (!internships.isEmpty() && !internships.equals("None")) {
                        String[] internshipsArray = internships.split(",");
                        for (String internship : internshipsArray) {
                            String trimmed = internship.trim();
                            if (!trimmed.isEmpty()) {
                                previousInternships.add(trimmed);
                            }
                        }
                    }
                }
            }
            
            // Add the last student
            if (name != null) {
                students.add(new UniversityStudent(name, age, gender, year, major, gpa,
                        roommatePreferences, previousInternships));
            }
        }
        
        return students;
    }
}
