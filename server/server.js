const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://khan007:khan77700331@datadb.tnghjqy.mongodb.net/main?retryWrites=true&w=majority&appName=dataDB');

const schema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model('games', schema);

// Dummy blogs array (memory me)
let blogs = [
  { _id: 1, title: "First Blog", author: "Admin", content: "Hello world!" },
  { _id: 2, title: "Second Blog", author: "User", content: "Welcome!" }
];

// Signup
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashpass = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashpass });
    await user.save();
    res.send('data is save on your monogodb data base ');
  } catch (err) {
    res.status(500).send("Signup failed");
    console.error('Save error:', err);
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const client = await User.findOne({ email });
  if (!client) return res.json({ success: false, error: 'user not found' });

  const isMatch = await bcrypt.compare(password, client.password);
  if (!isMatch) return res.json({ success: false, error: 'wrong password' });

  const token = jwt.sign({ email: client.email }, "secretKey", { expiresIn: '1h' });
  res.json({ success: true, token });
});

// Blog list (GET all blogs)
app.get('/api/blog', (req, res) => {
  res.json(blogs);
});

// Single blog (GET by id)
app.get('/api/blog/:id', (req, res) => {
  const blog = blogs.find(b => b._id == req.params.id);
  if (!blog) return res.status(404).send('Blog not found');
  res.json(blog);
});

// Write blog (POST)
app.post('/api/blog', (req, res) => {
  const { title, content } = req.body;
  const author = req.body.author || "Admin";
  const newBlog = { _id: blogs.length + 1, title, author, content };
  blogs.push(newBlog);
  res.json({ success: true, blog: newBlog });
});

// OTP store (simple in-memory)
const otpStore = {};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shahebazk224@gmail.com',
    pass: 'ulvq qdoh vqvf eijt'
  }
});

// Forgot password (send OTP)
app.post('/forgot', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.send('User not found!');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    await transporter.sendMail({
      from: 'shahebazk224@gmail.com',
      to: email,
      subject: 'Verification code',
      text: `Your OTP code is: ${otp} to change your current password`
    });

    res.send('OTP sent to your email!');
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).send('Server error');
  }
});

// OTP verify route
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] === otp) {
    delete otpStore[email];
    res.send('OTP verified, you can reset your password.');
  } else {
    res.status(400).send('Invalid OTP');
  }
});

// Reset password
app.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashpass = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { $set: { password: hashpass } });
    res.send('Password reset successful!');
  } catch (err) {
    res.status(500).send('Error resetting password');
  }
});

app.listen(5002, () => {
  console.log('running.....');
});