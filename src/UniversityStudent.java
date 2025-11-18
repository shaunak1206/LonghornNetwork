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
    /** The current roommate of this student */
    private UniversityStudent roommate;
    
    /** List of friends (other students) */
    private List<UniversityStudent> friends;
    
    /** Chat history with other students, mapped by student to list of messages */
    private Map<UniversityStudent, List<String>> chatHistory;
    
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
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.year = year;
        this.major = major;
        this.gpa = gpa;
        this.roommatePreferences = new ArrayList<>(roommatePreferences);
        this.previousInternships = new ArrayList<>(previousInternships);
        this.roommate = null;
        this.friends = new ArrayList<>();
        this.chatHistory = new HashMap<>();
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
        if (!(other instanceof UniversityStudent)) {
            return 0;
        }
        
        UniversityStudent otherStudent = (UniversityStudent) other;
        int strength = 0;
        
        // Roommate: Add 4 if they are roommates
        if (this.roommate != null && this.roommate.equals(otherStudent)) {
            strength += 4;
        }
        
        // Shared Internships: Add 3 for each shared internship
        for (String internship : this.previousInternships) {
            if (otherStudent.previousInternships.contains(internship) && 
                !internship.equals("None") && !internship.isEmpty()) {
                strength += 3;
            }
        }
        
        // Same Major: Add 2 if they share the same major
        if (this.major != null && this.major.equals(otherStudent.major)) {
            strength += 2;
        }
        
        // Same Age: Add 1 if they are the same age
        if (this.age == otherStudent.age) {
            strength += 1;
        }
        
        return strength;
    }

    /**
     * Gets the current roommate of this student.
     * 
     * @return The UniversityStudent who is the roommate, or null if no roommate is assigned
     */
    public UniversityStudent getRoommate() {
        return roommate;
    }
    
    /**
     * Sets the roommate for this student.
     * 
     * @param roommate The student to set as roommate
     */
    public void setRoommate(UniversityStudent roommate) {
        this.roommate = roommate;
    }
    
    /**
     * Gets the list of friends.
     * 
     * @return The list of friends
     */
    public List<UniversityStudent> getFriends() {
        return friends;
    }
    
    /**
     * Adds a friend to this student's friend list.
     * 
     * @param friend The student to add as a friend
     */
    public void addFriend(UniversityStudent friend) {
        if (!friends.contains(friend)) {
            friends.add(friend);
        }
    }
    
    /**
     * Gets the chat history with a specific student.
     * 
     * @param student The student to get chat history with
     * @return The list of messages, or null if no chat history exists
     */
    public List<String> getChatHistory(UniversityStudent student) {
        return chatHistory.get(student);
    }
    
    /**
     * Adds a message to the chat history with a specific student.
     * 
     * @param student The student to add message to chat history with
     * @param message The message to add
     */
    public void addChatMessage(UniversityStudent student, String message) {
        chatHistory.putIfAbsent(student, new ArrayList<>());
        chatHistory.get(student).add(message);
    }

    /**
     * Returns a string representation of this UniversityStudent.
     * 
     * @return A string containing the student's information
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Name: ").append(name).append("\n");
        sb.append("Age: ").append(age).append("\n");
        sb.append("Gender: ").append(gender).append("\n");
        sb.append("Year: ").append(year).append("\n");
        sb.append("Major: ").append(major).append("\n");
        sb.append("GPA: ").append(gpa).append("\n");
        sb.append("RoommatePreferences: ");
        if (roommatePreferences.isEmpty()) {
            sb.append("None");
        } else {
            sb.append(String.join(", ", roommatePreferences));
        }
        sb.append("\n");
        sb.append("PreviousInternships: ");
        if (previousInternships.isEmpty()) {
            sb.append("None");
        } else {
            sb.append(String.join(", ", previousInternships));
        }
        return sb.toString();
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        UniversityStudent that = (UniversityStudent) obj;
        return name != null && name.equals(that.name);
    }
    
    @Override
    public int hashCode() {
        return name != null ? name.hashCode() : 0;
    }
}

