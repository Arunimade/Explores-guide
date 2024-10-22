const express = require('express'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection string
const mongoURI = 'mongodb+srv://Destudio:8december2003@blog.cewo1.mongodb.net/Explorerguide?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend files if needed

// User schema and model
const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: String,
});
const User = mongoose.model('User', userSchema);

// Blog schema and model
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
});
const Blog = mongoose.model('Blog', blogSchema);

// Expense schema and model
const expenseSchema = new mongoose.Schema({
  date: Date,
  category: String,
  amount: Number,
  description: String,
  type: { type: String, enum: ['personal', 'shared'], required: true },
  participants: String,
  collection: { type: String, enum: ['personal finance', 'shared expenses'], required: true }
});
const Expense = mongoose.model('Expense', expenseSchema);

// TripPlanning schema and model
const tripPlanningSchema = new mongoose.Schema({
  destination: String,
  startDate: Date,
  endDate: Date,
  participants: String,
  notes: String,
});
const TripPlanning = mongoose.model('TripPlanning', tripPlanningSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
    if (!token) return res.sendStatus(401); // No token, unauthorized

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token, forbidden
        req.user = user; // Save user info to request
        next(); // Proceed to the next middleware/route handler
    });
};

// Registration route
app.post('/register', async (req, res) => {
    const { fullName, email, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, username, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered successfully!');
    } catch (error) {
        res.status(500).send('Error registering user: ' + error.message);
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('Invalid username or password');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid username or password');

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ message: 'Login successful!', token });
    } catch (error) {
        res.status(500).send('Error logging in: ' + error.message);
    }
});

// Add a new blog
app.post('/add-blog', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newBlog = new Blog({ title, content });
    await newBlog.save();
    res.status(201).send('Blog added successfully!');
  } catch (error) {
    res.status(500).send('Error adding blog');
  }
});

// Fetch all blogs
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).send('Error fetching blogs');
  }
});

// Add a new trip
app.post('/add-trip', async (req, res) => {
  try {
    const trip = new TripPlanning(req.body);
    await trip.save();
    res.status(201).send('Trip added successfully!');
  } catch (error) {
    res.status(500).send('Error adding trip');
  }
});

// Fetch all trips
app.get('/trips', async (req, res) => {
  try {
    const trips = await TripPlanning.find();
    res.json(trips);
  } catch (error) {
    res.status(500).send('Error fetching trips');
  }
});

// Update a trip
app.put('/update-trip/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTrip = await TripPlanning.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedTrip);
  } catch (error) {
    res.status(500).send('Error updating trip');
  }
});

// Delete a trip
app.delete('/delete-trip/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await TripPlanning.findByIdAndDelete(id);
    res.send('Trip deleted successfully!');
  } catch (error) {
    res.status(500).send('Error deleting trip');
  }
});

// Protected route to access files (for example)
app.get('/files', authenticateToken, (req, res) => {
    // Logic to send files to the user
    res.send('This is a protected file route, accessible only to logged-in users.');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
