module.exports = {

  metadata: () => ({
    name: 'GetPresaleCode',
  }),

  invoke: (conversation, done) => {

    conversation.variable('presaleCode', conversation.text())
    conversation.reply('Presale code: ' + conversation.variable('presaleCode'))
    conversation.transition()
    done()

  }

}
