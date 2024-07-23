import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import listingRouter from './routes/listing.route.js';
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: 'GET,POST,PUT,DELETE', // Allow these methods
  credentials: true, // Allow cookies and authorization headers
}));

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});
app.get('/',(req,res) => {
 res.send("Hello World")
})
// Route middleware
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!', error: err.message });
});

// module.exports = app;