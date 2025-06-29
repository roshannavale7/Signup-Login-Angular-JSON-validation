const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Log every request for debugging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`, req.body);
  next();
});

const USERS_FILE = './users.json';

// Ensure users.json exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, '[]');
}

// Read users from file
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

// Write users to file
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Root route
app.get('/', (req, res) => {
  res.status(200).send('✅ Backend is running!');
});

// Signup route
app.post('/signup', (req, res) => {
  const { email, userName, password } = req.body;

  if (!email || !userName || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const users = readUsers();
  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  users.push({ email, userName, password });
  writeUsers(users);

  console.log('✅ New user registered:', email);
  return res.status(200).json({ message: 'Signup successful' });
});

// Login route
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required' });
//   }

//   const users = readUsers();
//   const user = users.find(u => u.email === email && u.password === password);

//   if (!user) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   console.log('✅ Login successful for:', email);
//   return res.status(200).json({ message: 'Login successful' });
// });
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Store this securely

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email: user.email, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
  return res.status(200).json({ 
    message: 'Login successful', 
    token ,
    userName: user.userName
  });
});

// protect Routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

// Start server
app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));