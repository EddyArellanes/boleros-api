module.exports = {

  metadata: () => ({
    name: 'PrintPostback',
  }),

  invoke: (conversation, done) => {

    conversation.reply('Postback: ' + conversation.postback())

    conversation.transition()
    done()

  }

}
