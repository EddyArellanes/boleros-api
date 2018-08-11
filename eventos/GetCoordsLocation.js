module.exports = {

  metadata: () => ({
    name: 'GetCoordsLocation',
  }),

  invoke: (conversation, done) => {

    const location = conversation.variable('userCity')
    conversation.variable('lat', location.latitude)
    conversation.variable('lng', location.longitude)

    conversation.transition()
    done()

  }

}
