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
  const wallets = window.___wallets

  for (let x = 0; x < wallets.length; x++) {
    console.log(`Wallets: ${(x+1)} / ${wallets.length}`)
    const { mnemonic, title } = wallets[x]

    await waitSelector(() => document.querySelector('[d="M8.75 1.75C8.75 1.33579 8.41421 1 8 1C7.58579 1 7.25 1.33579 7.25 1.75V7.25H1.75C1.33579 7.25 1 7.58579 1 8C1 8.41421 1.33579 8.75 1.75 8.75H7.25V14.25C7.25 14.6642 7.58579 15 8 15C8.41421 15 8.75 14.6642 8.75 14.25V8.75H14.25C14.6642 8.75 15 8.41421 15 8C15 7.58579 14.6642 7.25 14.25 7.25H8.75V1.75Z"]')?.parentElement?.parentElement?.parentElement?.click)

    document.querySelector('[d="M8.75 1.75C8.75 1.33579 8.41421 1 8 1C7.58579 1 7.25 1.33579 7.25 1.75V7.25H1.75C1.33579 7.25 1 7.58579 1 8C1 8.41421 1.33579 8.75 1.75 8.75H7.25V14.25C7.25 14.6642 7.58579 15 8 15C8.41421 15 8.75 14.6642 8.75 14.25V8.75H14.25C14.6642 8.75 15 8.41421 15 8C15 7.58579 14.6642 7.25 14.25 7.25H8.75V1.75Z"]').parentElement.parentElement.parentElement.click()

    await waitSelector(() => [...document.querySelectorAll('button')].find(button => button.innerHTML === 'Import existing wallet'))
    
    ;[...document.querySelectorAll('button')].find(button => button.innerHTML === 'Import existing wallet').click()

    await waitSelector(() => document.querySelectorAll('input').length === 24)

    document.querySelectorAll('input').forEach(input => {
      const key = Object.keys(input).find(key => key.match(/__reactProps/))
    
      window._input = input
      input[key].onChange({ target: { value: mnemonic[input.getAttribute('tabindex') - 1] } })
    })

    await waitSelector(() => [...document.querySelectorAll('input')].filter(input => input.value.length > 0).length === 24)

    await waitSelector(() => document.querySelectorAll('button').length === 1 && document.querySelector('button').innerHTML === 'Continue')

    document.querySelector('button').click()

    await waitSelector(() => document.querySelector('input') && document.querySelectorAll('input').length === 1)

    const keyTitleWallet = Object.keys(document.querySelector('input')).find(key => key.match(/__reactProps/))  

    document.querySelector('input')[keyTitleWallet].onChange({ target: { value: title } })

    await waitSelector(() => document.querySelector('input').value.length > 0 && document.querySelector('button[type="submit"]'))

    document.querySelector('button[type="submit"]').click()
  }
})()
