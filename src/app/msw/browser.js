import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// File: uni-market/src/app/msw/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/auth/signup', (req, res, ctx) => {
    const { email } = req.body;
    if (!email.includes('@university.com')) {
      return res(ctx.status(400), ctx.json({ error: 'Must use a university email' }));
    }
    return res(ctx.status(200), ctx.json({ message: 'Sign-up successful, OTP sent' }));
  }),
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body;
    if (email === 'test@university.com' && password === 'password123') {
      return res(ctx.status(200), ctx.json({ message: 'Login successful, OTP sent' }));
    }
    return res(ctx.status(401), ctx.json({ error: 'Invalid credentials' }));
  }),
  rest.post('/api/auth/verify/otp', (req, res, ctx) => {
    const { otp } = req.body;
    if (otp === '123456') {
      return res(ctx.status(200), ctx.json({ message: 'OTP verified' }));
    }
    return res(ctx.status(400), ctx.json({ error: 'Invalid OTP' }));
  }),
  rest.post('/api/auth/verify/id-upload', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'ID uploaded successfully' }));
  }),
];