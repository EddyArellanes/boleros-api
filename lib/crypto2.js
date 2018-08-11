const aes = require('aes-cross');
const api_secret = '4A8B574840A46933F66E1F758A4CAFDA';

module.exports = {
	decryptString(string) {
		return this.transform('DECRYPT_MODE', string, api_secret)
	},
	encryptString(string){
		return this.transform('ENCRYPT_MODE', string, api_secret)
	},
	transform(ecryptDecryt, string, key){
		var keyAES = []
		var ivAES = []
		for (var i = 0; i < key.length; i++){  
			if(key.length/ 2 > i){
				keyAES.push(key.charCodeAt(i))
			}else{
				ivAES.push(key.charCodeAt(i))
			}
		}

		var keyBuf = Buffer.from(keyAES)
		var ivBuff = Buffer.from(ivAES)
		
		if(ecryptDecryt == 'DECRYPT_MODE'){
			return aes.decText(string,keyBuf,ivBuff)
		}else{
			return aes.encText(string,keyBuf,ivBuff)
		}
	}
}