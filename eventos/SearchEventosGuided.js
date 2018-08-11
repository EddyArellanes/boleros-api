const sb = require('../lib/superboletos')
const strings = require('../lib/strings_esMX')
const crypto = require('../lib/crypto')
const natural = require('natural')
const _ = require('lodash')

const SEARCH_TRESHOLD = 0.8
const REMOVE_TRESHOLD = 0.8
const REMOVE_ENTITIES = 'concierto,toquin,teatro,conferencia,ponencia,deportes,partido,juego,familiar,niños,feria,expo,jaripeo,tardeada,palenque,teatro,obra,musical'
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
      if (natural.JaroWinklerDistance(nameToken, queryToken) >= SEARCH_TRESHOLD) similarWords++
    }
  }

  return similarWords

}

module.exports = {

  metadata: () => ({
    name: 'SearchEventosGuided',
    supportedActions: ['NoResult'],
    properties: {
      ciudad: {
        type: 'string',
        required: true
      },
      tipo_evento: {
        type: 'string',
      },
      nombre: {
        type: 'string',
      }
    }
  }),

  invoke: (conversation, done) => {

    const model = conversation.MessageModel()
    let props = conversation.properties()

    let eventos = []

    // conversation.reply('DEBUG: ' + JSON.stringify(conversation.nlpResult().entityMatches('CIUDAD')))
    props.ciudad = conversation.nlpResult().entityMatches('CIUDAD').length > 0 ? conversation.nlpResult().entityMatches('CIUDAD')[0] : null

    if(props.ciudad == null){
      props.ciudad =  conversation.postback().variables.value
    }

    sb.getAllEventos().then(_eventos => {

      // city is alwayes required

      if (props.ciudad && !props.tipo_evento && !props.nombre) {

        // only city is available, load the nearest events on that city
        // TODO: Implementar logica
        //conversation.reply('Encontré éstos eventos en ' + props.ciudad + ' para tí :D' )
        eventos = _eventos.filter(e => natural.JaroWinklerDistance(props.ciudad.toLowerCase(), crypto.decryptString(e.city).toLowerCase()) >= SEARCH_TRESHOLD)

      } else if (props.ciudad && !props.tipo_evento && props.nombre) {

        // only name and city is present
        eventos = _.orderBy(_eventos.map(e => {
          e.similarWords = similarityEventName(crypto.decryptString(e.event_name).toLowerCase(), props.nombre.toLowerCase())
          return e
        }), 'similarWords').filter(e => e.similarWords > 0)

        eventos = eventos.filter(e => natural.JaroWinklerDistance(props.ciudad.toLowerCase(), crypto.decryptString(e.city).toLowerCase()) >= SEARCH_TRESHOLD)

      } else if (props.ciudad && props.tipo_evento && !props.nombre) {

        // only event_type and city is present
        eventos = _eventos.filter(e => natural.JaroWinklerDistance(props.ciudad.toLowerCase(), crypto.decryptString(e.city).toLowerCase()) >= SEARCH_TRESHOLD)
        eventos = eventos.filter(e => natural.JaroWinklerDistance(props.tipo_evento.toLowerCase(), crypto.decryptString(e.event_type).toLowerCase()) >= SEARCH_TRESHOLD)

      } else if (props.ciudad && props.tipo_evento && props.nombre) {

        // full search
        eventos = _.orderBy(_eventos.map(e => {
          e.similarWords = similarityEventName(crypto.decryptString(e.event_name).toLowerCase(), props.nombre.toLowerCase())
          return e
        }), 'similarWords').filter(e => e.similarWords > 0)

        eventos = _eventos.filter(e => natural.JaroWinklerDistance(props.ciudad.toLowerCase(), crypto.decryptString(e.city).toLowerCase()) >= SEARCH_TRESHOLD)
        eventos = eventos.filter(e => natural.JaroWinklerDistance(props.tipo_evento.toLowerCase(), crypto.decryptString(e.event_type).toLowerCase()) >= SEARCH_TRESHOLD)

      }

      // handle when no events
      if (eventos.length > 0) {

        //conversation.reply(eventos.length + ' eventos disponibles')
        const cards = eventos.slice(0, 10).map(e => model.cardObject(
          crypto.decryptString(e.event_name),
          `${crypto.decryptString(e.city)} ${crypto.decryptString(e.venue_name)} - ${crypto.decryptString(e.dates)}`,
          crypto.decryptString(e.images.venue_android_app.main.xxhdpi),
          null, [
            model.postbackActionObject('Seleccionar', null, e.event_id),
            model.shareActionObject('Compartir', crypto.decryptString(e.images.venue_android_app.main.xxhdpi))           
          ]
        ))
        conversation.reply('Encontré éstos eventos en ' + props.ciudad + ' para tí :D' )
        conversation.reply(model.cardConversationMessage('horizontal', cards))
        conversation.transition()
        done()

      } else {

        conversation.reply('No encontramos eventos con tus criterios de búsqueda :( Pero te recomendamos los siguientes eventos :D')
        //conversation.reply('Encontré éstos eventos para ti')

        const cards = _eventos.slice(0, 10).map(e => model.cardObject(
          crypto.decryptString(e.event_name),
          `${crypto.decryptString(e.city)} ${crypto.decryptString(e.venue_name)} - ${crypto.decryptString(e.dates)}`,
          crypto.decryptString(e.images.venue_android_app.main.xxhdpi),
          null, 
          [
            model.postbackActionObject('Seleccionar', null, crypto.decryptString(e.event_id)),
            model.shareActionObject('Compartir', crypto.decryptString(e.images.venue_android_app.main.xxhdpi))           
          ]
        ))

        conversation.reply(model.cardConversationMessage('horizontal', cards))
        conversation.transition('NoResult')
        done()

      } 

    }).catch(err => {
      conversation.reply(e.message)
      conversation.transition()
      done()
    })

  }

}
