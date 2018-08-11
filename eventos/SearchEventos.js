const sb = require('../lib/superboletos')
const strings = require('../lib/strings_esMX')
const crypto = require('../lib/crypto')
const natural = require('natural')
const _ = require('lodash')

const SEARCH_TRESHOLD = 0.8
const REMOVE_TRESHOLD = 0.8
const REMOVE_ENTITIES = 'mty,monterrey,nuevo,leon,cdmx,ciudad de mexico,df,d.f.,cedemex,distrito federal,chilangolandia,concierto,toquin,teatro,conferencia,ponencia,deportes,partido,juego,familiar,niños,feria,expo,jaripeo,tardeada,palenque,teatro,obra,musical'
const REMOVE_WORDS = ('la,las,los,lo,les,en,para,con,contra,ahi,si,dentro,afuera,cerca,de,por,' + REMOVE_ENTITIES).split(',')

const extractName = query => query.toLowerCase().split(' ').filter(word => !isBadWord(word)).join(' ')

const isBadWord = word => {
  for (const index in REMOVE_WORDS) {
    if (natural.JaroWinklerDistance(word, REMOVE_WORDS[index]) >= REMOVE_TRESHOLD) {
      return true
    }
  }
  return false
}

const similarityEventName = (name, query) => {

  const nameTokens = name.split(' ')
  const queryTokens = query.split(' ')
  let similarWords = 0

  for (const nameToken of nameTokens) {
    for (const queryToken of queryTokens) {
      if (natural.JaroWinklerDistance(nameToken.toLowerCase(), queryToken.toLowerCase()) >= SEARCH_TRESHOLD) similarWords++
    }
  }

  return similarWords

}

module.exports = {

  metadata: () => ({
    name: 'SearchEventos',
    supportedActions: ['NoResult'],
  }),

  invoke: (conversation, done) => {
    
    const model = conversation.MessageModel()

    const ciudad = conversation.nlpResult().entityMatches('CIUDAD').length > 0 ? conversation.nlpResult().entityMatches('CIUDAD')[0] : null
    const tipo_evento = conversation.nlpResult().entityMatches('TIPO_EVENTO').length > 0 ? conversation.nlpResult().entityMatches('TIPO_EVENTO')[0] : null
    const event_name = extractName(conversation.text())

    //conversation.reply('CIUDAD: ' + JSON.stringify(conversation.nlpResult().entityMatches('CIUDAD')))
    //conversation.reply('TIPO_EVENTO: ' + JSON.stringify(conversation.nlpResult().entityMatches('TIPO_EVENTO')))
    //conversation.reply('NOMBRE: ' + event_name)

    let eventos = []

    sb.getAllEventos().then(_eventos => {

      // filter by name
      eventos = _.orderBy(_eventos.map(e => {
        e.similarWords = similarityEventName(crypto.decryptString(e.event_name).toLowerCase(), event_name.toLowerCase())
        return e
      }), 'similarWords').filter(e => e.similarWords > 0)

      /*eventos = _eventos.map(e => {
        e.nombre = crypto.decryptString(e.event_name)
        return e
      }).filter(e => natural.JaroWinklerDistance(e.nombre, event_name) >= SEARCH_TRESHOLD)*/

      if (ciudad) {
        eventos = eventos.filter(e => natural.JaroWinklerDistance(ciudad.toLowerCase(), crypto.decryptString(e.city).toLowerCase()) >= SEARCH_TRESHOLD)
      }

      if (tipo_evento) {
        eventos = eventos.filter(e => natural.JaroWinklerDistance(tipo_evento.toLowerCase(), crypto.decryptString(e.event_type).toLowerCase()) >= SEARCH_TRESHOLD)
      }

      // handle when no events
      if (eventos.length > 0) {
        const stringReply = (eventos.length > 1) ? 'Eventos' : 'Evento'
        conversation.reply('Encontré ' + eventos.length + ' '+ stringReply + ' para tí :)')

        const cards = eventos.slice(0, 10).map(e => model.cardObject(
          crypto.decryptString(e.event_name),
          `${crypto.decryptString(e.city)} ${crypto.decryptString(e.venue_name)} - ${crypto.decryptString(e.dates)}`,
          crypto.decryptString(e.images.venue_android_app.main.xxhdpi),
          null, [
            model.postbackActionObject('Seleccionar', null, e.event_id),
            model.shareActionObject('Compartir', crypto.decryptString(e.images.venue_android_app.main.xxhdpi))           
          ]
        ))

        conversation.reply(model.cardConversationMessage('horizontal', cards))        
        conversation.transition()
        done()

      } else {

        conversation.reply('No encontramos eventos con tus criterios de búsqueda :( ... Pero te recomendamos los siguientes eventos :D')
        //conversation.reply('Encontré éstos eventos para ti')

        const cards = _eventos.slice(0, 10).map(e => model.cardObject(
          `${similarWords} | ${crypto.decryptString(e.event_name)}`,
          `${crypto.decryptString(e.city)} ${crypto.decryptString(e.venue_name)} - ${crypto.decryptString(e.dates)}`,
          crypto.decryptString(e.images.venue_android_app.main.xxhdpi),
          null, [
            model.postbackActionObject('Seleccionar', null, e.event_id),
            model.shareActionObject('Compartir', crypto.decryptString(e.images.venue_android_app.main.xxhdpi))           
          ]
        ))

        conversation.reply(model.cardConversationMessage('horizontal', cards))
        conversation.transition()
        done()

      }

    }).catch(err => {
      conversation.reply(e.message)
      conversation.transition()
      done()
    })

  }

}
