const { TonClient, WalletContractV4 } = require("@ton/ton")
const { mnemonicNew, mnemonicToPrivateKey } = require("@ton/crypto")
const fs = require('fs')
const path = require('path')

BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString())
  return int ?? this.toString()
}

;(async () => {
  for (let x = 0; x < 500; x++) {
    const walletPath = path.join(__dirname, '..', 'data', 'wallets', `wallet_${x}`)
  
    if (!fs.existsSync(walletPath)) {
      const mnemonic = await mnemonicNew()

      const client = new TonClient({
        apiKey: '',
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      })
  
      let keyPair = await mnemonicToPrivateKey(mnemonic)
    
      let workchain = 0
    
      let wallet = WalletContractV4.create({ 
        workchain, 
        publicKey: keyPair.publicKey 
      })
  
      let contract = client.open(wallet)    
  
      let balance = await contract.getBalance();
  
      console.log(`Create token: #${(x+1)}`)

      fs.writeFileSync(walletPath, JSON.stringify({
        mnemonic,
        string: mnemonic.join(' '),
        address: wallet.address+'',
        balance: BigInt(balance).toJSON(),
        title: `wallet_${x}`
      }, null, 2))
    }
  }
})()