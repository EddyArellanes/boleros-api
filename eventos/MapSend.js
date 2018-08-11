const sb = require('../lib/superboletos')
const crypto = require('../lib/crypto')

module.exports = {

  metadata: () => ({
    name: 'MapSend',
    supportedActions: ['PurchaseShowSeats', 'PurchaseAdditionalServices']   
  }),

  invoke: (conversation, done) => {

    const model = conversation.MessageModel()
    const urlMapParams = `${sb.MAP_PLUGIN}?userIdSe=${conversation.userId()}&apiKey=${sb.API_KEY}&eventId=${conversation.variable("eventId")}&elementType=${conversation.variable("presentationElementType")}&presentationId=${conversation.variable("presentationId")}&userId=${conversation.variable("userId")}&presaleType=${conversation.variable("presentationPresaleType")}&transactionId=${conversation.variable("transactionId")}`

    let cards = []
     

    conversation.variable("urlMap", urlMapParams)
    cards.push(model.cardObject(
        "Seleccionar Lugares",
        "Mapa interactivo",
        null,
        null, 
        [
          model.urlActionObject('Abrir', null, conversation.variable("urlMap"))
        ]
    ))
    conversation.reply(model.cardConversationMessage('horizontal', cards))    
    conversation.transition('PurchaseAdditionalServices')
    
    done()

  }

}
