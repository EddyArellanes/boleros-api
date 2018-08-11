
const crypto = require('./crypto')
const sb = require('./superboletos')
const _ = require('lodash')
const async = require('async')
const csv = require('./csv')
const fs = require('fs')

//sb.getEventoDetail(crypto.encryptString('jlS-XwIlqXn0efKTqwcc8g')).then(data => console.log(data))

/*Test Data Hardcoded
let eventId = crypto.formatStringForApi(crypto.encryptString('3x2JdUshlqaJnikhuqircg'))
const payload = {
  event_id: eventId,
  presentation_id: crypto.formatStringForApi(crypto.encryptString('Ygbv-3v5MTDWTPpQie-4CA')),
  element_type: crypto.formatStringForApi(crypto.encryptString('ABONO')),
  api_key: sb.API_KEY,
  user_id: crypto.encryptString('rzTauLlPW2yZS5IFCTsJrg'),
  renew_season_ticket: crypto.encryptString('0'),
  recharge_season_ticket: crypto.encryptString('0'),
  extra_params:{  
    price_zone_id:crypto.formatStringForApi(crypto.encryptString('8mKJFgggOu7GNo-mWLtvcg')),
   },  
  //user_id: crypto.encryptString('GUEST')  
}
*/
//Test with Prueba Stress 2 - Presentation Prueba Stress 6
let eventId = crypto.formatStringForApi(crypto.encryptString('wgILPYA5CINa-mcGY2bTMg'))
const payload = {
  event_id: eventId,
  presentation_id: crypto.formatStringForApi(crypto.encryptString('mFRjH1_SEr6Mq9HW66eTlg')),
  element_type: crypto.formatStringForApi(crypto.encryptString('EVENTO')),
  api_key: sb.API_KEY,
  renew_season_ticket: crypto.encryptString('0'),
  recharge_season_ticket: crypto.encryptString('0'), 
  user_id: crypto.encryptString('GUEST')  
}

/*
sb.getPriceZone(payload.presentation_id, payload.element_type).then(_zones => {

  const zones = crypto.decryptArrayRecursive(_zones)
  console.log(zones)

  fs.writeFile('priceZones.json', JSON.stringify(zones), err => {
    console.log(err || 'Archivo escrito en priceZones.json')
  })

}).catch(err => {
  console.log(err)
})
*/

sb.createTransaction(payload).then(_data => {
  //console.log('payload', payload)
  const data = crypto.decryptObjectRecursive(_data) 
  console.log(data.transaction_id)
  console.log(data.user_id)
  console.log(data.show_map)

  
  fs.writeFile('transaction.json', JSON.stringify(data), err => {
    err ? console.log(err) : console.log('Transacción generada guardada en: transaction.json')
  })
}).catch(err => console.log(err))


/*
console.log('PRESENTATION_ID', crypto.encryptString('-EmGCDT-BfM_L7Ugg1jPHA'))

sb.getDeliveryMethods(
  null,
  crypto.encryptString('-EmGCDT-BfM_L7Ugg1jPHA'),
  crypto.encryptString('PAQUETE')
).then(data => console.log(data)).catch(err => console.log(err))
*/

// mexico ND47q350Tr_F3--HoUwTVA
/*let cities = []

sb.getAllStates(crypto.encryptString('ND47q350Tr_F3--HoUwTVA')).then(_estados => {

  const estados = crypto.decryptArray(_estados)

  async.eachSeries(estados, (estado, next) => {

    sb.getAllCities(crypto.encryptString(estado.state_id)).then(_cities => {
      const __cities = crypto.decryptArray(_cities)
      cities = [...cities, ...__cities]
      next()
    })

  }, () => {
    fs.writeFile('cities.txt', cities.map(c => c.label).join(','), { encoding: 'utf8' }, err => {
      console.log(err ? err : 'Archivo escrito correctamente en cities.csv')
    })
  })
  
})
*/

/*
sb.getAllEventos().then(_eventos => {

  const eventos = crypto.decryptArrayRecursive(_eventos)

  fs.writeFile('eventos.json', JSON.stringify(eventos), err => {
    err ? console.log(err) : console.log('Eventos escritos en: eventos.json')
  })

})
*/

/*
const lat = 19.2464696
const lng = -99.10134979999998
const treshold = 15

const searchPos = _pos => {
  const __pos = _.flattenDeep(crypto.decryptArrayRecursive(_pos).map(state => Object.values(state.partners).map(s => Object.values(s.points_of_sale))))
  return __pos.map(point => {
    point.distanceFromMe = sb.getDistanceFromLatLonInKm(lat, lng, point.latitud, point.longitud)
    return point
  }).filter(p => p.distanceFromMe <= treshold)
}

sb.getAllPointsOfSale(lat, lng, 15).then(_pos => {

  console.log(searchPos(_pos))

})*/



/*
let eventId = crypto.formatStringForApi(crypto.encryptString('wgILPYA5CINa-mcGY2bTMg'))
sb.getEventoDetail(eventId).then(_evento => {
  console.log(`Servicio consultado: http://sandbox.superboletos.com/api/v1/event/${eventId}?api_key=DAFA83AB4BA9ADF18162509633199219`)
 
  const evento = crypto.decryptObjectRecursive(_evento)
  console.log(`Respuesta:`,evento)
  //console.log('EVENTO: ', evento.event_name)
  //console.log('CATEGORY:', evento.categories[0])

  fs.writeFile('evento.json', JSON.stringify(evento), err => {
    console.log(err || 'Evento exportado correctamente en: evento.json')
  })  

})
*/

// Get FAQ
/*
sb.getAllFaqs().then(_faqs => {

  const faqs = crypto.decryptArrayRecursive(_faqs)
  return console.log(faqs);
  
  fs.writeFile('faqs.csv', csv.arrayToCsv(faqs), err => {
    console.log(err || 'Faqs escritos en faqs.csv')
  })

})
*/
/*

const obj = {
  eventId: '0Sog4RaUrkLAN5oEGs6r43fiLHXJdvaLf2QoZnXGw2c',
  presentationId: 'naxVwrjTvOsHeB1drhm1L9G6sb6IqxziC5RwTeHI_5U',
  userId: 'ZjEiVfKhmBR2pF4MTOou0g',
  transactionId: '9DyeKbXmKAgv7EZaTbx9xytUI0YPvZQ',
}

console.log(crypto.decryptObjectValues(obj))
*/
/*
sb.getAllFaqs().then(_faqs => {

  const faqs = crypto.decryptArrayRecursive(_faqs)
  return console.log(faqs);
  
  fs.writeFile('faqs.csv', csv.arrayToCsv(faqs), err => {
    console.log(err || 'Faqs escritos en faqs.csv')
  })

})
*/