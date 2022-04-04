<script setup>
import { ref, onMounted } from 'vue'
import abi from '../assets/abi.json'
import { ethers } from 'ethers'
import axios from 'axios'

defineProps({
  msg: String
})

const count = ref(0)
const msg = ref("")
const inputMsg = ref("")
const txHash = ref("")
const gasLimit = ref(0)

let contract = {}

onMounted(async()=> {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", [])
  contract = new ethers.Contract(
    '0x0eEee5E85bbAD93d95Ea76b26675aA38740CAa38',
    abi,
    provider.getSigner()
  )

  axios.get('https://express-vercel-amber-six.vercel.app/greet').then(res => {
    msg.value = res.data
  })
})

const setGreeting = async () => {
  const tx = await contract.setGreeting(inputMsg.value, {gasLimit: gasLimit.value})
  txHash.value = tx.hash
  await tx.wait()
  window.location.reload()
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
  <input v-model="gasLimit" />
  <br/>
  <button type="button" @click="setGreeting">Set Greeting</button>
  <br/>
  <h1 style="color:red">{{ txHash }}</h1>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
