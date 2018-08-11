const NodeGeocoder = require('node-geocoder')

module.exports = {

  metadata: () => ({
    name: 'GetCoords',
  }),

  invoke: (conversation, done) => {

    const geocoder = NodeGeocoder({
      apiKey: 'nGyAIAfQd4RhRBVgUHaA01jcgFVQALxp',
      provider: 'mapquest'
    })

    geocoder.geocode(conversation.text()).then(data => {
      //conversation.reply(`${data[0].latitude},${data[0].longitude}`)
      conversation.variable('lat', data[0].latitude)
      conversation.variable('lng', data[0].longitude)
      conversation.transition()
      done()
    }).catch(err => {
      conversation.reply(err.message)
      conversation.transition()
      done()
    })

  }

}
