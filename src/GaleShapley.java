import java.util.*;

/**
 * Implements the Gale-Shapley stable matching algorithm for roommate assignment.
 * This algorithm ensures that students are matched with roommates based on their
 * preferences in a stable manner, where no two students would prefer each other
 * over their current assignments.
 * 
 * @author LonghornNetwork Team
 * @version 1.0
 */
public class GaleShapley {
    /**
     * Assigns roommates to students using the Gale-Shapley stable matching algorithm.
     * 
     * The algorithm works as follows:
     * 1. Each student with preferences proposes to their most preferred roommate
     * 2. A proposal is accepted if the receiver is unpaired or prefers the proposer
     *    over their current roommate
     * 3. The process continues until all students are paired or have no more preferences
     * 
     * Students without preferences will remain unpaired.
     * 
     * @param students The list of UniversityStudent objects to match as roommates
     */
    public static void assignRoommates(List<UniversityStudent> students) {
        // Create a map from student names to student objects for quick lookup
        Map<String, UniversityStudent> studentMap = new HashMap<>();
        for (UniversityStudent student : students) {
            studentMap.put(student.name, student);
        }
        
        // Initialize: all students start unpaired
        for (UniversityStudent student : students) {
            student.setRoommate(null);
        }
        
        // Queue of unpaired students who still have preferences
        // Only add students who are unpaired and have preferences
        Queue<UniversityStudent> unpairedQueue = new LinkedList<>();
        for (UniversityStudent student : students) {
            if (!student.roommatePreferences.isEmpty() && student.getRoommate() == null) {
                unpairedQueue.offer(student);
            }
        }
        
        // Track how many preferences each student has proposed to
        Map<UniversityStudent, Integer> proposalIndex = new HashMap<>();
        for (UniversityStudent student : students) {
            proposalIndex.put(student, 0);
        }
        
        // Process proposals until queue is empty
        while (!unpairedQueue.isEmpty()) {
            UniversityStudent proposer = unpairedQueue.poll();
            
            // Skip if proposer has no more preferences
            int currentIndex = proposalIndex.get(proposer);
            if (currentIndex >= proposer.roommatePreferences.size()) {
                continue; // No more preferences, remains unpaired
            }
            
            // Get the next preferred roommate
            String preferredName = proposer.roommatePreferences.get(currentIndex);
            UniversityStudent receiver = studentMap.get(preferredName);
            
            // Increment proposal index for next time
            proposalIndex.put(proposer, currentIndex + 1);
            
            if (receiver == null) {
                // Preferred roommate doesn't exist, continue to next preference
                unpairedQueue.offer(proposer);
                continue;
            }
            
            // Check if receiver is unpaired
            if (receiver.getRoommate() == null) {
                // Receiver accepts the proposal only if they have proposer in preferences
                // or if they have no preferences (edge case)
                if (receiver.roommatePreferences.isEmpty() || 
                    receiver.roommatePreferences.contains(proposer.name)) {
                    // Clear proposer's old pairing if they have one
                    if (proposer.getRoommate() != null) {
                        UniversityStudent oldRoommate = proposer.getRoommate();
                        proposer.setRoommate(null);
                        oldRoommate.setRoommate(null);
                        // Add old roommate back to queue if they are unpaired and have more preferences
                        if (oldRoommate.getRoommate() == null && 
                            proposalIndex.get(oldRoommate) < oldRoommate.roommatePreferences.size()) {
                            unpairedQueue.offer(oldRoommate);
                        }
                    }
                    // Create new pairing
                    proposer.setRoommate(receiver);
                    receiver.setRoommate(proposer);
                } else {
                    // Receiver doesn't have proposer in preferences, reject
                    // Add proposer back to queue only if they are unpaired and have more preferences
                    if (proposer.getRoommate() == null && 
                        proposalIndex.get(proposer) < proposer.roommatePreferences.size()) {
                        unpairedQueue.offer(proposer);
                    }
                }
            } else {
                // Receiver is already paired, check if they prefer proposer
                UniversityStudent currentRoommate = receiver.getRoommate();
                
                // Check if receiver has proposer in preferences
                boolean hasProposer = receiver.roommatePreferences.contains(proposer.name);
                boolean hasCurrent = receiver.roommatePreferences.contains(currentRoommate.name);
                
                // If receiver doesn't have proposer in preferences, reject
                if (!hasProposer) {
                    // Add proposer back to queue only if they are unpaired and have more preferences
                    if (proposer.getRoommate() == null && 
                        proposalIndex.get(proposer) < proposer.roommatePreferences.size()) {
                        unpairedQueue.offer(proposer);
                    }
                    continue;
                }
                
                // If receiver doesn't have current roommate in preferences, accept proposer
                if (!hasCurrent || prefersOver(receiver, proposer, currentRoommate)) {
                    // Clear proposer's old pairing if they have one
                    if (proposer.getRoommate() != null) {
                        UniversityStudent oldProposerRoommate = proposer.getRoommate();
                        proposer.setRoommate(null);
                        oldProposerRoommate.setRoommate(null);
                        // Add old roommate back to queue if they are unpaired and have more preferences
                        if (oldProposerRoommate.getRoommate() == null && 
                            proposalIndex.get(oldProposerRoommate) < oldProposerRoommate.roommatePreferences.size()) {
                            unpairedQueue.offer(oldProposerRoommate);
                        }
                    }
                    // Break receiver's current pairing
                    currentRoommate.setRoommate(null);
                    // Add old roommate back to queue if they are unpaired and have more preferences
                    if (currentRoommate.getRoommate() == null && 
                        proposalIndex.get(currentRoommate) < currentRoommate.roommatePreferences.size()) {
                        unpairedQueue.offer(currentRoommate);
                    }
                    // Create new pairing
                    proposer.setRoommate(receiver);
                    receiver.setRoommate(proposer);
                } else {
                    // Receiver prefers current roommate, proposer remains unpaired
                    // Add proposer back to queue only if they are unpaired and have more preferences
                    if (proposer.getRoommate() == null && 
                        proposalIndex.get(proposer) < proposer.roommatePreferences.size()) {
                        unpairedQueue.offer(proposer);
                    }
                }
            }
        }
    }
    
    /**
     * Checks if a student prefers student1 over student2 based on their preference list.
     * 
     * @param student The student whose preferences we're checking
     * @param student1 The first student to compare
     * @param student2 The second student to compare
     * @return true if student prefers student1 over student2, false otherwise
     */
    private static boolean prefersOver(UniversityStudent student, UniversityStudent student1, UniversityStudent student2) {
        int index1 = student.roommatePreferences.indexOf(student1.name);
        int index2 = student.roommatePreferences.indexOf(student2.name);
        
        // If student1 is not in preferences, return false
        if (index1 == -1) {
            return false;
        }
        
        // If student2 is not in preferences, return true
        if (index2 == -1) {
            return true;
        }
        
        // Lower index means higher preference
        return index1 < index2;
    }
}
