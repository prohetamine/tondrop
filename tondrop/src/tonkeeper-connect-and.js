const sleep = ms => new Promise(res => setTimeout(res, ms))

const waitSelector = cbSelector => new Promise((res, rej) => {
  const timeId = setInterval(() => {
    if (!!cbSelector()) {
      clearInterval(timeId)
      clearTimeout(exitId)
      res()
    }
  }, 100)

  const exitId = setTimeout(() => {
    clearInterval(timeId)
    rej()
  }, 60000 * 5)
})

;(async () => {
  const ButtonsContainer = [...document.querySelectorAll('button')].find(d => window.getComputedStyle(d).background?.match(/46/)).parentElement

  for (;;) {
    await waitSelector(() => [...document.querySelectorAll('button')].find(button => button.innerText.match(/Connect wallet/)))
    ;[...document.querySelectorAll('button')].find(button => button.innerText.match(/Connect wallet/)).click()

    await waitSelector(() => [...document.querySelectorAll('button')].find(button => button.innerText.match(/Confirm/)))
    ;[...document.querySelectorAll('button')].find(button => button.innerText.match(/Confirm/)).click()
    
    const nextWalletIndex = [...ButtonsContainer.querySelectorAll('button')].findIndex(d => window.getComputedStyle(d).background?.match(/46/)) + 1

    console.log(`Wallet index: ${nextWalletIndex}`)

    ButtonsContainer.querySelectorAll('button')[nextWalletIndex].click()
  }
})()
