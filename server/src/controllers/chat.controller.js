import { GoogleGenerativeAI } from '@google/generative-ai';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Event } from '../models/event.model.js';
import { User } from '../models/user.model.js';

// Build a rich system context from the live database
const buildSystemContext = async () => {
  const [events, users] = await Promise.all([
    Event.find({}).populate('organizer', 'fullName email role').lean(),
    User.find({}).select('fullName email role username major createdAt').lean(),
  ]);

  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');
  const admins = users.filter(u => u.role === 'admin');

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date) > now);
  const pastEvents = events.filter(e => new Date(e.date) <= now);

  const eventsText = events.map(e => `
- Title: "${e.title}"
  Category: ${e.category || 'GENERAL'}
  Date: ${new Date(e.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
  Time: ${e.time || 'TBA'}
  Location: ${e.location}
  Organizer: ${e.organizer?.fullName || 'Unknown'} (${e.organizer?.role || 'unknown'})
  Attendees: ${e.attendees?.length || 0}
  Status: ${e.status || 'pending'}
  Description: ${e.description?.slice(0, 200)}${e.description?.length > 200 ? '...' : ''}
`).join('\n');

  const usersText = users.map(u =>
    `- ${u.fullName} (${u.role}, username: ${u.username}, email: ${u.email})`
  ).join('\n');

  return `You are the UEMS Assistant — an intelligent AI chatbot embedded inside the University Event Management System (UEMS). Your job is to help students, teachers, and admins find information about events, users, and the platform.

=== LIVE DATABASE SNAPSHOT (as of ${new Date().toLocaleString()}) ===

📊 SYSTEM STATISTICS:
- Total Events: ${events.length} (${upcomingEvents.length} upcoming, ${pastEvents.length} past)
- Total Users: ${users.length}
  • Students: ${students.length}
  • Teachers: ${teachers.length}
  • Admins: ${admins.length}

📅 ALL EVENTS:
${eventsText}

👥 ALL USERS:
${usersText}

=== BEHAVIORAL GUIDELINES ===
1. Answer questions naturally and conversationally.
2. When asked about specific events, provide date, time, location, organizer, and attendee count.
3. When asked about users, share their name, role, and relevant details — but never share passwords or tokens.
4. Be helpful about upcoming events, registration advice, and platform features.
5. Format responses cleanly — use bullet points, bold text (**text**), and line breaks for readability.
6. If information is not in the database snapshot, say so honestly.
7. Keep responses concise but complete. Avoid unnecessary repetition.
8. You can make recommendations (e.g. "You might enjoy the AI Summit since you're interested in technology").
9. Always speak as part of the UEMS platform — be warm, professional, and academic in tone.`;
};

const chat = asyncHandler(async (req, res) => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new ApiError(503, 'AI chatbot is not configured. Please add your GEMINI_API_KEY to the server environment.');
  }

  const { message, history = [] } = req.body;

  if (!message?.trim()) {
    throw new ApiError(400, 'Message is required');
  }

  // Build live context from the database
  const systemContext = await buildSystemContext();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemContext,
  });

  // Convert our history format to Gemini format
  const geminiHistory = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chatSession = model.startChat({
    history: geminiHistory,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
  });

  const result = await chatSession.sendMessage(message);
  const reply = result.response.text();

  return res.status(200).json(
    new ApiResponse(200, { reply }, 'Response generated successfully')
  );
});

export { chat };
