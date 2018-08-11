const sb = require('../lib/superboletos')
const _ = require('lodash')
const crypto = require('../lib/crypto')
var stringSimilarity = require('string-similarity')


module.exports = {

  metadata: () => ({
    name: 'SearchFaq',
  }),

  invoke: (conversation, done) => {
    let stringSearch = (conversation.text()) ? conversation.text() : conversation.postback().variables.value
    //let stringSearch = (conversation.text())
    
    sb.getAllFaqs().then(_faqs => {

      const faqs = crypto.decryptArrayRecursive(_faqs)

      faqs.map(faq => {
        faq.similar = stringSimilarity.compareTwoStrings(stringSearch.toLowerCase(), faq.question.toLowerCase())
        return faq
      })

      const faq = _.orderBy(faqs, 'similar').reverse()[0]
      //conversation.reply(`${faq.map(f => f.similar).join(', ')} | ${faq[0].answer}`)
      conversation.reply(faq.answer)      
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
