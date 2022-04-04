// Add Express
const express = require("express");
const { join } = require('path');
const fs = require('fs');
const eth = require('ethers')

// Initialize Express
const app = express();

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/greet", async (req, res) => {
  const greet = contract.greet("Joker: ")
  res.send(greet);
});

app.get("/abi", (req, res) => {
  res.send(abi);
});


// Initialize server
app.listen(5000, () => {
  const rawJson = fs.readFileSync(join(__dirname, 'abi.json'), 'utf8');
  abi = JSON.parse(rawJson);
  const provider = new eth.providers.JsonRpcProvider('https://eth-rinkeby.alchemyapi.io/v2/h8PKfl8mDeaHhmiSYsDC1GwsEFDi8cVI', 4)
  contract = new eth.Contract(
    '0x0eEee5E85bbAD93d95Ea76b26675aA38740CAa38',
    abi,
    provider
  )
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;