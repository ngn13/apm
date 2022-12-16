import os from "os"
import fs from "fs"
import path from "path"

class APMStorage{
	constructor(){
		this.apmDir = path.join(os.homedir().toString(), ".apm")
		this.apmDataFile = path.join(this.apmDir, "storage.json")
		this.defaultData = {"entries":[]}
		this.apmData = null
		this.getData()
	}

	checkStorage(){
		if(!fs.existsSync(this.apmDir)){
			fs.mkdirSync(this.apmDir)
		}

		if(!fs.existsSync(this.apmDataFile)){
			fs.writeFileSync(this.apmDataFile, JSON.stringify(this.defaultData))
		}
	}

	getData(){
		this.checkStorage()
		this.apmData = JSON.parse(fs.readFileSync(this.apmDataFile))

		/*for(let i = 0; i<jsondata["passwords"].length; i++){
			let curr = jsondata["passwords"][i]
			let pass = this.enc.decrypt(curr, master)
			curr["pass"] = pass
			masterJson["passwords"].push(curr)
		}
		return masterJson*/
	}

	addData(name, user, pass, iv){
		this.checkStorage()

		let newEntry = {
			"name": name,
			"user": user,
			"pass": pass,
			"iv": iv
		}

		this.apmData["entries"].push(newEntry)
		fs.writeFileSync(this.apmDataFile, JSON.stringify(this.apmData))

		/*
		let masterJson = {"passwords":[]}
		let masterJsonFile = path.join(this.stPath, "master.json")
		this.checkJSON(masterJsonFile, masterJson)
		let jsondata = JSON.parse(fs.readFileSync(masterJsonFile))

		let encPass = this.enc.encrypt(passwordJson["pass"], master, this.enc.getRandomIV())
		passwordJson["pass"] = encPass["pass"]
		passwordJson["iv"] = encPass["iv"]

		jsondata["passwords"].push(passwordJson)*/
		
	}

	removeData(indx){
		this.checkStorage()
		this.apmData["entries"].splice(indx, 1)
		fs.writeFileSync(this.apmDataFile, JSON.stringify(this.apmData))	
	}
}

export default APMStorage