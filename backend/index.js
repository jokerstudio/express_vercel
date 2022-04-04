// Add Express
const express = require("express");
const { join } = require('path');
const fs = require('fs');
const eth = require('ethers')

// Initialize Express
const app = express();

app.use((req, res, next) => {
  const rawJson = fs.readFileSync(join(__dirname, 'abi.json'), 'utf8');
  const abi = JSON.parse(rawJson);
  const privateKey = `${process.env.PRIVATE_KEY}`;
  const provider = new eth.providers.JsonRpcProvider('https://eth-rinkeby.alchemyapi.io/v2/h8PKfl8mDeaHhmiSYsDC1GwsEFDi8cVI', 4);
  const signer = new eth.Wallet(privateKey, provider);
  const contract = new eth.Contract(
    '0x0eEee5E85bbAD93d95Ea76b26675aA38740CAa38',
    abi,
    signer
  );
  req.abi = abi;
  req.contract = contract;
  console.log('Time:', Date.now());
  next();
});

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/greet", async (req, res) => {
  const greet = await req.contract.greet("Joker: ")
  res.send(greet);
});

app.get("/greeting/:msg", async (req, res) => {
  const msg = req.params.msg;
  const tx = await req.contract.greeting(msg);
  res.send(tx.hash)
});


app.get("/abi", (req, res) => {
  res.send(req.abi);
});


// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;