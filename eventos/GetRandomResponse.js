module.exports = {

  metadata: () => ({
    name: 'GetRandomResponse',
    properties: {
      textos: {
        type: 'string'
      },
      imagenes: {
        type: 'string'
      }
    }
  }),

  invoke: (conversation, done) => {

    const props = conversation.properties()
    const textos = props.textos.split(',')
    const imagenes = props.imagenes.split(',')

    const texto = textos[Math.floor(Math.random() * textos.length)]
    const img = imagenes[Math.floor(Math.random() * imagenes.length)]

    conversation.variable('tempMsg', texto)
    conversation.variable('tempImg', img)

    conversation.transition()
    done()

  }

}
