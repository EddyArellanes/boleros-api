const crypto = require('../lib/crypto')
const axios = require('axios')
const API_URL = 'http://sandbox.superboletos.com/api/v1'
const API_KEY = 'DAFA83AB4BA9ADF18162509633199219'
const MAP_PLUGIN = 'https://superboletosbackend-superboletos.uscom-east-1.oraclecloud.com'
const back = axios.create({baseURL: API_URL})

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  let R = 6371 // Radius of the earth in km
  let dLat = deg2rad(lat2 - lat1)
  let dLon = deg2rad(lon2 - lon1)
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  let d = R * c
  return d
}

const deg2rad = deg => deg * (Math.PI / 180)

module.exports = {

  getDistanceFromLatLonInKm,
  API_KEY,
  MAP_PLUGIN,

  getAllEventos() {
    return new Promise((resolve, reject) => {
      back.get('/event/all?api_key=' + API_KEY).then(data => resolve(data.data.data)).catch(err => reject(err))
    })
  },

  getEventoDetail(id) {
    return new Promise((resolve, reject) => {
      back.get('/event/' + id + '?api_key=' + API_KEY).then(data => resolve(data.data.data[0])).catch(err => reject(err))
    })
  },

  getAllCountries() {
    return new Promise((resolve, reject) => {
      back.get('/catalog/countries?api_key=' + API_KEY).then(data => resolve(data.data.data)).catch(err => reject(err))
    })
  },

  getAllStates(country_id) {
    return new Promise((resolve, reject) => {
      back.get(`/catalog/states?api_key=${API_KEY}&country_id=${country_id}`).then(data => resolve(data.data.data)).catch(err => reject(err))
    })
  },

  getAllCities(state_id) {
    return new Promise((resolve, reject) => {
      back.get(`/catalog/cities?api_key=${API_KEY}&state_id=${state_id}`).then(data => resolve(data.data.data)).catch(err => reject(err))
    })
  },

  getAllPointsOfSale(lat, lng, treshold) {
    return new Promise((resolve, reject) => {
      back.get(`/pointsOfSale?api_key=${API_KEY}`).then(data => {
        const _pos = data.data.data
        return resolve(_pos)
      }).catch(err => reject(err))
    })
  },

  getAllFaqs() {
    return new Promise((resolve, reject) => {
      back.get(`/faqs?api_key=${API_KEY}`).then(data => resolve(data.data.data)).catch(err => reject(err))
    })
  },

  createTransaction(data) {
    return new Promise((resolve, reject) => {
      back.post('/transaction', data).then(data => resolve(data.data.data[0]), err => reject(err))
    })
  },

  // Added by Brandon G. Neri
  validatePresale(presale_id, presale_type, presale_code, presentation_id, element_type) {
    return new Promise((resolve, reject) => {
      back.get(`/presale/${presale_id}/validate?presale_type=${presale_type}&presale_code=${presale_code}&presentation_id=${presentation_id}&element_type=${element_type}`)
        .then(data => resolve(data.data))
        .catch(err => reject(err))
    })
  },

  getDeliveryMethods(transaction_id, presentation_id, element_type) {

    const url = `/presentation/${presentation_id}/deliveryMethods?api_key=${API_KEY}&transaction_id=${transaction_id}&element_type=${element_type}`
    console.log(url);
    
    return new Promise((resolve, reject) => {
      back.get(url)
        .then(data => resolve(data.data))
        .catch(err => reject(err))
    })
  },

  getPaymentMethods(transaction_id, presentation_id, element_type) {

    const url = `/transaction/${transaction_id}/paymentMethods?api_key=${API_KEY}&presentation_id=${presentation_id}&element_type=${element_type}`
    console.log(url);

    return new Promise((resolve, reject) => {
      back.get(url)
        .then(data => resolve(data.data))
        .catch(err => reject(err))
    })
  },

  getPriceZone(presentation_id, element_type) {
    return new Promise((resolve, reject) => {
      back.get(`/map/${presentation_id}/priceZones?api_key=${API_KEY}&presentation=${presentation_id}&element_type=${element_type}`).then(data => resolve(data.data.data)).catch(err => reject(err))
    })
  },
  getMapToken(){
    return new Promise((resolve, reject) => {
      back.post(`/token`, {api_key: API_KEY}).then(data => resolve(data.data)).catch(err => reject(err))
    })  
  },
  /*    Added 10/08/18    
  
  */
  /**
    * Retrieves Additional Services
    * 
    * @param {string|int}  event_id - The id of the event
    * @param {object} [data] - Object with 
    * @return {object} with 200 status code
  */

  getAdditionalServices(event_id){
    return new Promise((resolve, reject) => {
      back.get(`/event/${event_id}/services?api_key=${API_KEY}`).then(data => resolve(data.data)).catch(err => reject(err))
    })  
  },
  /*total is required when type= DONATIVO*/
  setService(transaction_id,type,service_code,total){
    return new Promise((resolve, reject) => {
      back.put(`/transaction/${transaction_id}/service`, {api_key: API_KEY}).then(data => resolve(data.data)).catch(err => reject(err))
    })  
  },  
}