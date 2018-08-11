const sb = require('../lib/superboletos')
const crypto = require('../lib/crypto')

module.exports = {

  metadata: () => ({
    name: 'CreateTransaction',
    supportedActions: ['PurchaseTicketRequest', 'Intent']   
  }),

  invoke: (conversation, done) => {
           
   
    const payload = {
      api_key: sb.API_KEY,
      event_id: crypto.encryptString(conversation.variable('eventId')),
      presentation_id: crypto.encryptString(conversation.variable('presentationId')),
      element_type: crypto.encryptString(conversation.variable('presentationElementType')),           
      renew_season_ticket: crypto.encryptString(conversation.variable('presentationRenewST')),
      recharge_season_ticket: crypto.encryptString(conversation.variable('presentationRechargeST')),
      user_id: crypto.encryptString('GUEST'),      
    }

    //Price Zone here is Required
    if(conversation.variable('eventSelectionType') == 2 ){
      conversation.reply("Selección de Asientos Automáticos")
      conversation.reply("Próximamente...")
      
      conversation.transition('Intent')     
      done()
    }
    else{
      sb.createTransaction(payload).then(_data => {
       
        const data = crypto.decryptObjectRecursive(_data)        
        conversation.variable("transactionId", data.transaction_id)  
        conversation.variable("userId", data.user_id)  
        conversation.variable("showMap", data.show_map)
        
        //For Custom External API
        conversation.variable("botId", conversation.botId())
        conversation.variable("platformVersion", conversation.platformVersion())
        conversation.variable("context", conversation.botId())
        conversation.variable("properties", "")
        conversation.variable("message","Helloton")
        

        conversation.keepTurn(true)
        conversation.transition('PurchaseTicketRequest')
  
        done()
        
        
      }).catch(err => {
        conversation.reply(err.message)
        done()
      })
    }          

  }

}
