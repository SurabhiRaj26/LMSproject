const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await User.deleteMany();
  await Course.deleteMany();
  await Lesson.deleteMany();

  // Create users
  const instructor = await User.create({
    name: 'John Doe',
    email: 'instructor@lms.com',
    password: 'test1234',
    role: 'instructor',
  });

  const student = await User.create({
    name: 'Jane Smith',
    email: 'student@lms.com',
    password: 'test1234',
    role: 'student',
  });

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@lms.com',
    password: 'test1234',
    role: 'admin',
  });

  console.log('✅ Users created');

  // Create courses
  const course1 = await Course.create({
    title: 'Full Stack Web Development',
    description: 'Master HTML, CSS, JavaScript, React, Node.js and MongoDB to build full-stack applications from scratch.',
    thumbnail: 'https://img.youtube.com/vi/K5KVEU3aaeQ/maxresdefault.jpg',
    instructor: instructor._id,
    instructorName: instructor.name,
    category: 'Web Development',
    level: 'Beginner',
    totalLessons: 6,
  });

  const course2 = await Course.create({
    title: 'React.js Complete Guide',
    description: 'Deep dive into React.js with hooks, context, routing, and state management for modern web apps.',
    thumbnail: 'https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg',
    instructor: instructor._id,
    instructorName: instructor.name,
    category: 'React',
    level: 'Intermediate',
    totalLessons: 5,
  });

  const course3 = await Course.create({
    title: 'Node.js & Express API Development',
    description: 'Build production-ready REST APIs using Node.js, Express, and MongoDB with authentication.',
    thumbnail: 'https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg',
    instructor: instructor._id,
    instructorName: instructor.name,
    category: 'Backend',
    level: 'Intermediate',
    totalLessons: 5,
  });

  const course4 = await Course.create({
    title: 'JavaScript for Beginners',
    description: 'Learn JavaScript from the ground up — variables, functions, DOM manipulation, and ES6+ features.',
    thumbnail: 'https://img.youtube.com/vi/PkZNo7MFOUg/maxresdefault.jpg',
    instructor: instructor._id,
    instructorName: instructor.name,
    category: 'JavaScript',
    level: 'Beginner',
    totalLessons: 6,
  });

  const course5 = await Course.create({
    title: 'Python Programming Masterclass',
    description: 'The ultimate guide to Python. Learn OOP, data structures, APIs, and build real-world automation scripts.',
    thumbnail: 'https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg',
    instructor: instructor._id,
    instructorName: instructor.name,
    category: 'Python',
    level: 'Intermediate',
    totalLessons: 5,
  });

  const course6 = await Course.create({
    title: 'Data Science & Machine Learning',
    description: 'Master Data Science with Pandas, NumPy, Matplotlib, and scikit-learn. Build predictive models.',
    thumbnail: 'https://img.youtube.com/vi/ua-CiDNNj30/maxresdefault.jpg',
    instructor: instructor._id,
    instructorName: instructor.name,
    category: 'Data Science',
    level: 'Beginner',
    totalLessons: 5,
  });

  console.log('✅ Courses created');

  // Create lessons
  const lessons = [
    // Course 1: Full Stack
    { courseId: course1._id, title: 'Introduction to Web Development', order: 1, youtubeId: 'K5KVEU3aaeQ', description: 'Overview of full stack development' },
    { courseId: course1._id, title: 'Setting Up the Environment', order: 2, youtubeId: 'hlGoQC332VM', description: 'Install Node, VS Code and configure dev tools' },
    { courseId: course1._id, title: 'Building Your First App', order: 3, youtubeId: 'D1eL1EnxXXQ', description: 'Create a simple Express.js application' },
    { courseId: course1._id, title: 'Connecting to MongoDB', order: 4, youtubeId: 'SyVMma1IkXM', description: 'Database integration with Mongoose' },
    { courseId: course1._id, title: 'Deploying your Application', order: 5, youtubeId: 'l134cBAJCuc', description: 'Deploy MERN stack to production' },
    { courseId: course1._id, title: 'Advanced Full Stack Concepts', order: 6, youtubeId: '7CqJlxBYj-M', description: 'Security, Redis Cache, and WebSockets' },
    
    // Course 2: React
    { courseId: course2._id, title: 'React in 100 Seconds', order: 1, youtubeId: 'Tn6-PIqc4UM', description: 'Quick overview of React concepts' },
    { courseId: course2._id, title: 'React Course - Beginner\'s Tutorial', order: 2, youtubeId: 'bMknfKXIFA8', description: 'JSX, Components and Props full crash course' },
    { courseId: course2._id, title: 'State and Hooks Masterclass', order: 3, youtubeId: 'O6P86uwfdR0', description: 'useState, useEffect and custom hooks' },
    { courseId: course2._id, title: 'React Router v6', order: 4, youtubeId: 'Ul3y1LXxzdU', description: 'Client-side routing and navigation' },
    { courseId: course2._id, title: 'Redux Toolkit Tutorial', order: 5, youtubeId: 'bbkBuqC1rU4', description: 'State Management with Redux' },

    // Course 3: Node
    { courseId: course3._id, title: 'Node.js in 100 Seconds', order: 1, youtubeId: 'ENrzD9HAZK4', description: 'Modules, file system and events overview' },
    { courseId: course3._id, title: 'Express.js Crash Course', order: 2, youtubeId: 'L72fhGm1tfE', description: 'Middleware, routing and error handling' },
    { courseId: course3._id, title: 'Node.js API Full Course', order: 3, youtubeId: 'Oe421EPjeBE', description: 'Best practices for RESTful APIs' },
    { courseId: course3._id, title: 'JWT Authentication Guide', order: 4, youtubeId: 'mbsmsi7l3r4', description: 'Secure your APIs with JSON Web Tokens' },
    { courseId: course3._id, title: 'Deploying Node.js APIs', order: 5, youtubeId: 'l134cBAJCuc', description: 'Deploy your API to production' },

    // Course 4: JavaScript
    { courseId: course4._id, title: 'JavaScript in 100 Seconds', order: 1, youtubeId: 'DHjqpvDnNGE', description: 'Variables, types, and operators overview' },
    { courseId: course4._id, title: 'Functions and Scope', order: 2, youtubeId: 'Liv6eeb1VfE', description: 'Functions, closures and scope chain' },
    { courseId: course4._id, title: 'DOM Manipulation Crash Course', order: 3, youtubeId: '5fb2aPlgoys', description: 'Select and modify HTML elements' },
    { courseId: course4._id, title: 'JavaScript Full Course for Beginners', order: 4, youtubeId: 'PkZNo7MFNFg', description: 'Comprehensive basics guide' },
    { courseId: course4._id, title: 'Asynchronous JavaScript', order: 5, youtubeId: 'ZYb_ZU8LNxs', description: 'Promises, Async/Await and Fetch API' },
    { courseId: course4._id, title: 'ES6+ Features', order: 6, youtubeId: 'nZ1DMMsyVyI', description: 'Modern JavaScript features' },

    // Course 5: Python
    { courseId: course5._id, title: 'Python in 100 Seconds', order: 1, youtubeId: 'x7X9w_GIm1s', description: 'Quick overview of Python' },
    { courseId: course5._id, title: 'Python Course for Beginners', order: 2, youtubeId: 'rfscVS0vtbw', description: 'Complete Python basics' },
    { courseId: course5._id, title: 'Object Oriented Programming in Python', order: 3, youtubeId: 'JeznW_7DlB0', description: 'OOP concepts in Python' },
    { courseId: course5._id, title: 'Python Automation Tutorial', order: 4, youtubeId: 'H2EJuAcrZYU', description: 'Automate tasks with Python' },
    { courseId: course5._id, title: 'Build a Complete API with FastAPI', order: 5, youtubeId: '0sOvCWFmrtA', description: 'Python API Development' },

    // Course 6: Data Science
    { courseId: course6._id, title: 'Learn Data Science Tutorial', order: 1, youtubeId: 'ua-CiDNNj30', description: 'Introduction to Data Science' },
    { courseId: course6._id, title: 'Pandas Data Analysis', order: 2, youtubeId: 'gtjxAH8uaP0', description: 'Data manipulation with Pandas' },
    { courseId: course6._id, title: 'NumPy Tutorial', order: 3, youtubeId: 'QUT1VHiLmmI', description: 'Numerical computing with Python' },
    { courseId: course6._id, title: 'Matplotlib Crash Course', order: 4, youtubeId: 'vmEHCJofslg', description: 'Data Visualization' },
    { courseId: course6._id, title: 'Machine Learning for Everybody', order: 5, youtubeId: 'i_LwzRmA_08', description: 'Intro to predictive models' },
  ];

  await Lesson.insertMany(lessons);
  console.log('✅ Lessons created');

  console.log('\n🎉 Seed data inserted successfully!\n');
  console.log('Test Accounts:');
  console.log('  Instructor → instructor@lms.com / test1234');
  console.log('  Student    → student@lms.com / test1234');
  console.log('  Admin      → admin@lms.com / test1234');
  mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
