const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');  
const employeeRoutes = require('./routes/employees');

const app = express();
const PORT = process.env.PORT || 3031;

// Middleware to parse JSON data
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://user:12345@cluster0.jjyyp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    // options removed as they are deprecated
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Could not connect to MongoDB...', err);
});

// Use the auth routes
app.use('/api/v1/user', authRoutes);

// Use the employee routes
app.use('/api/v1/emp', employeeRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
