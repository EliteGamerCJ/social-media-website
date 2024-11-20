const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/socialmedia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Handle client-side routing, return all requests to the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
