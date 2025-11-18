/**
 * Thread class for simulating friend request operations between students.
 * This class implements Runnable to allow concurrent friend request processing
 * in a thread-safe manner.
 * 
 * @author LonghornNetwork Team
 * @version 1.0
 */
public class FriendRequestThread implements Runnable {
    /** The student sending the friend request */
    private UniversityStudent sender;
    
    /** The student receiving the friend request */
    private UniversityStudent receiver;
    
    /**
     * Constructs a FriendRequestThread to send a friend request from sender to receiver.
     * 
     * @param sender The UniversityStudent sending the friend request
     * @param receiver The UniversityStudent receiving the friend request
     */
    public FriendRequestThread(UniversityStudent sender, UniversityStudent receiver) {
        this.sender = sender;
        this.receiver = receiver;
    }

    /**
     * Executes the friend request operation in a separate thread.
     * This method adds the sender to the receiver's friend list and vice versa
     * in a thread-safe manner, ensuring proper synchronization when multiple
     * friend requests are processed concurrently.
     */
    @Override
    public void run() {
        // Use synchronized blocks to ensure thread-safe friend list updates
        // Lock on sender first, then receiver (consistent ordering to avoid deadlock)
        UniversityStudent first = sender.name.compareTo(receiver.name) < 0 ? sender : receiver;
        UniversityStudent second = first == sender ? receiver : sender;
        
        synchronized (first) {
            synchronized (second) {
                // Add receiver to sender's friend list
                sender.addFriend(receiver);
                // Add sender to receiver's friend list
                receiver.addFriend(sender);
                System.out.println(sender.name + " sent a friend request to " + receiver.name);
            }
        }
    }
}
