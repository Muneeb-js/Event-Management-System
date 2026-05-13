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

    // Create a user
    let user = await User.findOne({ email: 'admin@example.com' });
    if (!user) {
      user = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        fullName: 'Admin User',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
        role: 'admin'
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    const events = [
      {
        title: "UAF Tech Expo 2024",
        description: "Join us for the biggest technology exhibition at UAF. Discover innovative projects, networking opportunities, and workshops from industry leaders. This event brings together the brightest minds in engineering, computer science, and agriculture technology.",
        date: new Date('2024-06-15'),
        time: "10:00 AM",
        location: "Main Auditorium, UAF",
        coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
        organizer: user._id
      },
      {
        title: "Annual Sports Gala",
        description: "A week-long celebration of sports and athleticism. Participate in various competitions including cricket, football, and athletics. Show your team spirit and compete for the championship trophy!",
        date: new Date('2024-07-20'),
        time: "08:00 AM",
        location: "University Sports Ground",
        coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2070&auto=format&fit=crop",
        organizer: user._id
      },
      {
        title: "Cultural Night 2024",
        description: "Experience the rich heritage and diverse cultures through music, dance, and traditional food stalls. A night to remember with performances from various student societies representing all provinces.",
        date: new Date('2024-08-10'),
        time: "06:00 PM",
        location: "Iqbal Auditorium",
        coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop",
        organizer: user._id
      },
      {
        title: "AI & Machine Learning Workshop",
        description: "Hands-on workshop on the latest trends in Artificial Intelligence and Machine Learning. Perfect for beginners and enthusiasts looking to dive into the world of data science and neural networks.",
        date: new Date('2024-09-05'),
        time: "11:00 AM",
        location: "IT Center, Room 302",
        coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
        organizer: user._id
      },
      {
        title: "Career Counseling Seminar",
        description: "Expert advice on choosing the right career path. Meet industry professionals and alumni who share their success stories and tips for the job market.",
        date: new Date('2024-10-12'),
        time: "02:00 PM",
        location: "Seminar Hall, Faculty of Agriculture",
        coverImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop",
        organizer: user._id
      }
    ];

    for (const eventData of events) {
      const existingEvent = await Event.findOne({ title: eventData.title });
      if (!existingEvent) {
        await Event.create(eventData);
        console.log(`Event created: ${eventData.title}`);
      } else {
        console.log(`Event already exists: ${eventData.title}`);
      }
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
