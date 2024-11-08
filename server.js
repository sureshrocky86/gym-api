const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./userRoutes');
const cors = require('cors');
const ServerlessHttp = require('serverless-http');
require('dotenv').config(); // Load environment variables from .env file


const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

app.use((req, res, next) => { 
  if (mongoose.connection.readyState !== 1) { 
    return res.status(503).send('MongoDB connection not ready'); 
  } 
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log(`MongoDB connected`))
.catch(err => console.log(err));

app.use('/api', userRoutes);

// app.use(express.static(path.join(__dirname, '../../gym-app/dist/gym-app')));
// app.use('/*', function(req, res){
//  res.sendFile(path.join(__dirname + '.../../gym-app/dist/gym-app/index.html'));
// })



// Sample route
app.get('/', (req, res) => {
  res.send('API is running...');
});

if (!process.env.IS_SERVERLESS) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports.handler = ServerlessHttp(app);
