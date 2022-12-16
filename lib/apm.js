import APMEncryption from "./encryption.js"
import APMStorage from "./storage.js"


class APM{
	constructor(){
		this.enc = new APMEncryption()
		this.stor = new APMStorage()
		this.master = null
	}

	setMaster(master){
		this.master = master
	}

	addNewEntry(name, user, pass){
		let encpass = this.enc.encrypt(pass, this.master, this.enc.getRandomIV())
		this.stor.addData(name, user, encpass["pass"], encpass["iv"])
	}

	readEntry(indx){
		let entry = this.stor.apmData["entries"][indx]
		let decpass = this.enc.decrypt(entry["pass"], this.master, entry["iv"])
		entry["pass"] = decpass
		return entry
	}

	removeEntry(indx){
		this.stor.removeData(indx)
	}
}

export default APM