// Add Express
const express = require("express");
const { join } = require('path');
const fs = require('fs');

// Initialize Express
const app = express();

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/products", (req, res) => {
  res.send("v2");
});

app.get("/abi", (req, res) => {
  const rawJson = fs.readFileSync(join(__dirname, 'abi.json'), 'utf8');
  const abi = JSON.parse(rawJson)
  res.send(abi);
});


// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;