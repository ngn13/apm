import APMEncryption from "./encryption.js"
import APMStorage from "./storage.js"


class APM{
	constructor(){
		this.version = "1.2.0"
		this.enc = new APMEncryption()
		this.stor = new APMStorage()
		this.master = null
	}

	setMaster(master){
		this.master = master
	}

	masterCheck(){
		try{
			let read = this.stor.read()
			if(read===false)
				return true
			this.enc.decrypt(this.stor.read(), this.master)
			return true
		}catch{
			return false
		}
	}

	addEntry(name, user, pass){
		let dat = this.stor.read()

		if(this.findEntry(name)!==false){
            return false
        } 

		let entry = {
			"name": name,
			"user": user,
			"pass": pass
		}
			
		if(!dat){
			let datBase = {
				"entries": []
			}
			datBase["entries"].push(entry)
			datBase = JSON.stringify(datBase)
			let iv = this.enc.getRandomIV()
			datBase = this.enc.encrypt(datBase, this.master, iv)
			this.stor.write(datBase)
			return
		}

		let [decDat, iv] = this.enc.decrypt(dat, this.master)
		decDat = JSON.parse(decDat.toString())
		decDat["entries"].push(entry)
		this.stor.write(
			this.enc.encrypt(JSON.stringify(decDat), this.master, iv)
		)
	}
	
	readEntries(){
		let dat = this.stor.read()
		if(!dat){
			return false
		}

		let [decDat, iv] = this.enc.decrypt(dat, this.master)
		decDat = JSON.parse(decDat.toString())
		return decDat["entries"]
	}

	findEntry(name){
		let dat = this.stor.read()
		if(!dat){
			return false
		}

		let [decDat, _] = this.enc.decrypt(dat, this.master)
		decDat = JSON.parse(decDat.toString())
		for(let i = 0; i<decDat["entries"].length; i++){
			let current = decDat["entries"][i] 
			if(current["name"]===name){
				return current
			}
		}

		return false
	}

	removeEntry(name){
		let dat = this.stor.read()
		if(!dat){
			return false
		}

		let [decDat, iv] = this.enc.decrypt(dat, this.master)
		decDat = JSON.parse(decDat.toString())
		for(let i = 0; i<decDat["entries"].length; i++){
			let current = decDat["entries"][i] 
			if(current["name"]===name){
				decDat["entries"].splice(i, 1)
				this.stor.write(
					this.enc.encrypt(JSON.stringify(decDat), this.master, iv)
				)
				return true
			}
		}
		
		return false
	}

	backup(path=null){
		if(path===null){
			this.stor.backup()
			return
		}
		this.stor.backup(path=path)
	}

	restore(path=null){
		if(path===null){
			return this.stor.restore()
		}
		return this.stor.restore(path=path)
	}
}

export default APM