import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Demo: hardcoded user
  if (username === 'admin' && password === 'admin') {
    // In real apps, return a JWT
    return res.json({ token: 'demo-token' });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

export default router; 