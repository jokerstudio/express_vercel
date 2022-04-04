// Add Express
const express = require("express");
const fs = require('fs');

// Initialize Express
const app = express();

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/products", (req, res) => {
  res.send(abi);
});

// Initialize server
app.listen(5000, () => {
  const rawJson = fs.readFileSync('./abi.json')
  abi = JSON.parse(rawJson)
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;