const fs = require('fs')
const path = require('path')

const wallets = path.join(__dirname, '..', 'data', 'wallets')

const dataWallets = fs.readdirSync(wallets)
  .filter(wallet => wallet !== 'wallet_0')
  .map(
    wallet => 
      JSON.parse(
        fs.readFileSync(path.join(wallets, wallet), 'utf8')
      )
  )
  .sort((a, b) => parseInt(a.title.match(/\d+/)[0]) - parseInt(b.title.match(/\d+/)[0]))

fs.writeFileSync(path.join(__dirname, 'data', 'build-wallets.js'), `window.___wallets = ${JSON.stringify(dataWallets)}`)