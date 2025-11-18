import javax.swing.*;
import javax.swing.border.TitledBorder;
import java.awt.*;
import java.util.*;
import java.util.List;
import java.util.concurrent.*;

/**
 * Main Swing UI for the Longhorn Network application.
 * Provides visualization of student graph, roommates, pods, referral paths,
 * and student details including friends and chat history.
 * 
 * @author LonghornNetwork Team
 * @version 1.0
 */
public class LonghornNetworkUI extends JFrame {
    private List<UniversityStudent> currentStudents;
    private StudentGraph currentGraph;
    private JPanel graphPanel;
    private JPanel roommatePanel;
    private JPanel podPanel;
    private JPanel referralPanel;
    private JPanel studentDetailsPanel;
    private JComboBox<String> studentSelector;
    private JComboBox<String> testCaseSelector;
    private JTextField companyField;
    private JTextArea outputArea;
    
    public LonghornNetworkUI() {
        setTitle("Longhorn Network - Student Social Network Visualization");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1400, 900);
        setLocationRelativeTo(null);
        
        currentStudents = new ArrayList<>();
        
        createUI();
    }
    
    private void createUI() {
        setLayout(new BorderLayout());
        
        // Top control panel
        JPanel controlPanel = createControlPanel();
        add(controlPanel, BorderLayout.NORTH);
        
        // Main content area with tabs
        JTabbedPane tabbedPane = new JTabbedPane();
        
        // Graph visualization tab
        graphPanel = createGraphPanel();
        tabbedPane.addTab("Student Graph", graphPanel);
        
        // Roommate visualization tab
        JPanel rmPanel = createRoommatePanel();
        roommatePanel = rmPanel; // Store reference
        tabbedPane.addTab("Roommates", rmPanel);
        
        // Pod formation tab
        JPanel pdPanel = createPodPanel();
        podPanel = pdPanel; // Store reference
        tabbedPane.addTab("Pod Formation", pdPanel);
        
        // Referral path finder tab
        JPanel refPanel = createReferralPanel();
        referralPanel = refPanel; // Store reference
        tabbedPane.addTab("Referral Paths", refPanel);
        
        // Student details tab
        JPanel detailPanel = createStudentDetailsPanel();
        studentDetailsPanel = detailPanel; // Store reference
        tabbedPane.addTab("Student Details", detailPanel);
        
        add(tabbedPane, BorderLayout.CENTER);
        
        // Output area at bottom
        outputArea = new JTextArea(5, 80);
        outputArea.setEditable(false);
        outputArea.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 12));
        outputArea.setBackground(new Color(255, 255, 255));
        outputArea.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
        JScrollPane scrollPane = new JScrollPane(outputArea);
        scrollPane.setBorder(BorderFactory.createTitledBorder(
            BorderFactory.createEtchedBorder(),
            "Output Log",
            TitledBorder.LEFT,
            TitledBorder.TOP,
            new Font(Font.SANS_SERIF, Font.BOLD, 12),
            new Color(70, 130, 180)
        ));
        add(scrollPane, BorderLayout.SOUTH);
    }
    
    private JPanel createControlPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder(
            BorderFactory.createEtchedBorder(), 
            "Controls", 
            TitledBorder.LEFT, 
            TitledBorder.TOP,
            new Font(Font.SANS_SERIF, Font.BOLD, 14),
            new Color(70, 130, 180)
        ));
        panel.setBackground(new Color(248, 250, 252));
        panel.setPreferredSize(new Dimension(1400, 70));
        
        // Main button panel with flow layout
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 12));
        buttonPanel.setBackground(new Color(248, 250, 252));
        
        // Test case selector
        buttonPanel.add(new JLabel("Test Case:"));
        testCaseSelector = new JComboBox<>(new String[]{"Test Case 1", "Test Case 2", "Test Case 3"});
        testCaseSelector.setSelectedIndex(0);
        testCaseSelector.setPreferredSize(new Dimension(120, 25));
        buttonPanel.add(testCaseSelector);
        
        // Add spacing
        buttonPanel.add(Box.createHorizontalStrut(20));
        
        // Load data button
        JButton loadButton = new JButton("Load Data");
        loadButton.setBackground(new Color(173, 216, 230)); // Light blue
        loadButton.setForeground(Color.BLACK);
        loadButton.setPreferredSize(new Dimension(120, 35));
        loadButton.setOpaque(true);
        loadButton.setBorderPainted(true);
        loadButton.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 12));
        loadButton.addActionListener(e -> loadTestData());
        buttonPanel.add(loadButton);
        
        // Run roommate matching button
        JButton roommateButton = new JButton("Match Roommates");
        roommateButton.setBackground(new Color(144, 238, 144)); // Light green
        roommateButton.setForeground(Color.BLACK);
        roommateButton.setPreferredSize(new Dimension(150, 35));
        roommateButton.setOpaque(true);
        roommateButton.setBorderPainted(true);
        roommateButton.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 12));
        roommateButton.addActionListener(e -> runRoommateMatching());
        buttonPanel.add(roommateButton);
        
        // Run pod formation button
        JButton podButton = new JButton("Form Pods");
        podButton.setBackground(new Color(255, 218, 185)); // Peach
        podButton.setForeground(Color.BLACK);
        podButton.setPreferredSize(new Dimension(120, 35));
        podButton.setOpaque(true);
        podButton.setBorderPainted(true);
        podButton.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 12));
        podButton.addActionListener(e -> runPodFormation());
        buttonPanel.add(podButton);
        
        // Refresh button
        JButton refreshButton = new JButton("Refresh All");
        refreshButton.setBackground(new Color(221, 160, 221)); // Plum
        refreshButton.setForeground(Color.BLACK);
        refreshButton.setPreferredSize(new Dimension(120, 35));
        refreshButton.setOpaque(true);
        refreshButton.setBorderPainted(true);
        refreshButton.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 12));
        refreshButton.addActionListener(e -> refreshAll());
        buttonPanel.add(refreshButton);
        
        // Test social interactions button (runs friend requests and chats like Main.java)
        buttonPanel.add(Box.createHorizontalStrut(20));
        JButton testSocialButton = new JButton("Test Social (Add Friends/Chats)");
        testSocialButton.setBackground(new Color(255, 20, 147)); // Deep pink
        testSocialButton.setForeground(Color.BLACK);
        testSocialButton.setPreferredSize(new Dimension(200, 35));
        testSocialButton.setOpaque(true);
        testSocialButton.setBorderPainted(true);
        testSocialButton.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 12));
        testSocialButton.addActionListener(e -> runTestSocialInteractions());
        buttonPanel.add(testSocialButton);
        
        panel.add(buttonPanel, BorderLayout.CENTER);
        
        return panel;
    }
    
    private JPanel createGraphPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder(
            BorderFactory.createEtchedBorder(),
            "Student Graph Visualization",
            TitledBorder.LEFT,
            TitledBorder.TOP,
            new Font(Font.SANS_SERIF, Font.BOLD, 13),
            new Color(70, 130, 180)
        ));
        panel.setBackground(new Color(250, 250, 255));
        
        JPanel graphVisualization = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                if (currentGraph != null) {
                    drawGraph(g);
                } else {
                    g.setColor(Color.GRAY);
                    g.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 16));
                    String message = "Load data to visualize graph";
                    FontMetrics fm = g.getFontMetrics();
                    int x = (getWidth() - fm.stringWidth(message)) / 2;
                    int y = getHeight() / 2;
                    g.drawString(message, x, y);
                }
            }
        };
        graphVisualization.setPreferredSize(new Dimension(1200, 600));
        graphVisualization.setBackground(new Color(255, 255, 255));
        
        JScrollPane scrollPane = new JScrollPane(graphVisualization);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        return panel;
    }
    
    private void drawGraph(Graphics g) {
        Graphics2D g2d = (Graphics2D) g;
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        Collection<UniversityStudent> nodes = currentGraph.getAllNodes();
        if (nodes.isEmpty()) return;
        
        // Calculate node positions in a circle
        int centerX = 600;
        int centerY = 300;
        int radius = 200;
        Map<UniversityStudent, Point> positions = new HashMap<>();
        
        List<UniversityStudent> nodeList = new ArrayList<>(nodes);
        double angleStep = 2 * Math.PI / nodeList.size();
        
        for (int i = 0; i < nodeList.size(); i++) {
            double angle = i * angleStep;
            int x = (int) (centerX + radius * Math.cos(angle));
            int y = (int) (centerY + radius * Math.sin(angle));
            positions.put(nodeList.get(i), new Point(x, y));
        }
        
        // Draw edges
        g2d.setStroke(new BasicStroke(2));
        for (UniversityStudent student : nodeList) {
            Point p1 = positions.get(student);
            List<StudentGraph.Edge> edges = currentGraph.getNeighbors(student);
            for (StudentGraph.Edge edge : edges) {
                Point p2 = positions.get(edge.neighbor);
                if (p1.x < p2.x || (p1.x == p2.x && p1.y < p2.y)) { // Draw each edge once
                    // Color based on weight
                    int weight = edge.weight;
                    Color edgeColor = new Color(
                        Math.min(255, 100 + weight * 20),
                        Math.min(255, 150 + weight * 10),
                        Math.max(0, 200 - weight * 15)
                    );
                    g2d.setColor(edgeColor);
                    g2d.drawLine(p1.x, p1.y, p2.x, p2.y);
                    
                    // Draw weight label
                    int midX = (p1.x + p2.x) / 2;
                    int midY = (p1.y + p2.y) / 2;
                    g2d.setColor(Color.BLACK);
                    g2d.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 10));
                    g2d.drawString(String.valueOf(weight), midX, midY);
                }
            }
        }
        
        // Draw nodes
        for (Map.Entry<UniversityStudent, Point> entry : positions.entrySet()) {
            Point p = entry.getValue();
            UniversityStudent student = entry.getKey();
            
            // Draw node circle with gradient effect
            g2d.setColor(new Color(100, 149, 237)); // Cornflower blue
            g2d.fillOval(p.x - 25, p.y - 25, 50, 50);
            g2d.setColor(new Color(70, 130, 180)); // Steel blue border
            g2d.setStroke(new BasicStroke(3));
            g2d.drawOval(p.x - 25, p.y - 25, 50, 50);
            
            // Draw student name
            g2d.setColor(Color.BLACK);
            g2d.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 11));
            FontMetrics fm = g2d.getFontMetrics();
            int textWidth = fm.stringWidth(student.name);
            g2d.drawString(student.name, p.x - textWidth / 2, p.y + 5);
        }
    }
    
    private JPanel createRoommatePanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder(
            BorderFactory.createEtchedBorder(),
            "Roommate Assignments",
            TitledBorder.LEFT,
            TitledBorder.TOP,
            new Font(Font.SANS_SERIF, Font.BOLD, 13),
            new Color(34, 139, 34)
        ));
        panel.setBackground(new Color(250, 255, 250));
        
        JTextArea textArea = new JTextArea();
        textArea.setEditable(false);
        textArea.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 14));
        textArea.setBackground(new Color(255, 255, 255));
        textArea.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        JScrollPane scrollPane = new JScrollPane(textArea);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        // Store reference for updates
        panel.putClientProperty("textArea", textArea);
        
        return panel;
    }
    
    private JPanel createPodPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder(
            BorderFactory.createEtchedBorder(),
            "Pod Formation",
            TitledBorder.LEFT,
            TitledBorder.TOP,
            new Font(Font.SANS_SERIF, Font.BOLD, 13),
            new Color(255, 140, 0)
        ));
        panel.setBackground(new Color(255, 250, 245));
        
        JPanel inputPanel = new JPanel(new FlowLayout());
        inputPanel.add(new JLabel("Pod Size:"));
        JSpinner podSizeSpinner = new JSpinner(new SpinnerNumberModel(3, 2, 10, 1));
        inputPanel.add(podSizeSpinner);
        JButton formButton = new JButton("Form Pods");
        formButton.setBackground(new Color(255, 218, 185)); // Peach
        formButton.setForeground(Color.BLACK);
        formButton.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 12));
        formButton.setOpaque(true);
        formButton.setBorderPainted(true);
        formButton.addActionListener(e -> {
            int size = (Integer) podSizeSpinner.getValue();
            runPodFormationWithSize(size);
        });
        inputPanel.add(formButton);
        panel.add(inputPanel, BorderLayout.NORTH);
        
        JTextArea textArea = new JTextArea();
        textArea.setEditable(false);
        textArea.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 14));
        textArea.setBackground(new Color(255, 255, 255));
        textArea.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        JScrollPane scrollPane = new JScrollPane(textArea);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        panel.putClientProperty("textArea", textArea);
        
        return panel;
    }
    
    private JPanel createReferralPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder(
            BorderFactory.createEtchedBorder(),
            "Referral Path Finder",
            TitledBorder.LEFT,
            TitledBorder.TOP,
            new Font(Font.SANS_SERIF, Font.BOLD, 13),
            new Color(220, 20, 60)
        ));
        panel.setBackground(new Color(255, 245, 250));
        
        JPanel inputPanel = new JPanel(new FlowLayout());
        inputPanel.add(new JLabel("Start Student:"));
        studentSelector = new JComboBox<>();
        inputPanel.add(studentSelector);
        
        inputPanel.add(new JLabel("Target Company:"));
        companyField = new JTextField(15);
        inputPanel.add(companyField);
        
        JButton findButton = new JButton("Find Path");
        findButton.setBackground(new Color(255, 182, 193)); // Light pink
        findButton.setForeground(Color.BLACK);
        findButton.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 12));
        findButton.setOpaque(true);
        findButton.setBorderPainted(true);
        findButton.addActionListener(e -> findReferralPath());
        inputPanel.add(findButton);
        
        panel.add(inputPanel, BorderLayout.NORTH);
        
        JTextArea textArea = new JTextArea();
        textArea.setEditable(false);
        textArea.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 14));
        textArea.setBackground(new Color(255, 255, 255));
        textArea.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        JScrollPane scrollPane = new JScrollPane(textArea);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        panel.putClientProperty("textArea", textArea);
        
        return panel;
    }
    
    private JPanel createStudentDetailsPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder(
            BorderFactory.createEtchedBorder(),
            "Student Details - Friends & Chat History",
            TitledBorder.LEFT,
            TitledBorder.TOP,
            new Font(Font.SANS_SERIF, Font.BOLD, 13),
            new Color(138, 43, 226)
        ));
        panel.setBackground(new Color(250, 250, 255));
        
        // Top panel with student selector - use BoxLayout to keep everything on one line
        JPanel selectorPanel = new JPanel();
        selectorPanel.setLayout(new BoxLayout(selectorPanel, BoxLayout.X_AXIS));
        selectorPanel.setBackground(new Color(250, 250, 255));
        selectorPanel.setBorder(BorderFactory.createEmptyBorder(5, 10, 5, 10));
        selectorPanel.add(new JLabel("Select Student:"));
        
        // Declare selectors first
        JComboBox<String> detailStudentSelector = new JComboBox<>();
        detailStudentSelector.setPreferredSize(new Dimension(120, 25));
        detailStudentSelector.setMaximumSize(new Dimension(120, 25));
        JComboBox<String> friendTargetSelector = new JComboBox<>();
        friendTargetSelector.setPreferredSize(new Dimension(120, 25));
        friendTargetSelector.setMaximumSize(new Dimension(120, 25));
        JComboBox<String> chatTargetSelector = new JComboBox<>();
        chatTargetSelector.setPreferredSize(new Dimension(120, 25));
        chatTargetSelector.setMaximumSize(new Dimension(120, 25));
        JTextField messageField = new JTextField(20);
        messageField.setPreferredSize(new Dimension(150, 25));
        messageField.setMaximumSize(new Dimension(150, 25));
        
        // Set up action listener after all variables are declared
        detailStudentSelector.addActionListener(e -> {
            updateStudentDetails(detailStudentSelector);
            updateFriendAndChatSelectors(detailStudentSelector, friendTargetSelector, chatTargetSelector);
        });
        selectorPanel.add(detailStudentSelector);
        selectorPanel.add(Box.createHorizontalStrut(10));
        
        // Friend request controls
        selectorPanel.add(new JLabel("Send Friend Request to:"));
        selectorPanel.add(Box.createHorizontalStrut(5));
        selectorPanel.add(friendTargetSelector);
        selectorPanel.add(Box.createHorizontalStrut(5));
        JButton sendFriendButton = new JButton("Send Request");
        sendFriendButton.setBackground(new Color(144, 238, 144));
        sendFriendButton.setForeground(Color.BLACK);
        sendFriendButton.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 11));
        sendFriendButton.setOpaque(true);
        sendFriendButton.setBorderPainted(true);
        sendFriendButton.addActionListener(e -> sendFriendRequest(detailStudentSelector, friendTargetSelector));
        selectorPanel.add(sendFriendButton);
        
        // Chat message controls
        selectorPanel.add(Box.createHorizontalStrut(20));
        selectorPanel.add(new JLabel("Send Message to:"));
        selectorPanel.add(Box.createHorizontalStrut(5));
        selectorPanel.add(chatTargetSelector);
        selectorPanel.add(Box.createHorizontalStrut(5));
        selectorPanel.add(messageField);
        selectorPanel.add(Box.createHorizontalStrut(5));
        JButton sendMessageButton = new JButton("Send Message");
        sendMessageButton.setBackground(new Color(255, 182, 193));
        sendMessageButton.setForeground(Color.BLACK);
        sendMessageButton.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 11));
        sendMessageButton.setOpaque(true);
        sendMessageButton.setBorderPainted(true);
        sendMessageButton.addActionListener(e -> sendChatMessage(detailStudentSelector, chatTargetSelector, messageField));
        selectorPanel.add(sendMessageButton);
        
        // Add glue to push everything to the left
        selectorPanel.add(Box.createHorizontalGlue());
        
        // Store selectors for later use
        panel.putClientProperty("selector", detailStudentSelector);
        panel.putClientProperty("friendTargetSelector", friendTargetSelector);
        panel.putClientProperty("chatTargetSelector", chatTargetSelector);
        panel.putClientProperty("messageField", messageField);
        
        // Wrap selector panel in scroll pane in case window is narrow
        JScrollPane selectorScrollPane = new JScrollPane(selectorPanel);
        selectorScrollPane.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);
        selectorScrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_NEVER);
        selectorScrollPane.setBorder(null);
        selectorScrollPane.setPreferredSize(new Dimension(1400, 50));
        
        panel.add(selectorScrollPane, BorderLayout.NORTH);
        
        JTextArea textArea = new JTextArea();
        textArea.setEditable(false);
        textArea.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));
        textArea.setBackground(new Color(255, 255, 255));
        textArea.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        JScrollPane scrollPane = new JScrollPane(textArea);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        panel.putClientProperty("textArea", textArea);
        panel.putClientProperty("selector", detailStudentSelector);
        
        return panel;
    }
    
    private void loadTestData() {
        int testCaseIndex = testCaseSelector.getSelectedIndex();
        try {
            switch (testCaseIndex) {
                case 0:
                    currentStudents = Main.generateTestCase1();
                    break;
                case 1:
                    currentStudents = Main.generateTestCase2();
                    break;
                case 2:
                    currentStudents = Main.generateTestCase3();
                    break;
            }
            
            currentGraph = new StudentGraph(currentStudents);
            
            // Update student selectors
            studentSelector.removeAllItems();
            @SuppressWarnings("unchecked")
            JComboBox<String> detailSelector = (JComboBox<String>) studentDetailsPanel.getClientProperty("selector");
            @SuppressWarnings("unchecked")
            JComboBox<String> friendSelector = (JComboBox<String>) studentDetailsPanel.getClientProperty("friendTargetSelector");
            @SuppressWarnings("unchecked")
            JComboBox<String> chatSelector = (JComboBox<String>) studentDetailsPanel.getClientProperty("chatTargetSelector");
            
            if (detailSelector != null) {
                detailSelector.removeAllItems();
            }
            if (friendSelector != null) {
                friendSelector.removeAllItems();
            }
            if (chatSelector != null) {
                chatSelector.removeAllItems();
            }
            
            for (UniversityStudent student : currentStudents) {
                studentSelector.addItem(student.name);
                if (detailSelector != null) {
                    detailSelector.addItem(student.name);
                }
            }
            
            // Update friend and chat selectors - always populate them if we have students
            if (detailSelector != null && detailSelector.getItemCount() > 0 && friendSelector != null && chatSelector != null) {
                detailSelector.setSelectedIndex(0); // Select first student
                updateFriendAndChatSelectors(detailSelector, friendSelector, chatSelector);
                updateStudentDetails(detailSelector); // Also update the details display
            }
            
            outputArea.append("Loaded Test Case " + (testCaseIndex + 1) + " with " + 
                            currentStudents.size() + " students.\n");
            outputArea.setCaretPosition(outputArea.getDocument().getLength());
            
            refreshAll();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error loading data: " + e.getMessage(), 
                                        "Error", JOptionPane.ERROR_MESSAGE);
            outputArea.append("Error: " + e.getMessage() + "\n");
        }
    }
    
    private void runRoommateMatching() {
        if (currentStudents == null || currentStudents.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please load data first!", 
                                        "No Data", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        GaleShapley.assignRoommates(currentStudents);
        
        // Rebuild graph after roommate matching since roommate status affects connection strength
        currentGraph = new StudentGraph(currentStudents);
        
        JTextArea textArea = (JTextArea) roommatePanel.getClientProperty("textArea");
        textArea.setText("=== Roommate Assignments ===\n\n");
        
        Map<UniversityStudent, Boolean> processed = new HashMap<>();
        for (UniversityStudent student : currentStudents) {
            processed.putIfAbsent(student, false);
        }
        
        int pairCount = 0;
        for (UniversityStudent student : currentStudents) {
            if (!processed.get(student)) {
                UniversityStudent roommate = student.getRoommate();
                if (roommate != null && !processed.get(roommate)) {
                    textArea.append("Pair " + (++pairCount) + ":\n");
                    textArea.append("  " + student.name + " <-> " + roommate.name + "\n");
                    textArea.append("  " + student.name + " preferences: " + 
                                  student.roommatePreferences + "\n");
                    textArea.append("  " + roommate.name + " preferences: " + 
                                  roommate.roommatePreferences + "\n\n");
                    processed.put(student, true);
                    processed.put(roommate, true);
                } else if (roommate == null && !student.roommatePreferences.isEmpty()) {
                    textArea.append("Unpaired: " + student.name + 
                                  " (has preferences but no match)\n\n");
                    processed.put(student, true);
                }
            }
        }
        
        outputArea.append("Roommate matching completed.\n");
        outputArea.setCaretPosition(outputArea.getDocument().getLength());
    }
    
    private void runPodFormation() {
        runPodFormationWithSize(3);
    }
    
    private void runPodFormationWithSize(int podSize) {
        if (currentGraph == null) {
            JOptionPane.showMessageDialog(this, "Please load data first!", 
                                        "No Data", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        PodFormation podFormation = new PodFormation(currentGraph);
        podFormation.formPods(podSize);
        
        JTextArea textArea = (JTextArea) podPanel.getClientProperty("textArea");
        textArea.setText("=== Pod Formation (Size: " + podSize + ") ===\n\n");
        
        List<List<UniversityStudent>> pods = podFormation.getPods();
        for (int i = 0; i < pods.size(); i++) {
            textArea.append("Pod " + (i + 1) + ":\n");
            List<UniversityStudent> pod = pods.get(i);
            for (int j = 0; j < pod.size(); j++) {
                textArea.append("  " + pod.get(j).name);
                if (j < pod.size() - 1) textArea.append(", ");
            }
            textArea.append("\n\n");
        }
        
        outputArea.append("Pod formation completed with size " + podSize + ".\n");
        outputArea.setCaretPosition(outputArea.getDocument().getLength());
    }
    
    private void findReferralPath() {
        if (currentGraph == null || currentStudents.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please load data first!", 
                                        "No Data", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        String studentName = (String) studentSelector.getSelectedItem();
        String company = companyField.getText().trim();
        
        if (studentName == null || company.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please select a student and enter a company name!", 
                                        "Invalid Input", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        UniversityStudent start = null;
        for (UniversityStudent s : currentStudents) {
            if (s.name.equals(studentName)) {
                start = s;
                break;
            }
        }
        
        if (start == null) {
            JOptionPane.showMessageDialog(this, "Student not found!", 
                                        "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }
        
        // Check if any student has this internship
        boolean companyExists = false;
        for (UniversityStudent s : currentStudents) {
            if (s.previousInternships.contains(company)) {
                companyExists = true;
                break;
            }
        }
        
        if (!companyExists) {
            JTextArea textArea = (JTextArea) referralPanel.getClientProperty("textArea");
            textArea.setText("=== Referral Path to " + company + " ===\n\n");
            textArea.append("Starting from: " + start.name + "\n\n");
            textArea.append("ERROR: No student in the current test case has interned at \"" + company + "\".\n\n");
            textArea.append("Available internships in current test case:\n");
            Set<String> allInternships = new HashSet<>();
            for (UniversityStudent s : currentStudents) {
                for (String internship : s.previousInternships) {
                    if (!internship.equals("None") && !internship.isEmpty()) {
                        allInternships.add(internship);
                    }
                }
            }
            if (allInternships.isEmpty()) {
                textArea.append("  (None)\n");
            } else {
                for (String internship : allInternships) {
                    textArea.append("  - " + internship + "\n");
                }
            }
            textArea.append("\nNote: \"DummyCompany\" exists in Test Case 2.\n");
            outputArea.append("Referral path search failed: Company not found in current test case.\n");
            outputArea.setCaretPosition(outputArea.getDocument().getLength());
            return;
        }
        
        ReferralPathFinder pathFinder = new ReferralPathFinder(currentGraph);
        List<UniversityStudent> path = pathFinder.findReferralPath(start, company);
        
        JTextArea textArea = (JTextArea) referralPanel.getClientProperty("textArea");
        textArea.setText("=== Referral Path to " + company + " ===\n\n");
        textArea.append("Starting from: " + start.name + "\n\n");
        
        if (path.isEmpty()) {
            textArea.append("No path found to a student who interned at " + company + ".\n");
            textArea.append("\nThis may occur if:\n");
            textArea.append("- The starting student is not connected to any student with this internship\n");
            textArea.append("- The graph is disconnected\n");
        } else {
            textArea.append("Path found (" + path.size() + " students):\n\n");
            for (int i = 0; i < path.size(); i++) {
                UniversityStudent student = path.get(i);
                textArea.append((i + 1) + ". " + student.name);
                if (student.previousInternships.contains(company)) {
                    textArea.append(" ✓ (has internship at " + company + ")");
                }
                textArea.append("\n");
                if (i < path.size() - 1) {
                    textArea.append("   ↓\n");
                }
            }
        }
        
        outputArea.append("Referral path search completed for " + company + ".\n");
        outputArea.setCaretPosition(outputArea.getDocument().getLength());
    }
    
    private void updateStudentDetails(JComboBox<String> selector) {
        if (currentStudents == null || currentStudents.isEmpty()) {
            return;
        }
        
        String studentName = (String) selector.getSelectedItem();
        if (studentName == null) return;
        
        UniversityStudent student = null;
        for (UniversityStudent s : currentStudents) {
            if (s.name.equals(studentName)) {
                student = s;
                break;
            }
        }
        
        if (student == null) return;
        
        JTextArea textArea = (JTextArea) studentDetailsPanel.getClientProperty("textArea");
        textArea.setText("=== Student Details: " + student.name + " ===\n\n");
        
        textArea.append("Basic Information:\n");
        textArea.append("  Age: " + student.age + "\n");
        textArea.append("  Gender: " + student.gender + "\n");
        textArea.append("  Year: " + student.year + "\n");
        textArea.append("  Major: " + student.major + "\n");
        textArea.append("  GPA: " + student.gpa + "\n\n");
        
        textArea.append("Roommate: ");
        UniversityStudent roommate = student.getRoommate();
        if (roommate != null) {
            textArea.append(roommate.name + "\n\n");
        } else {
            textArea.append("None\n\n");
        }
        
        textArea.append("Friends (" + student.getFriends().size() + "):\n");
        if (student.getFriends().isEmpty()) {
            textArea.append("  None\n\n");
        } else {
            for (UniversityStudent friend : student.getFriends()) {
                textArea.append("  - " + friend.name + "\n");
            }
            textArea.append("\n");
        }
        
        textArea.append("Chat History:\n");
        boolean hasChatHistory = false;
        for (UniversityStudent other : currentStudents) {
            if (other.equals(student)) continue;
            List<String> messages = student.getChatHistory(other);
            if (messages != null && !messages.isEmpty()) {
                hasChatHistory = true;
                textArea.append("  With " + other.name + ":\n");
                for (String message : messages) {
                    textArea.append("    - " + message + "\n");
                }
            }
        }
        if (!hasChatHistory) {
            textArea.append("  None\n");
        }
    }
    
    private void refreshAll() {
        if (currentGraph != null) {
            graphPanel.repaint();
        }
        
        if (currentStudents != null && !currentStudents.isEmpty()) {
            @SuppressWarnings("unchecked")
            JComboBox<String> detailSelector = (JComboBox<String>) studentDetailsPanel.getClientProperty("selector");
            if (detailSelector != null && detailSelector.getItemCount() > 0) {
                updateStudentDetails(detailSelector);
                @SuppressWarnings("unchecked")
                JComboBox<String> friendSelector = (JComboBox<String>) studentDetailsPanel.getClientProperty("friendTargetSelector");
                @SuppressWarnings("unchecked")
                JComboBox<String> chatSelector = (JComboBox<String>) studentDetailsPanel.getClientProperty("chatTargetSelector");
                if (friendSelector != null && chatSelector != null) {
                    updateFriendAndChatSelectors(detailSelector, friendSelector, chatSelector);
                }
            }
        }
    }
    
    private void updateFriendAndChatSelectors(JComboBox<String> senderSelector, 
                                             JComboBox<String> friendTargetSelector,
                                             JComboBox<String> chatTargetSelector) {
        if (currentStudents == null || currentStudents.isEmpty()) {
            return;
        }
        
        String senderName = (String) senderSelector.getSelectedItem();
        if (senderName == null) {
            friendTargetSelector.removeAllItems();
            chatTargetSelector.removeAllItems();
            return;
        }
        
        friendTargetSelector.removeAllItems();
        chatTargetSelector.removeAllItems();
        
        for (UniversityStudent student : currentStudents) {
            if (!student.name.equals(senderName)) {
                friendTargetSelector.addItem(student.name);
                chatTargetSelector.addItem(student.name);
            }
        }
    }
    
    private void sendFriendRequest(JComboBox<String> senderSelector, JComboBox<String> receiverSelector) {
        if (currentStudents == null || currentStudents.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please load data first!", 
                                        "No Data", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        String senderName = (String) senderSelector.getSelectedItem();
        String receiverName = (String) receiverSelector.getSelectedItem();
        
        if (senderName == null || receiverName == null) {
            JOptionPane.showMessageDialog(this, "Please select both sender and receiver!", 
                                        "Invalid Selection", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        if (senderName.equals(receiverName)) {
            JOptionPane.showMessageDialog(this, "Cannot send friend request to yourself!", 
                                        "Invalid Selection", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        UniversityStudent sender = null;
        UniversityStudent receiver = null;
        for (UniversityStudent s : currentStudents) {
            if (s.name.equals(senderName)) sender = s;
            if (s.name.equals(receiverName)) receiver = s;
        }
        
        if (sender == null || receiver == null) {
            JOptionPane.showMessageDialog(this, "Student not found!", 
                                        "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }
        
        // Send friend request using thread
        try {
            FriendRequestThread friendThread = new FriendRequestThread(sender, receiver);
            friendThread.run(); // Run synchronously for UI responsiveness
            
            outputArea.append(senderName + " sent a friend request to " + receiverName + ".\n");
            outputArea.setCaretPosition(outputArea.getDocument().getLength());
            
            // Update the student details display
            updateStudentDetails(senderSelector);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error sending friend request: " + e.getMessage(), 
                                        "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    private void sendChatMessage(JComboBox<String> senderSelector, 
                                JComboBox<String> receiverSelector,
                                JTextField messageField) {
        if (currentStudents == null || currentStudents.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please load data first!", 
                                        "No Data", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        String senderName = (String) senderSelector.getSelectedItem();
        String receiverName = (String) receiverSelector.getSelectedItem();
        String message = messageField.getText().trim();
        
        if (senderName == null || receiverName == null) {
            JOptionPane.showMessageDialog(this, "Please select both sender and receiver!", 
                                        "Invalid Selection", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        if (message.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter a message!", 
                                        "Invalid Input", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        if (senderName.equals(receiverName)) {
            JOptionPane.showMessageDialog(this, "Cannot send message to yourself!", 
                                        "Invalid Selection", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        UniversityStudent sender = null;
        UniversityStudent receiver = null;
        for (UniversityStudent s : currentStudents) {
            if (s.name.equals(senderName)) sender = s;
            if (s.name.equals(receiverName)) receiver = s;
        }
        
        if (sender == null || receiver == null) {
            JOptionPane.showMessageDialog(this, "Student not found!", 
                                        "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }
        
        // Send chat message using thread
        try {
            ChatThread chatThread = new ChatThread(sender, receiver, message);
            chatThread.run(); // Run synchronously for UI responsiveness
            
            outputArea.append(senderName + " sent a message to " + receiverName + ": \"" + message + "\"\n");
            outputArea.setCaretPosition(outputArea.getDocument().getLength());
            
            // Clear message field
            messageField.setText("");
            
            // Update the student details display
            updateStudentDetails(senderSelector);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error sending message: " + e.getMessage(), 
                                        "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    private void runTestSocialInteractions() {
        if (currentStudents == null || currentStudents.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please load data first!", 
                                        "No Data", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        if (currentStudents.size() < 2) {
            JOptionPane.showMessageDialog(this, "Need at least 2 students for social interactions!", 
                                        "Not Enough Students", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        try {
            ExecutorService executor = Executors.newFixedThreadPool(4);
            UniversityStudent s1 = currentStudents.get(0);
            UniversityStudent s2 = currentStudents.get(1);
            
            // Submit multiple concurrent tasks (like Main.java does)
            executor.submit(new FriendRequestThread(s1, s2));
            executor.submit(new ChatThread(s1, s2, "Hello there!"));
            executor.submit(new FriendRequestThread(s2, s1));
            executor.submit(new ChatThread(s2, s1, "Hi back!"));
            
            executor.shutdown();
            if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
            
            outputArea.append("Test social interactions completed: Friend requests and chat messages sent.\n");
            outputArea.setCaretPosition(outputArea.getDocument().getLength());
            
            // Update student details if a student is currently selected
            @SuppressWarnings("unchecked")
            JComboBox<String> detailSelector = (JComboBox<String>) studentDetailsPanel.getClientProperty("selector");
            if (detailSelector != null && detailSelector.getSelectedItem() != null) {
                updateStudentDetails(detailSelector);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error running social interactions: " + e.getMessage(), 
                                        "Error", JOptionPane.ERROR_MESSAGE);
            outputArea.append("Error: " + e.getMessage() + "\n");
        }
    }
    
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception e) {
                e.printStackTrace();
            }
            
            LonghornNetworkUI ui = new LonghornNetworkUI();
            ui.setVisible(true);
        });
    }
}

