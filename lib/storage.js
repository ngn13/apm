import os from "os"
import fs from "fs"
import path from "path"

class APMStorage{
	constructor(){
		this.apmDir = path.join(os.homedir().toString(), ".apm")
		this.apmDat = path.join(this.apmDir, "storage.dat")
		this.apmBak = path.join(this.apmDir, "storage.bak")
	}

	backup(path=this.apmBak){
		if(!this.check()){
			return false
		}
		fs.writeFileSync(path, this.read(), "hex")
		return true
	}

	restore(path=this.apmBak){
		if(!fs.existsSync(path)){
			return false
		}
		
		fs.writeFileSync(
			this.apmDat, 
			fs.readFileSync(path), 
			"hex"
		)
		return true
	}

	check(){
		if(!fs.existsSync(this.apmDir)){
			fs.mkdirSync(this.apmDir)
		}

		if(!fs.existsSync(this.apmDat)){
			return false
		}

		return true
	}

	read(){
		if(this.check()){
			return Buffer.from(fs.readFileSync(this.apmDat))
		}

		return false
	}

	write(data){
		this.check()
		fs.writeFileSync(this.apmDat, data)
		return true
	}
}

export default APMStorage