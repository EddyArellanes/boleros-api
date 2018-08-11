const sb = require('../lib/superboletos')
const crypto = require('../lib/crypto')

module.exports = {

  metadata: () => ({
    name: 'Debugging',    
  }),

  invoke: (conversation, done) => {
    conversation.reply("Data....")
    done()
    /*
    conversation.reply("Analysing....")
    conversation.reply(`Event ID: ${conversation.variable('eventId')}`)
    conversation.reply(`Event Name : ${conversation.variable('eventName')}`)
    conversation.reply(`Evento Type Selection : ${conversation.variable('eventSelectionType')}`)
    conversation.reply(`Evento Type Selection : ${conversation.variable('eventSelectionType')}`)
    
    conversation.reply(`Presentation ID: ${conversation.variable('presentationId')}`)
    conversation.reply(`Presentation Name: ${conversation.variable('presentationName')}`)
    conversation.reply(`Presentation Type: ${conversation.variable('presentationElementType')}`)
    conversation.reply(`Presentation Renew Season Ticket: ${conversation.variable('presentationRenewST')}`)
    conversation.reply(`Presentation Recharge Season Ticket: ${conversation.variable('presentationRechargeST')}`)
    conversation.reply(`Presentation Price Zone ID: ${conversation.variable('presentationPriceZoneId')}`)
    */
  }

}
