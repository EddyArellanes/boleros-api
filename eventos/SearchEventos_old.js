const sb = require('../lib/superboletos')
const strings = require('../lib/strings_esMX')
const crypto = require('../lib/crypto')
const natural = require('natural')

const SEARCH_OFFSET = 0.6

module.exports = {

  metadata: () => ({
    name: 'SearchEventos',
    properties: {
      field: {
        type: 'string',
      },
      query: {
        type: 'string'
      }
    }
  }),

  invoke: (conversation, done) => {

    conversation.reply(strings.LOADING_GET_ALL_EVENTOS)
    const model = conversation.MessageModel()

    let eventos = []

    sb.getAllEventos().then(_eventos => {

      // search by name
      if (conversation.properties().field == 'nombre') {
        eventos = _eventos.map(e => ({nombre: crypto.decryptString(e.event_name), ...e})).filter(e => natural.JaroWinklerDistance(e.nombre, conversation.properties().query) >= SEARCH_OFFSET)
      } else {
        eventos = _eventos
      }

      const cards = eventos.slice(0, 10).map(e => model.cardObject(
        crypto.decryptString(e.event_name),
        `${crypto.decryptString(e.city)} ${crypto.decryptString(e.venue_name)} - ${crypto.decryptString(e.dates)}`,
        crypto.decryptString(e.images.venue_android_app.main.xxhdpi),
        null, [
          model.postbackActionObject('Seleccionar', null, crypto.decryptString(e.event_id))
        ]
      ))

      conversation.reply(model.cardConversationMessage('horizontal', cards))
      conversation.transition()
      done()

    }).catch(err => {
      console.log(err)
      conversation.reply('ERROR: ' + err.message)
      conversation.reply(strings.ERROR_GET_ALL_EVENTOS)
      conversation.transition()
      done()
    })
      
  }

}
