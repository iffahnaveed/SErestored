const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);


app.listen(5002, () => {
  console.log('Server running on port 5002');
});
module.exports = app; // This line is crucial for testing
