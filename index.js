#!/usr/bin/env node

// importing main APM module
import Cmd from "./lib/cmd.js"
import APM from "./lib/apm.js"
import Logger from "./lib/logger.js"

const cmd = new Cmd()
const apm = new APM()
const log = new Logger()

const args = process.argv.slice(2)
if(args.length===0){
	cmd.help(apm, log)
	process.exit()
}

log.inp.question("Matser password: ", (master)=>{
	process.stdout.write("\n")
	runCmd(master)
})
log.std.muted = true

function runCmd(master){
	apm.setMaster(master)
	
	if(args[0] in cmd.funcMap){	
		let func = cmd.funcMap[args[0]]
		
		if (args.length < func[1]){
			log.error("Not enough arguments for: " + func[0].name)
			process.exit()
		}

		if(args.length > func[1]){
			log.error("Too mant arguments for: " + func[0].name)
			process.exit()
		}
		func[0](apm, log, args.slice(1))

	}else{
		log.error("Command not found: " + args[0])
		process.exit()
	}
}