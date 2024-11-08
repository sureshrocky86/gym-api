const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const userRoutes = require('../functions/userRoutes');
const cors = require('cors');
const ServerlessHttp = require('serverless-http');
require('dotenv').config(); // Load environment variables from .env file


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use('/api', userRoutes);

app.use(express.static(path.join(__dirname, '../../gym-app/dist/gym-app')));
app.use('/*', function(req, res){
 res.sendFile(path.join(__dirname + '.../../gym-app/dist/gym-app/index.html'));
})


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log(`MongoDB connected`))
.catch(err => console.log(err));

// Sample route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports.handler = ServerlessHttp(app);