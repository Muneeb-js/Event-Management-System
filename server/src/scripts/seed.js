import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import { Event } from '../models/event.model.js';
import { DB_NAME } from '../constants.js';

dotenv.config({ path: './.env' });

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
    await mongoose.connect(`${mongoUri}/${DB_NAME}`);
    console.log('Connected to DB');

    // 1. Delete all previous data
    console.log('Deleting existing data...');
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('Data cleared.');

    // 2. Create Users
    console.log('Creating users...');
    
    // Create Admin
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      fullName: 'Chief Administrator',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop',
      role: 'admin'
    });

    // Create Teachers
    const teacher1 = await User.create({
      username: 'dr_sarah',
      email: 'sarah@university.edu',
      fullName: 'Dr. Sarah Johnson',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
      role: 'teacher'
    });

    const teacher2 = await User.create({
      username: 'prof_miller',
      email: 'miller@university.edu',
      fullName: 'Prof. James Miller',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
      role: 'teacher'
    });

    // Create Students
    const student1 = await User.create({
      username: 'alice_w',
      email: 'alice@student.edu',
      fullName: 'Alice Walker',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
      role: 'student'
    });

    const student2 = await User.create({
      username: 'bob_m',
      email: 'bob@student.edu',
      fullName: 'Bob Marley',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
      role: 'student'
    });

    console.log('Users created.');

    // 3. Create Events
    console.log('Creating events...');
    const eventsData = [
      {
        title: "Global AI Summit 2024",
        description: "A comprehensive summit on the future of Artificial Intelligence and its impact on society. Featuring speakers from Google, OpenAI, and MIT.",
        date: new Date('2024-06-15'),
        time: "09:00 AM",
        location: "Grand Hall, Tech Center",
        category: "ACADEMIC",
        coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        organizer: teacher1._id,
        attendees: [student1._id]
      },
      {
        title: "Spring Music Festival",
        description: "Join us for a day of live music, food trucks, and celebration. Performances by student bands and local artists.",
        date: new Date('2024-05-25'),
        time: "04:00 PM",
        location: "University Campus Garden",
        category: "SOCIAL",
        coverImage: "https://images.unsplash.com/photo-1459749411177-042180ceea72?q=80&w=2070&auto=format&fit=crop",
        organizer: admin._id,
        attendees: [student1._id, student2._id]
      },
      {
        title: "Web Development Workshop",
        description: "Hands-on workshop for React and Tailwind CSS. Learn to build modern, responsive web applications from scratch.",
        date: new Date('2024-06-05'),
        time: "11:00 AM",
        location: "Lab 4, Computer Science Block",
        category: "WORKSHOP",
        coverImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2070&auto=format&fit=crop",
        organizer: teacher2._id,
        attendees: [student2._id]
      },
      {
        title: "Annual Science Fair",
        description: "Explore the latest research projects from our students in various fields of science and engineering.",
        date: new Date('2024-07-10'),
        time: "10:00 AM",
        location: "Exhibition Center",
        category: "ACADEMIC",
        coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
        organizer: teacher1._id,
        attendees: []
      },
      {
        title: "Career Networking Night",
        description: "Connect with alumni and industry professionals to discuss career opportunities and networking strategies.",
        date: new Date('2024-08-12'),
        time: "06:30 PM",
        location: "Faculty Lounge",
        category: "SOCIAL",
        coverImage: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop",
        organizer: admin._id,
        attendees: [student1._id]
      },
      {
        title: "Photography Masterclass",
        description: "Learn the secrets of professional photography from world-renowned photographers. Covers lighting, composition, and editing.",
        date: new Date('2024-09-20'),
        time: "02:00 PM",
        location: "Arts Auditorium",
        category: "WORKSHOP",
        coverImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2070&auto=format&fit=crop",
        organizer: teacher2._id,
        attendees: [student1._id, student2._id]
      },
      {
        title: "University Sports Day",
        description: "A day filled with competitive sports, including track and field, football, and cricket. Go team!",
        date: new Date('2024-10-05'),
        time: "08:00 AM",
        location: "University Stadium",
        category: "SOCIAL",
        coverImage: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2070&auto=format&fit=crop",
        organizer: admin._id,
        attendees: [student2._id]
      },
      {
        title: "Machine Learning Seminar",
        description: "In-depth discussion on advanced neural networks and deep learning architectures.",
        date: new Date('2024-11-15'),
        time: "10:30 AM",
        location: "Conference Hall B",
        category: "ACADEMIC",
        coverImage: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=2070&auto=format&fit=crop",
        organizer: teacher1._id,
        attendees: []
      },
      {
        title: "Poetry Slam 2024",
        description: "Share your voice and express yourself through the power of poetry. Open to all students and faculty.",
        date: new Date('2024-12-01'),
        time: "07:00 PM",
        location: "Student Union Café",
        category: "SOCIAL",
        coverImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop",
        organizer: admin._id,
        attendees: [student1._id]
      },
      {
        title: "UX Design Bootcamp",
        description: "Intensive 3-day bootcamp covering user research, wireframing, prototyping, and usability testing.",
        date: new Date('2024-06-25'),
        time: "09:00 AM",
        location: "Design Studio",
        category: "WORKSHOP",
        coverImage: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=2070&auto=format&fit=crop",
        organizer: teacher2._id,
        attendees: [student1._id, student2._id]
      },
      {
        title: "Sustainability Conference",
        description: "Discussing strategies for a greener campus and sustainable future. Featuring environmental activists and researchers.",
        date: new Date('2024-07-22'),
        time: "11:00 AM",
        location: "Environment Block Hall",
        category: "CONFERENCE",
        coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format&fit=crop",
        organizer: teacher1._id,
        attendees: []
      },
      {
        title: "Inter-Departmental Debate",
        description: "Witness the best orators of the university compete in this year's departmental debate championship.",
        date: new Date('2024-08-30'),
        time: "03:00 PM",
        location: "Main Lecture Theater",
        category: "ACADEMIC",
        coverImage: "https://images.unsplash.com/photo-1475721027187-402ad2989a3b?q=80&w=2070&auto=format&fit=crop",
        organizer: admin._id,
        attendees: [student1._id, student2._id]
      }
    ];

    await Event.insertMany(eventsData);
    console.log('12 Events created.');

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
