/*
  Create an HDNode wallet using bch-js. The mnemonic from this wallet
  will be used by later examples.
*/

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet'

// REST API servers.
const MAINNET_API_FREE = 'https://free-main.fullstack.cash/v3/'
const TESTNET_API_FREE = 'https://free-test.fullstack.cash/v3/'
// const MAINNET_API_PAID = 'https://api.fullstack.cash/v3/'
// const TESTNET_API_PAID = 'https://tapi.fullstack.cash/v3/'

// bch-js-examples require code from the main bch-js repo
const BCHJS = require('@psf/bch-js')

// Instantiate bch-js based on the network.
let bchjs
if (NETWORK === 'mainnet') bchjs = new BCHJS({ restURL: MAINNET_API_FREE })
else bchjs = new BCHJS({ restURL: TESTNET_API_FREE })

const fs = require('fs')

const lang = 'english' // Set the language of the wallet.

// These objects used for writing wallet information out to a file.
const outStr = ''
const outObj = {}
const outObj1 = {}

async function createWallets () {
  try {
    // create 256 bit BIP39 mnemonic
    const sellerMnemonic = bchjs.Mnemonic.generate(
      128,
      bchjs.Mnemonic.wordLists()[lang]
    )
    const buyerMnemonic = bchjs.Mnemonic.generate(
      128,
      bchjs.Mnemonic.wordLists()[lang]
    )

    // root seed buffer
    const sellerRootSeed = await bchjs.Mnemonic.toSeed(sellerMnemonic)
    const buyerRootSeed = await bchjs.Mnemonic.toSeed(buyerMnemonic)

    // master HDNode
    const sellerMasterHDNode = bchjs.HDNode.fromSeed(sellerRootSeed)
    const buyerMasterHDNode = bchjs.HDNode.fromSeed(buyerRootSeed)

    const sellerChildNode = sellerMasterHDNode.derivePath("m/44'/145'/0'/0/0")
    const buyerChildNode = buyerMasterHDNode.derivePath("m/44'/145'/0'/0/0")

    const sellerObj = {}
    sellerObj.cashAddress = bchjs.HDNode.toCashAddress(sellerChildNode)
    sellerObj.legacyAddress = bchjs.HDNode.toLegacyAddress(sellerChildNode)
    sellerObj.slpAddress = bchjs.SLP.HDNode.toSLPAddress(sellerChildNode)
    sellerObj.WIF = bchjs.HDNode.toWIF(sellerChildNode)

    const buyerObj = {}
    buyerObj.cashAddress = bchjs.HDNode.toCashAddress(buyerChildNode)
    buyerObj.legacyAddress = bchjs.HDNode.toLegacyAddress(buyerChildNode)
    buyerObj.slpAddress = bchjs.SLP.HDNode.toSLPAddress(buyerChildNode)
    buyerObj.WIF = bchjs.HDNode.toWIF(buyerChildNode)

    // Write out the basic information into a json file for other example apps to use.
    fs.writeFile(
      'seller-wallet.json',
      JSON.stringify(sellerObj, null, 2),
      function (err) {
        if (err) return console.error(err)
        console.log('seller-wallet.json written successfully.')
      }
    )

    // Write out the basic information into a json file for other example apps to use.
    fs.writeFile(
      'buyer-wallet.json',
      JSON.stringify(buyerObj, null, 2),
      function (err) {
        if (err) return console.error(err)
        console.log('buyer-wallet.json written successfully.')
      }
    )
  } catch (err) {
    console.error('Error in createWallet(): ', err)
  }
}
createWallets()
