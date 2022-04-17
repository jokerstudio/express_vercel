<script setup>
import { ref, onMounted } from 'vue'
import abi from '../assets/abi.json'
import { ethers, utils } from 'ethers'
import axios from 'axios'

defineProps({
  msg: String
})

const count = ref(0)
const msg = ref('')
const inputMsg = ref('')
const txHash = ref('')
const gasLimit = ref(0)

let provider = {}
let signer = {}
const contractAddress = '0x52AF553ea22e673a6d7E1Bdba6a8cEf7A502D814'

onMounted(async()=> {
  provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', [])

  // network N block
  console.log(await provider.getNetwork())
  console.log(await await provider.getGasPrice())
  console.log(await provider.getBlockNumber())
  console.log(await provider.getBlock(await provider.getBlockNumber()))
  console.log(parseInt(await provider.getBalance("0xC2B1a26A3AA3847bCeeCE6Cc41C6B7F9beDA8f0A")))

  // signer
  signer = provider.getSigner()
  console.log(await signer.getAddress())
  
  // utils
  console.log(utils.parseEther("1.0")) // ether to wei
  console.log(utils.formatEther("1000000000000000000")) // wei to ether
  console.log(utils.formatUnits("1000000000000000000", 'gwei')) // wei to (decimal or unit name)
  console.log(utils.formatUnits("1000000000000000000", 10))
  console.log(utils.hexlify(1))
  console.log(utils.hexlify(utils.toUtf8Bytes('Under The Dev')))
  console.log(utils.toUtf8String('0x556e6465722054686520446576'))
  
  // event
  const filter = {
    address: contractAddress,
    topics: [
        // the name of the event, parnetheses containing the data type of each event, no spaces
        utils.id("SetGreeting(address,string)"),
        utils.hexZeroPad("0xC2B1a26A3AA3847bCeeCE6Cc41C6B7F9beDA8f0A", 32)
    ],
    fromBlock: 0,
  }

  const logs = await provider.getLogs(filter)
  console.log(logs)

  provider.on(filter, (event) => {
      console.log(event)
  })

  ////////////////////////////////////////////////////////////////////////////////

  // contract event
  const contract = new ethers.Contract(
    contractAddress,
    abi,
    provider // provider or signer
  )

  const eventFilter = await contract.filters.SetGreeting()
  let events = await contract.queryFilter(eventFilter)
  events.forEach(event => {
    console.log(event.args.from, event.args.greeting)
  })

  contract.on("SetGreeting", (from, message) => {
    console.log(from, message)
  })
  
  // metamask
  window.ethereum.on('accountsChanged', (accounts) => {
    window.location.reload()
  })

  window.ethereum.on('chainChanged', (chainId) => {
    window.location.reload()
  })

  axios.get('https://express-vercel-amber-six.vercel.app/greet').then(res => {
    msg.value = res.data
  })
})

async function transfer() {
  const txCount = await provider.getTransactionCount(signer.getAddress())

  //build the raw transaction
  const rawTx = {
    nonce: utils.hexlify(txCount),
    from: signer.getAddress(),
    to: "0xCf9AE5320563160017e7BAb917F7A5F88AAEEb69",
    value: utils.parseEther("0.001"),
    gasLimit: utils.hexlify(30000),
    gasPrice: utils.hexlify(parseInt(await provider.getGasPrice())),
  }

  // const rawTx = {
  //   to: "0xCf9AE5320563160017e7BAb917F7A5F88AAEEb69",
  //   value: utils.parseEther("0.001"),
  // }

  const tx = await signer.sendTransaction(rawTx)
  console.log(tx.hash)
  await tx.wait()
}

async function callGreet() {
  const ABI = ["function greet() view returns (string)"]
  const iface = new utils.Interface(ABI)
  const encodedData = iface.encodeFunctionData("greet")
  const response = await provider.call({
    to: contractAddress,
    data: encodedData
  })

  console.log(utils.toUtf8String(response))
}

async function setGreetingWithRawTx() {
  const txCount = await provider.getTransactionCount(signer.getAddress())
  const ABI = ["function setGreeting(string _greeting)"]
  const iface = new utils.Interface(ABI)
  const encodedData = iface.encodeFunctionData("setGreeting", ["Joker Studio"])

  // build the raw transaction
  const rawTx = {
    nonce: utils.hexlify(txCount),
    from: signer.getAddress(),
    to: contractAddress,
    data: encodedData,
    gasLimit: utils.hexlify(100000),
    gasPrice: utils.hexlify(parseInt(await provider.getGasPrice())),
  }

  const tx = await signer.sendTransaction(rawTx)
  await tx.wait()
  console.log(tx.hash)
}

async function setGreeting() {
  const contract = new ethers.Contract(
    contractAddress,
    abi,
    provider // provider or signer
  )
  const tx = await contract.connect(signer).setGreeting("Under The Dev")
  //const tx = await contract.setGreeting("Under The Dev")
  console.log(tx.hash)
  await tx.wait()
}

async function transferWithWallet() {
  const alchemyProvider = new ethers.providers.JsonRpcProvider("alchemyUrl")
  // Create a wallet instance
  const wallet = new ethers.Wallet("privateKey", alchemyProvider)

  // build the raw transaction
  const rawTx = {
    to: "0xCf9AE5320563160017e7BAb917F7A5F88AAEEb69",
    value: utils.parseEther("0.001"),
    gasLimit: utils.hexlify(30000),
    gasPrice: utils.hexlify(parseInt(await provider.getGasPrice())),
  }

  const tx = await wallet.sendTransaction(rawTx)
  console.log(tx.hash)
  await tx.wait()
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Documentation
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    {{ msg }}
  </p>
  <input v-model="inputMsg" />
  <br/>
  <button type="button" @click="transfer">Transfer</button>
  <br/>
  <button type="button" @click="callGreet">Call greet</button>
  <br/>
  <button type="button" @click="setGreetingWithRawTx">Set Greeting With Raw Tx</button>
  <br/>
  <button type="button" @click="setGreeting">Set Greeting</button>
  <br/>
  <button type="button" @click="transferWithWallet">Tranfer with wallet</button>
  <br/>
  <h1 style="color:red">{{ txHash }}</h1>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
