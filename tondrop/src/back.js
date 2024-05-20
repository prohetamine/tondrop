const { TonClient, WalletContractV4, internal } = require("@ton/ton")
const { mnemonicNew, mnemonicToPrivateKey } = require("@ton/crypto")
const sleep = require('sleep-promise')
const fs = require('fs')
const path = require('path')

const isDev = false

const wallets = path.join(__dirname, '..', 'data', 'wallets')

const dataWallets = fs.readdirSync(wallets)
  .map(
    wallet => 
      JSON.parse(
        fs.readFileSync(path.join(wallets, wallet), 'utf8')
      )
  )
  .map(wallet => ({
    ...wallet,
    balance: BigInt(wallet.balance),
    path: path.join(wallets, wallet.title)
  }))
  .sort((a, b) => parseInt(a.title.match(/\d+/)[0]) - parseInt(b.title.match(/\d+/)[0]))

class BigDecimal {
  constructor(value) {
      let [ints, decis] = String(value).split(".").concat("");
      decis = decis.padEnd(BigDecimal.decimals, "0");
      this.bigint = BigInt(ints + decis);
  }
  static fromBigInt(bigint) {
      return Object.assign(Object.create(BigDecimal.prototype), { bigint });
  }
  divide(divisor) {
      return BigDecimal.fromBigInt(this.bigint * BigInt("1" + "0".repeat(BigDecimal.decimals)) / divisor.bigint);
  }
  toString() {
      const s = this.bigint.toString().padStart(BigDecimal.decimals+1, "0");
      return s.slice(0, -BigDecimal.decimals) + "." + s.slice(-BigDecimal.decimals)
              .replace(/\.?0+$/, "");
  }
}

BigDecimal.decimals = 10

;(async () => {
  const client = new TonClient({
    apiKey: '7cc90cb26f3623cfd2848838a8267ac614dae7bc715f68fbfd6be620a776a1cd',
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  })

  const mnemonics = isDev 
                    ? ["scissors", "praise", "reward", "oppose", "unfair", "cupboard", "maid", "crumble", "honey", "toddler", "dry", "cargo", "route", "accuse", "dish", "lava", "vintage", "day", "grid", "adjust", "sibling", "trust", "hamster", "rally"]
                    : ['wave', 'guide', 'ship', 'unlock', 'stamp', 'kiwi', 'better', 'express', 'sword', 'stamp', 'total', 'flower', 'salon', 'vocal', 'car', 'gym', 'relief', 'trouble', 'skate', 'thought', 'address', 'then', 'protect', 'wisdom']

  const mainKeyPair = await mnemonicToPrivateKey(mnemonics)

  const _mainWallet = WalletContractV4.create({ 
    workchain: 0, 
    publicKey: mainKeyPair.publicKey 
  })

  const mainContract = client.open(_mainWallet)

  const mainBalance = await mainContract.getBalance()

  const divNum = new BigDecimal(1e9)

  console.log(`Main wallet balance: ${(new BigDecimal(mainBalance)).divide(divNum).toString()} TON`)

  for (let x = 0; x < 100; x++) {
    const { mnemonic, address } = dataWallets[x]

    const keyPair = await mnemonicToPrivateKey(mnemonic)

    const wallet = WalletContractV4.create({ 
      workchain: 0, 
      publicKey: keyPair.publicKey 
    })

    const contract = client.open(wallet)

    const balance = await contract.getBalance()

    const _balance = new BigDecimal(balance)
        , divNum = new BigDecimal(1e9)

    console.log(`#${x} Wallet ${address} balance: ${parseFloat(_balance.divide(divNum).toString())} TON`)

    if (BigInt(balance) > BigInt(1000000000)) {
      const seqno = await contract.getSeqno();
        
      const payload = { 
        value: '5.08',
        to: 'UQC3jOXwrqnv015NC_NO8zlahW3RuYk4Q4wM8L_ZHMK30uQv',
        bounce: false
      }

      await contract.sendTransfer({
        seqno,
        secretKey: keyPair.secretKey,
        messages: [internal(payload)]
      })

      console.log(payload)
    } else {
      console.log('Empty')
    }
  }
})()