const express = require('express');

const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());





app.listen(port, () => {
  console.log(`To-Do list is active on port ${port}`);
})