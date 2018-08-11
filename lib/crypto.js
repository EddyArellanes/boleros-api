const aes = require('aes-cross')

const api_key = 'DAFA83AB4BA9ADF18162509633199219'
const api_secret = '4A8B574840A46933F66E1F758A4CAFDA'

String.prototype.replaceAll = function (search, replacement) {
  var target = this
  return target.split(search).join(replacement)
}

module.exports = {

  decryptString(string) {
		return this.transform('DECRYPT_MODE', string, api_secret)
  },
  
	encryptString(string){
		return this.formatStringForApi(this.transform('ENCRYPT_MODE', string, api_secret))
  },
  
  encryptStringWithKey(string) {
    return this.transform('ENCRYPT_MODE', string, api_key)
  },

  transform(mode, string, key) {

		let keyAES = []
    let ivAES = []
    
		for (let i = 0; i < key.length; i++){
      key.length / 2 > i ? keyAES.push(key.charCodeAt(i)) : ivAES.push(key.charCodeAt(i))
		}

		const keyBuf = Buffer.from(keyAES)
    const ivBuff = Buffer.from(ivAES)
    
    return mode == 'DECRYPT_MODE' ? aes.decText(string,keyBuf,ivBuff) : aes.encText(string,keyBuf,ivBuff)
	},

  decryptObjectValues(obj) {

    let newObj = {}

    for (const key in obj) {
      if(typeof obj[key] == 'string') newObj[key] = this.decryptString(obj[key])
    }

    return newObj

  },

  encryptObjectValues(obj) {

    let newObj = {}

    for (const key in obj) {
      newObj[key] = this.encryptString(obj[key])
    }

    return newObj

  },

  decryptArray(arr) {
    return arr.map(obj => this.decryptObjectValues(obj))
  },

  decryptArrayRecursive(arr) {

    let newArr = []

    arr.forEach(element => {
      if (typeof element == 'object') newArr.push(this.decryptObjectRecursive(element))
      if (typeof element == 'array') newArr.push(this.decryptArrayRecursive(element))
      if (typeof element == 'string') newArr.push(this.decryptString(element))
    })

    return newArr

  },

  decryptObjectRecursive(obj) {

    let newObj = {}

    for (const key in obj) {
      if (typeof obj[key] == 'string') newObj[key] = this.decryptString(obj[key])
      if (typeof obj[key] == 'object') newObj[key] = this.decryptObjectRecursive(obj[key])
      if (typeof obj[key] == 'array') newObj[key] = this.decryptArrayRecursive(obj[key])
    }

    return newObj

  },

  formatStringForApi(string) {
    return string.replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
  }

}