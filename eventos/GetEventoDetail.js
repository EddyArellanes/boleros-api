const sb = require('../lib/superboletos')
const strings = require('../lib/strings_esMX')
const crypto = require('../lib/crypto')
const _ = require('lodash')

module.exports = {

  metadata: () => ({
    name: 'GetEventoDetail',
  }),

  invoke: (conversation, done) => {
    
    const model = conversation.MessageModel()
    
    //conversation.reply(`Evento con id: ${conversation.variable('userEventId')}`)

    sb.getEventoDetail(conversation.postback()).then(_evento => {

      const evento = crypto.decryptObjectRecursive(_evento)
      conversation.reply('Fechas para ' + evento.event_name)

      let cards = []
      let presentations = []

      //conversation.reply(JSON.stringify(evento))
      conversation.variable('eventId',evento.event_id)
      conversation.variable('eventType',evento.type)
      conversation.variable('eventName',evento.event_name)      
      conversation.variable('eventSelectionType',evento.selection_type)
      conversation.variable('eventoRaw', JSON.stringify(evento))


      for (const key in evento.categories['0'].presentations) {        
        const p = evento.categories['0'].presentations[key]

        // presentationsCards
        presentations.push(p.presentation_id)

        if (typeof p.date == 'string') {

          let date = typeof p.date == 'string' ? p.date : '-'

          cards.push(model.cardObject(
            p.presentation_name,
            `${p.element_type} - ${date}`,
            p.images.venue_android_app.main.xxhdpi,
            null, [
              model.postbackActionObject('Seleccionar', null, `${p.presentation_id  }|${p.presentation_name}|${p.element_type}|${p.renew_season_ticket}|${p.recharge_season_ticket}|${p.presale_type}`),
              model.shareActionObject('Compartir', p.images.venue_android_app.main.xxhdpi)           
            ]
          ))

        }
        
      }
      //I Know now
      conversation.variable('presentations', presentations)
      
      
      conversation.reply(model.cardConversationMessage('horizontal', cards))

      conversation.transition()
      done()

    }).catch(err => {
      console.log(err)
      conversation.reply(err.message)
      conversation.transition()
      done()
    })

  }

}
