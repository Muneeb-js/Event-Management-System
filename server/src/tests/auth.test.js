import request from 'supertest';
import { vi } from 'vitest';
import { app } from '../app.js';
import { User } from '../models/user.model.js';

// Mock Cloudinary uploads to bypass network calls
vi.mock('../utils/cloudinary.js', () => ({
  uploadOnCloudinary: vi.fn().mockResolvedValue({ url: 'http://example.com/avatar.jpg' })
}));

describe('User Authentication API Endpoints', () => {
  const testStudent = {
    fullName: 'Jane Doe',
    email: 'jane@university.edu',
    username: 'janedoe',
    password: 'password123',
    role: 'student'
  };

  test('POST /api/v1/users/register should register a user successfully', async () => {
    const response = await request(app)
      .post('/api/v1/users/register')
      .field('fullName', testStudent.fullName)
      .field('email', testStudent.email)
      .field('username', testStudent.username)
      .field('password', testStudent.password)
      .field('role', testStudent.role)
      .attach('avatar', Buffer.from('fake-image-bytes'), 'avatar.png')
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User Created Successfully');
    expect(response.body.data).toBeDefined();
    expect(response.body.data.username).toBe(testStudent.username.toLowerCase());
    expect(response.body.data.email).toBe(testStudent.email);
    expect(response.body.data.role).toBe(testStudent.role);

    // Verify user is persisted in MongoDB test database
    const userInDb = await User.findOne({ email: testStudent.email });
    expect(userInDb).toBeTruthy();
    expect(userInDb.fullName).toBe(testStudent.fullName);
  });

  test('POST /api/v1/users/register should reject missing fields', async () => {
    const response = await request(app)
      .post('/api/v1/users/register')
      .field('fullName', '') // empty field
      .field('email', 'incomplete@university.edu')
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('POST /api/v1/users/login should authenticate registered credentials', async () => {
    // 1. First register the user
    await request(app)
      .post('/api/v1/users/register')
      .field('fullName', testStudent.fullName)
      .field('email', testStudent.email)
      .field('username', testStudent.username)
      .field('password', testStudent.password)
      .field('role', testStudent.role)
      .attach('avatar', Buffer.from('fake-image-bytes'), 'avatar.png')
      .expect(201);

    // 2. Login
    const response = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: testStudent.email,
        password: testStudent.password
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User Logged In Successfully');
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.user.email).toBe(testStudent.email);

    // 3. Inspect headers for cookie attachments
    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const hasAccessTokenCookie = cookies.some(c => c.includes('accessToken'));
    expect(hasAccessTokenCookie).toBe(true);
  });

  test('POST /api/v1/users/login should reject invalid passwords', async () => {
    // Register
    await request(app)
      .post('/api/v1/users/register')
      .field('fullName', testStudent.fullName)
      .field('email', testStudent.email)
      .field('username', testStudent.username)
      .field('password', testStudent.password)
      .field('role', testStudent.role)
      .attach('avatar', Buffer.from('fake-image-bytes'), 'avatar.png')
      .expect(201);

    // Try login with bad password
    const response = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: testStudent.email,
        password: 'wrongpassword'
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});
