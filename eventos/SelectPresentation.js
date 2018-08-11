const sb = require('../lib/superboletos')
const strings = require('../lib/strings_esMX')
const crypto = require('../lib/crypto')
const _ = require('lodash')

module.exports = {

  metadata: () => ({
    name: 'SelectPresentation',
    supportedActions: ['PrePurchase', 'EventsFlowPresentationFail', 'GetPresaleCode']
  }),

  invoke: (conversation, done) => {

    const model = conversation.MessageModel()
    const presentation = conversation.postback().split('|')[0]

    const presentations = conversation.variable('presentations')
    const evento = JSON.parse(conversation.variable('eventoRaw'))
    const presentation_obj = evento.categories.presentations.filter(p => p.id == presentation)[0]

    if (presentations.indexOf(presentation) >= 0) {

      if (presentation_obj.presale_id == 0) {

        // Es presale
        // Validate presale_type 
        if (presentation_obj.presale_type == 'PRODUCTO_BANCARIO') {
          
        } else if (presentation_obj.presale_type == 'CODIGO' || presentation_obj.presale_type == 'FAN') {
          
        } else if (presentation_obj.presale_type == 'ABONADO') {

        }

      } else {

        // No es presale
        conversation.variable('selectedPresentation', conversation.postback())      
        conversation.variable('presentationId',conversation.postback().split('|')[0])
        conversation.variable('presentationName',conversation.postback().split('|')[1])
        conversation.variable('presentationElementType',conversation.postback().split('|')[2])
        conversation.variable('presentationRenewST',conversation.postback().split('|')[3])
        conversation.variable('presentationRechargeST',conversation.postback().split('|')[4])      
        conversation.variable('presentationPresaleType',conversation.postback().split('|')[5])  
        //conversation.reply(`Seleccionaste ${conversation.postback().split(' ')[1]}`)      
        conversation.keepTurn(true)
        conversation.transition('PrePurchase')
        done()
  
      }
      
    } else {
      conversation.reply('Está presentación ya no está disponible :/')
      conversation.keepTurn(true)
      conversation.transition('EventsFlowPresentationFail')
      done()
    }

  }

}
