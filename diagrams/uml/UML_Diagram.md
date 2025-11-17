# UML Class Diagram - Longhorn Network

## Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        <<abstract>>                          │
│                         Student                              │
├─────────────────────────────────────────────────────────────┤
│ # name: String                                               │
│ # age: int                                                   │
│ # gender: String                                             │
│ # year: int                                                  │
│ # major: String                                              │
│ # gpa: double                                                │
│ # roommatePreferences: List<String>                          │
│ # previousInternships: List<String>                          │
├─────────────────────────────────────────────────────────────┤
│ + calculateConnectionStrength(other: Student): int           │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
                              │ extends
                              │
┌─────────────────────────────────────────────────────────────┐
│                    UniversityStudent                         │
├─────────────────────────────────────────────────────────────┤
│ - roommate: UniversityStudent                                │
│ - friends: List<UniversityStudent>                           │
│ - chatHistory: Map<UniversityStudent, List<String>>          │
├─────────────────────────────────────────────────────────────┤
│ + UniversityStudent(name, age, gender, year, major, gpa,     │
│                     roommatePreferences,                     │
│                     previousInternships)                     │
│ + calculateConnectionStrength(other: Student): int           │
│ + getRoommate(): UniversityStudent                           │
│ + toString(): String                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ uses
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        │                                           │
┌───────▼───────────────────────────────────────────▼──────────┐
│                    StudentGraph                               │
├──────────────────────────────────────────────────────────────┤
│ - adjacencyList: Map<UniversityStudent, List<Edge>>          │
│ - nodes: Set<UniversityStudent>                               │
├──────────────────────────────────────────────────────────────┤
│ + StudentGraph(students: List<UniversityStudent>)            │
│ + getAllNodes(): Collection<UniversityStudent>               │
│ + getNeighbors(student: UniversityStudent): List<Edge>       │
│ + displayGraph(): void                                       │
├──────────────────────────────────────────────────────────────┤
│                    + Edge (inner class)                      │
│ ├──────────────────────────────────────────────────────────┤
│ │ + neighbor: UniversityStudent                             │
│ │ + weight: int                                             │
│ │ + Edge(neighbor, weight)                                  │
│ └──────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────────┘
        │
        │ uses
        │
        ├──────────────────────┬──────────────────────┐
        │                      │                      │
┌───────▼──────────┐  ┌────────▼──────────┐  ┌──────▼──────────┐
│ ReferralPathFinder│  │  PodFormation     │  │   GaleShapley   │
├───────────────────┤  ├───────────────────┤  ├─────────────────┤
│ - graph:          │  │ - graph:          │  │                 │
│   StudentGraph    │  │   StudentGraph    │  │                 │
├───────────────────┤  ├───────────────────┤  ├─────────────────┤
│ + ReferralPath    │  │ + PodFormation    │  │ + assignRoom    │
│   Finder(graph)   │  │   (graph)         │  │   mates(        │
│ + findReferral    │  │ + formPods(       │  │   students:     │
│   Path(start,     │  │   podSize: int)   │  │   List<         │
│   targetCompany): │  │   : void          │  │   University    │
│   List<           │  │                   │  │   Student>)     │
│   University      │  │                   │  │   : void        │
│   Student>        │  │                   │  │                 │
└───────────────────┘  └───────────────────┘  └─────────────────┘
        │                      │                      │
        │                      │                      │
        └──────────────────────┴──────────────────────┘
                              │
                              │ uses
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
┌───────▼───────────────────────────┐  ┌───────────▼──────────────┐
│      FriendRequestThread          │  │      ChatThread          │
├───────────────────────────────────┤  ├──────────────────────────┤
│ - sender: UniversityStudent       │  │ - sender: University     │
│ - receiver: UniversityStudent     │  │   Student                │
├───────────────────────────────────┤  │ - receiver: University   │
│ + FriendRequestThread(sender,     │  │   Student                │
│   receiver)                       │  │ - message: String        │
│ + run(): void                     │  ├──────────────────────────┤
└───────────────────────────────────┘  │ + ChatThread(sender,     │
                                       │   receiver, message)     │
                                       │ + run(): void            │
                                       └──────────────────────────┘
        │                                           │
        └───────────────────┬───────────────────────┘
                            │
                            │ implements
                            │
                    ┌───────▼────────┐
                    │   Runnable     │
                    │  (interface)   │
                    └────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      DataParser                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ + parseStudents(filename: String): List<UniversityStudent> │
└─────────────────────────────────────────────────────────────┘
        │
        │ creates
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│                         Main                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ + main(args: String[]): void                               │
│ + generateTestCase1(): List<UniversityStudent>             │
│ + generateTestCase2(): List<UniversityStudent>             │
│ + generateTestCase3(): List<UniversityStudent>             │
│ + gradeLab(students: List<UniversityStudent>,              │
│            testCaseNumber: int): int                        │
└─────────────────────────────────────────────────────────────┘
```

## Relationships

### Inheritance
- `UniversityStudent` extends `Student`
- `FriendRequestThread` implements `Runnable`
- `ChatThread` implements `Runnable`

### Composition/Aggregation
- `StudentGraph` contains `Edge` (inner class)
- `StudentGraph` aggregates `UniversityStudent` (nodes)
- `ReferralPathFinder` uses `StudentGraph` (composition)
- `PodFormation` uses `StudentGraph` (composition)
- `UniversityStudent` may have a `roommate` (association)
- `UniversityStudent` has `friends` (association - list)
- `UniversityStudent` has `chatHistory` (association - map)

### Dependencies
- `GaleShapley` depends on `UniversityStudent`
- `DataParser` creates `UniversityStudent` objects
- `Main` uses all classes for testing
- `FriendRequestThread` and `ChatThread` operate on `UniversityStudent` objects

## Notes

1. **StudentGraph** uses an adjacency list representation where each `UniversityStudent` maps to a list of `Edge` objects.

2. **Connection Strength Calculation**: The `calculateConnectionStrength` method in `UniversityStudent` considers:
   - Roommate status (+4)
   - Shared internships (+3 each)
   - Same major (+2)
   - Same age (+1)

3. **Thread Safety**: `FriendRequestThread` and `ChatThread` must ensure thread-safe operations when updating shared resources like friend lists and chat histories.

4. **Graph Algorithms**:
   - `ReferralPathFinder` uses Dijkstra's algorithm with inverted weights
   - `PodFormation` uses Prim's algorithm for minimum spanning trees

