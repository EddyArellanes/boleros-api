const sb = require('../lib/superboletos')
const crypto = require('../lib/crypto')

module.exports = {

  metadata: () => ({
    name: 'GetCanceledEvents',
  }),

  invoke: (conversation, done) => {

    sb.getAllEventos().then(_eventos => {

      const model = conversation.MessageModel()
      const eventos = crypto.decryptArrayRecursive(_eventos).filter(e => e.status == 'CANCELADO')

      if (eventos.length > 0) {

        const cards = eventos.slice(0, 10).map(e => model.cardObject(
          `${e.event_name}`,
          `${e.city} ${e.venue_name} - ${e.dates}`,
          e.images.venue_android_app.main.xxhdpi,
          null, [            
            model.shareActionObject('Compartir', e.images.venue_android_app.main.xxhdpi)           
          ]
        ))

        conversation.reply(model.cardConversationMessage('horizontal', cards))

      } else {
        conversation.reply('No hay eventos cancelados por el momento...')
      }

      conversation.keepTurn(true)
      conversation.transition()
      done()

    }).catch(err => {
      conversation.reply(err.message)
      conversation.transition()
      done()
    })

  }
}