import os from "os"
import fs from "fs"
import path from "path"

class APMStorage{
	constructor(){
		this.apmDir = path.join(os.homedir().toString(), ".apm")
		this.apmDataFile = path.join(this.apmDir, "storage.json")
		this.apmBackup = path.join(this.apmDir, "backup")
		this.defaultData = {"entries":[]}
		this.apmData = null
		this.getData()
	}

	backupStorage(){
		this.checkStorage()
		fs.writeFileSync(this.apmBackup, JSON.stringify(this.apmData))
	}

	restoreStorage(){
		if(!this.checkBackup()){
			return false
		}
		fs.writeFileSync(this.apmDataFile, fs.readFileSync(this.apmBackup))
		return true
	}

	checkBackup(){
		this.checkStorage()
		if(fs.existsSync(this.apmBackup)){
			return true
		}
		return false
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
		
	}

	removeData(indx){
		this.checkStorage()
		this.apmData["entries"].splice(indx, 1)
		fs.writeFileSync(this.apmDataFile, JSON.stringify(this.apmData))	
	}
}

export default APMStorage