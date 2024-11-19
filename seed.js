const mongoose = require('mongoose');
const User = require('./src/models/User');
const Topic = require('./src/models/Topic'); 
const SubTopic = require('./src/models/SubTopic');
const Problem = require('./src/models/Problem');
require('dotenv').config(); 

// Connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa_tracker', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

// Seed topics
const seedTopics = async () => {
    try {
        const topics = [
            {
                title: "Arrays",
                description: "Learn about arrays, their operations, and advanced problems.",
                order: 1,
                progress: false,
            },
            {
                title: "LinkedList",
                description: "Understand linkedlist, manipulation techniques, and common algorithms.",
                order: 2,
                progress: false,
            },
            {
                title: "Dynamic Programming",
                description: "Explore optimization problems and solutions using dynamic programming.",
                order: 3,
                progress: false,
            },
            {
                title: "Graph",
                description: "Dive into graph data structures, traversal algorithms, and advanced problems.",
                order: 4,
                progress: false,
            },
            {
                title: "Tree",
                description: "Learn about tree traversal techniques, and their applications.",
                order: 5,
                progress: false,
            },
        ];
        const savedTopics = await Topic.insertMany(topics);
        console.log('Topics seeded:', savedTopics);
        return savedTopics;
    } catch (err) {
        console.error('Error seeding topics:', err.message);
        process.exit(1);
    }
};

// Seed sub topics
const seedSubTopics = async (topics) => {
    const topicsWithSubTopics = {
        "Arrays": [
            { title: "Sliding Window", description: "Problems using sliding window technique.", level: "Medium", progress: false },
            { title: "Two Pointers", description: "Problems utilizing two pointers.", level: "Easy", progress: false },
            { title: "Hashmap-Based Problems", description: "Problems based on hashmaps for fast lookups.", level: "Medium", progress: false },
            { title: "Sorting & Searching", description: "Problems involving sorting algorithms.", level: "Medium", progress: false },
            { title: "Kadane’s Algorithm", description: "Find the maximum sum subarray.", level: "Easy", progress: false },
        ],
        "LinkedList": [
            { title: "Singly Linked List Basics", description: "Fundamentals of singly linked lists.", level: "Easy", progress: false },
            { title: "Doubly Linked List Basics", description: "Working with doubly linked lists.", level: "Easy", progress: false },
            { title: "Cycle Detection in Linked List", description: "Detect if a cycle exists in a linked list.", level: "Medium", progress: false },
            { title: "Merge Two Sorted Lists", description: "Merge two sorted linked lists into one.", level: "Easy", progress: false },
            { title: "Reverse a Linked List", description: "Reverse a linked list in place.", level: "Medium", progress: false },
        ],
        "Tree": [
            { title: "Binary Tree Traversals", description: "Inorder, Preorder, and Postorder traversals.", level: "Medium", progress: false },
            { title: "Binary Search Tree Basics", description: "Understanding BST properties.", level: "Easy", progress: false },
            { title: "Lowest Common Ancestor", description: "Find the LCA of two nodes in a binary tree.", level: "Medium", progress: false },
            { title: "Serialize and Deserialize a Binary Tree", description: "Serialize a tree into a string.", level: "Hard", progress: false },
            { title: "Diameter of a Binary Tree", description: "Find the diameter of a binary tree.", level: "Medium", progress: false },
        ],
        "Graph": [
            { title: "Breadth-First Search (BFS)", description: "Explore a graph layer by layer.", level: "Medium", progress: false },
            { title: "Depth-First Search (DFS)", description: "Explore graph depth first.", level: "Medium", progress: false },
            { title: "Shortest Path Algorithms", description: "Algorithms like Dijkstra and Bellman-Ford.", level: "Hard", progress: false },
            { title: "Graph Representation", description: "Represent graphs using adjacency matrix and list.", level: "Easy", progress: false },
            { title: "Topological Sorting", description: "Sorting directed acyclic graphs topologically.", level: "Medium", progress: false },
        ],
        "Dynamic Programming": [
            { title: "Fibonacci Numbers", description: "Problems involving Fibonacci sequences.", level: "Easy", progress: false },
            { title: "0/1 Knapsack Problem", description: "Choose items to maximize value within a weight limit.", level: "Medium", progress: false },
            { title: "Longest Common Subsequence", description: "Find the LCS between two strings.", level: "Medium", progress: false },
            { title: "Subset Sum Problem", description: "Find if a subset exists with a given sum.", level: "Medium", progress: false },
            { title: "Longest Increasing Subsequence", description: "Find the LIS in an array.", level: "Hard", progress: false },
        ],
    };

    try {
        const updatedSubtopicsList = []; 

        topics.forEach(topic => {
            let order = 0;
            const updatedSubtopics = topicsWithSubTopics[topic.title].map(subtopic => {
                order += 1;
                return ({
                    ...subtopic,
                    order: order,
                    topicId: topic._id 
                })
            });

            updatedSubtopicsList.push(...updatedSubtopics); 
        });

        console.log(updatedSubtopicsList);

        const savedSubTopics = await SubTopic.insertMany(updatedSubtopicsList);
        if (savedSubTopics) {
            await seedProblems()
        }
        console.log('Sub Topics seeded:', savedSubTopics);
        return savedSubTopics;
    } catch (err) {
        console.error('Error seeding sub topics:', err.message);
        process.exit(1);
    }
};

// Seed problems
const seedProblems = async () => {
    try {
        const subTopics = await SubTopic.find(); 
        if (!subTopics.length) {
            console.log('No subtopics found. Please seed subtopics first.');
            return;
        }

        const problemsData = [];

        subTopics.forEach((subTopic) => {
            const topicId = subTopic.topicId;
            const subTopicId = subTopic._id;

            const problemsForSubTopic = [
                {
                    title: `${subTopic.title} Problem 1`,
                    topicId: topicId,
                    subTopicId: subTopicId,
                    leetcodeLink: 'https://leetcode.com/problems/example1/',
                    codeforcesLink: '',
                    youtubeLink: 'https://www.youtube.com/watch?v=example1',
                    articleLink: 'https://example.com/article1',
                    level: 'Easy',
                },
                {
                    title: `${subTopic.title} Problem 2`,
                    topicId: topicId,
                    subTopicId: subTopicId,
                    leetcodeLink: 'https://leetcode.com/problems/example2/',
                    codeforcesLink: '',
                    youtubeLink: 'https://www.youtube.com/watch?v=example2',
                    articleLink: 'https://example.com/article2',
                    level: 'Medium',
                },
                {
                    title: `${subTopic.title} Problem 3`,
                    topicId: topicId,
                    subTopicId: subTopicId,
                    leetcodeLink: 'https://leetcode.com/problems/example3/',
                    codeforcesLink: 'https://codeforces.com/problemset/problem/example3',
                    youtubeLink: '',
                    articleLink: '',
                    level: 'Hard',
                },
                {
                    title: `${subTopic.title} Problem 4`,
                    topicId: topicId,
                    subTopicId: subTopicId,
                    leetcodeLink: '',
                    codeforcesLink: 'https://codeforces.com/problemset/problem/example4',
                    youtubeLink: '',
                    articleLink: 'https://example.com/article4',
                    level: 'Medium',
                },
            ];

            problemsData.push(...problemsForSubTopic);
        });

        const savedProblems = await Problem.insertMany(problemsData);
        console.log('Problems seeded:', savedProblems);
    } catch (err) {
        console.error('Error seeding problems:', err.message);
        process.exit(1);
    }
};

// Seed users
const seedUsers = async () => {
    try {
        const users = [
            { name: 'Lalit Trigunayat', email: 'lalit@example.com', password: 'password123' },
            { name: 'John Doe', email: 'john@example.com', password: 'password123' },
            { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
        ];

        for (const userData of users) {
            const newUser = new User(userData);
            const savedUser = await newUser.save();
            console.log('User seeded:', savedUser);
        }
        
        console.log('All users seeded successfully!');
        process.exit(0); 
    } catch (err) {
        console.error('Error seeding users:', err.message);
        process.exit(1); 
    }
};

// Run seeding
const seedDatabase = async () => {
    try {
        await connectDB();
        await seedUsers();

        const topics = await seedTopics();
        if (topics) {
            await seedSubTopics(topics);
        }
    } catch (err) {
        console.error('Error during seeding:', err.message);
    } finally {
        mongoose.disconnect(); 
        console.log('Database disconnected');
    }
};

seedDatabase();
