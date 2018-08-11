const sb = require('../lib/superboletos')
const _ = require('lodash')
const crypto = require('../lib/crypto')

function objectValues(obj) {
  var res = [];
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      res.push(obj[i]);
    }
  }
  return res;
}

const searchPos = (_pos, treshold, lat, lng) => {
  const __pos = _.flattenDeep(crypto.decryptArrayRecursive(_pos).map(state => objectValues(state.partners).map(s => objectValues(s.points_of_sale))))
  const ___pos = __pos.map(point => {
    point.distanceFromMe = sb.getDistanceFromLatLonInKm(lat, lng, point.latitud, point.longitud)
    return point
  })
  return _.orderBy(___pos, 'distanceFromMe').slice(0, 10)
}

const images = {
  adidas: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_adidasstore.jpg?alt=media&token=81a6b531-e95a-41a7-a1c7-dbddb7ac8185',
  auditorio_metropolitano: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_audmetropolitano.jpg?alt=media&token=08422787-5496-4a97-b64a-4c6a8cf1b0d3',
  complejo_cultural_universitario: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_ccupuebla.jpg?alt=media&token=e857b38e-5f46-419a-9a4d-951f2c241c89',
  cimaco: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_cimaco.jpg?alt=media&token=811fc4dc-9cc1-4dee-beb2-123447acd06b',
  concrete_international: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_concrete.jpg?alt=media&token=558c7faf-caad-48be-96db-13707eda1968',
  deportes_navarro: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_deportesnavarro.jpg?alt=media&token=3cf408bb-cb5e-434e-a02e-518b641519d0',
  farmacias_del_ahorro: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_fahorro.jpg?alt=media&token=5bcbaaaf-d2b7-4dd7-8dc9-85d5849de59a',
  fleming_farmacias_universitarias: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_flemingfarmacias.jpg?alt=media&token=4461930e-713f-462c-8c52-d9a7065b2d39',
  innovasport: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_innovasport.jpg?alt=media&token=58a85cbf-8f2c-4be8-9316-d88115489e58',
  klass_sport: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_klass.jpg?alt=media&token=fd7a0dca-8c60-434f-ac22-92d2ad6d3874',
  maxitickets: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_maxitickets.jpg?alt=media&token=250e6ffc-eaa8-4a44-bbd6-bafee8f5d140',
  mistertennis: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_mistertenis.jpg?alt=media&token=1647047b-c986-4bb1-aabd-5ee7f9d4405f',
  mrcd: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_mrcd.jpg?alt=media&token=09a5f887-1318-4054-b80a-be26380fe1e9',
  mt_sport: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_mtsport.jpg?alt=media&token=d27c3e31-4945-4952-9653-b3e7eee8f40b',
  palacio_de_hierro: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_palacio.jpg?alt=media&token=943d0df7-90fa-4f2f-b341-072a1a52e6a2',
  superboletos_punto_de_venta: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_PDVgenerico.jpg?alt=media&token=6be19ae4-c541-4afe-abc3-abc0d34bfcd6',
  pirma: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_pirma.jpg?alt=media&token=053a9989-9f3a-492d-b8c0-8cc9667393e3',
  salon_fama_pachuca: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_salonfutbol.jpg?alt=media&token=95a7d38b-8ad1-43b3-b81d-f97d918beaf9',
  soriana: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_soriana.jpg?alt=media&token=51a56888-bd25-4d65-b719-c54dc24f5d7f',
  travel_beats: 'https://firebasestorage.googleapis.com/v0/b/testing-6af56.appspot.com/o/IMAGES%2FPuntos-de-Venta%2Fvcards_pdv_travelbeatsplazapalmas.jpg?alt=media&token=44832bbc-5be5-45c0-beac-74ff4a64f2ca',
}

module.exports = {

  metadata: () => ({
    name: 'GetNearPartners',
  }),

  invoke: (conversation, done) => {

    const model = conversation.MessageModel()
    const lat = conversation.variable('lat')
    const lng = conversation.variable('lng')
    const treshold = 15 // 15km range

    sb.getAllPointsOfSale(lat, lng, 15).then(_pos => {

      const pos = searchPos(_pos, treshold, lat, lng).slice(0, 10)
      const cards = pos.map(p => {

        // hardcode images
        const name = p.name.toLowerCase()

        p.imagen = images['superboletos_punto_de_venta']
        if (name.includes('cimaco')) p.imagen = images['cimaco']
        if (name.includes('farmacias del ahorro')) p.imagen = images['farmacias_del_ahorro']
        if (name.includes('farmacia del ahorro')) p.imagen = images['farmacias_del_ahorro']
        if (name.includes('innova')) p.imagen = images['innovasport']
        if (name.includes('mistertennis')) p.imagen = images['mistertennis']
        if (name.includes('mr. cd')) p.imagen = images['mrcd']
        if (name.includes('mr cd')) p.imagen = images['mrcd']
        if (name.includes('palacio de hierro')) p.imagen = images['palacio_de_hierro']
        if (name.includes('soriana')) p.imagen = images['soriana']

        return p

      }).map(p => model.cardObject(
        p.name,
        `${p.distanceFromMe.toFixed(2)}km ${p.address} ${p.address_2}`,
        p.imagen,
        null,
        [
          model.callActionObject('Llamar', null, p.phone),
          model.urlActionObject('Ver Mapa', null, `https://www.google.com/maps/?q=${p.latitud},${p.longitud}`)
        ]
      ))

      if (cards.length > 0) {
        conversation.reply("Estos son los puntos de venta que he encontrado para ti ^_^ (Y) ")
        conversation.reply(model.cardConversationMessage('horizontal', cards))
      } else {
        conversation.reply('No encontré puntos de venta cercanos a tu ubicación :(')
      }
      
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
