const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const ctfRoutes = require('./routes/ctfRoutes');
const userauth=require('./routes/auth');
// load .env file
dotenv.config();

const app = express();
const PORT =5000;

//middleware 
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//route

app.use('/api', ctfRoutes);
app.use('/api',userauth);

// connect mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(` Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1); 
  });
