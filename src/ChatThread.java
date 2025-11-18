/**
 * Thread class for simulating chat/messaging operations between students.
 * This class implements Runnable to allow concurrent message processing
 * in a thread-safe manner, updating chat histories between students.
 * 
 * @author LonghornNetwork Team
 * @version 1.0
 */
public class ChatThread implements Runnable {
    /** The student sending the message */
    private UniversityStudent sender;
    
    /** The student receiving the message */
    private UniversityStudent receiver;
    
    /** The message content to be sent */
    private String message;
    
    /**
     * Constructs a ChatThread to send a message from sender to receiver.
     * 
     * @param sender The UniversityStudent sending the message
     * @param receiver The UniversityStudent receiving the message
     * @param message The message content to be sent
     */
    public ChatThread(UniversityStudent sender, UniversityStudent receiver, String message) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
    }

    /**
     * Executes the chat operation in a separate thread.
     * This method updates the chat history between the sender and receiver
     * in a thread-safe manner, ensuring proper synchronization when multiple
     * messages are processed concurrently.
     */
    @Override
    public void run() {
        // Use synchronized blocks to ensure thread-safe chat history updates
        // Lock on sender first, then receiver (consistent ordering to avoid deadlock)
        UniversityStudent first = sender.name.compareTo(receiver.name) < 0 ? sender : receiver;
        UniversityStudent second = first == sender ? receiver : sender;
        
        synchronized (first) {
            synchronized (second) {
                // Add message to sender's chat history with receiver
                sender.addChatMessage(receiver, message);
                // Also add to receiver's chat history with sender for bidirectional history
                receiver.addChatMessage(sender, message);
            }
        }
    }
}
