import APMEncryption from "./encryption.js"
import APMStorage from "./storage.js"


class APM{
	constructor(){
		this.version = "1.0"
		this.enc = new APMEncryption()
		this.stor = new APMStorage()
		this.master = null
	}

	setMaster(master){
		this.master = master
	}

	addNewEntry(name, user, pass){
		let iv = this.enc.getRandomIV()
		let encpass = this.enc.encrypt(pass, this.master, iv)
		let encuser = this.enc.encrypt(user, this.master, iv)
		this.stor.addData(name, encuser, encpass, iv.toString("hex"))
	}
	
	readEntry(indx){
		let entry = this.stor.apmData["entries"][indx]
		let decpass = this.enc.decrypt(entry["pass"], this.master, entry["iv"])
		let decuser = this.enc.decrypt(entry["user"], this.master, entry["iv"])
		entry["pass"] = decpass
		entry["user"] = decuser
		return entry
	}

	readAll(){
		let entries = []
		for(let i = 0; i < this.stor.apmData["entries"].length; i++){
			entries.push(this.readEntry(i))
		}
		return entries
	}

	actualReadAll(){
		try{
			return this.readAll()
		}catch{
			return false
		}
	}

	removeEntry(indx){
		this.stor.removeData(indx)
	}

	backup(){
		this.stor.backupStorage()
	}

	restore(){
		return this.stor.restoreStorage()
	}
}

export default APM