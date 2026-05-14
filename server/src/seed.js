import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Event } from './models/event.model.js';
import { User } from './models/user.model.js';
import connectDB from './db/index.js';

dotenv.config({ path: './.env' });

const events = [
  {
    title: "International Symposium on Quantum Artificial Intelligence 2026",
    description: "Join us for a groundbreaking three-day symposium exploring the intersection of Quantum Computing and Artificial Intelligence. This event will feature keynote speeches from industry leaders at Google Quantum AI, IBM Research, and MIT. \n\nTopics include: \n- Quantum Neural Networks and their practical applications.\n- Shor's Algorithm and the future of cybersecurity in an AI-driven world.\n- Hybrid Quantum-Classical optimization for supply chain management.\n\nAttendees will have the opportunity to participate in hands-on workshops using Qiskit and Google Cirq. Whether you're a seasoned researcher or a student curious about the future of computing, this symposium offers invaluable insights into the technology that will define the next decade of digital transformation. We will also host a networking gala on the second evening for all registered participants.",
    date: "2026-06-15",
    time: "09:00",
    location: "Grand Auditorium, Innovation Center",
    category: "ACADEMIC",
    department: "Computer Science",
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000&auto=format&fit=crop",
    status: "approved"
  },
  {
    title: "Annual University Cultural Festival: 'Vibrance 2026'",
    description: "Experience the ultimate celebration of diversity and talent at Vibrance 2026! Our annual cultural festival returns bigger and better than ever. This week-long event showcases the incredible talents of our student body through music, dance, drama, and fine arts. \n\nHighlights include: \n- 'Battle of the Bands' featuring local campus talent.\n- International Food Street with cuisines from over 30 countries.\n- Traditional dance performances and contemporary choreography competitions.\n- Art exhibitions and live graffiti workshops.\n\nDon't miss the grand finale on Saturday night featuring a surprise celebrity performance and a spectacular drone light show. This is more than just a festival; it's a testament to the vibrant community spirit of our university. Grab your passes early, as this event consistently sells out!",
    date: "2026-07-20",
    time: "10:00",
    location: "University Main Grounds",
    category: "SOCIAL",
    department: "Arts & Humanities",
    coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2000&auto=format&fit=crop",
    status: "approved"
  },
  {
    title: "Global Sustainability & Green Energy Hackathon",
    description: "Are you ready to solve the world's most pressing environmental challenges? Join the 48-hour Global Sustainability Hackathon. Work in multidisciplinary teams to develop innovative software or hardware solutions aimed at reducing carbon footprints, optimizing renewable energy grids, or managing urban waste. \n\nWe provide: \n- Access to real-time environmental datasets.\n- Mentorship from industry experts in clean-tech.\n- Unlimited coffee and high-speed internet.\n- A prize pool of $10,000 for the winning projects.\n\nThe event kicks off with a series of lightning talks on the current state of climate technology. Participants are encouraged to bring their own hardware kits (Arduinos, Raspberry Pis), though basic kits will be available for rent. Let's build a greener future together, one line of code at a time.",
    date: "2026-08-05",
    time: "18:00",
    location: "Engineering Lab Complex, Wing B",
    category: "TECHNICAL",
    department: "Engineering",
    coverImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2000&auto=format&fit=crop",
    status: "approved"
  },
  {
    title: "Inter-University Championship: The Golden Cup 2026",
    description: "The most anticipated sporting event of the year is here! Watch as top athletes from across the region compete for the prestigious Golden Cup. This year's championship features a wide array of sports, including football, basketball, volleyball, and track & field events. \n\nSchedule: \n- Monday-Wednesday: Preliminary rounds and group stages.\n- Thursday: Quarter-finals and semi-finals.\n- Friday: The Grand Final and Closing Ceremony.\n\nCome and support your university teams! The atmosphere will be electric, with cheerleading squads, halftime shows, and live commentary. Food trucks and merchandise stalls will be available throughout the venue. Wear your university colors and be part of the sea of fans cheering for victory!",
    date: "2026-09-12",
    time: "08:30",
    location: "University Sports Stadium",
    category: "SPORTS",
    department: "Sports & Recreation",
    coverImage: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2000&auto=format&fit=crop",
    status: "approved"
  }
];

const seedDB = async () => {
  try {
    await connectDB();

    // Get an organizer
    const organizer = await User.findOne({ role: { $in: ['admin', 'teacher'] } });
    if (!organizer) {
      console.log('No admin or teacher found to assign as organizer. Please create one first.');
      process.exit(1);
    }

    console.log(`Using organizer: ${organizer.fullName} (${organizer.role})`);

    // Clean existing events (optional)
    // await Event.deleteMany({});
    // console.log('Existing events cleared.');

    const eventsWithOrganizer = events.map(e => ({
      ...e,
      organizer: organizer._id
    }));

    await Event.insertMany(eventsWithOrganizer);
    console.log('Successfully seeded 4 high-quality, lengthy events!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
