#!/usr/bin/env node

// importing main APM module
import APM from "./lib/apm.js"

// for cli stuff
import chalk from "chalk"
import inquirer from "inquirer"

const welcome = "Awesome Password Manager - APM v1.0.0"
console.log(chalk.bold(welcome))
console.log(chalk.bold("_".repeat(welcome.length) + "\n"))
const apm = new APM()

class Logger{
	error(text){
		console.log(chalk.red.bold("✗ ") + text)
	}

	success(text){
		console.log(chalk.green.bold("✓ ") + text)
	}
}

const logger = new Logger()

// ask for master password
async function askMaster(){
	const master = await inquirer.prompt({
		name: "masterPass",
		type: "password",
		message: "Enter master password"
	})

	apm.setMaster(master.masterPass)
}

// ask for action
async function askAction(){
	const answer = await inquirer.prompt({
		name: "action",
		type: "list",
		message: "Choose an action",
		choices: [
			"Add an entry",
			"Remove an entry",
			"List entries",
			"Generate password",
			"Exit"
		]
	})

	switch(answer.action) {
  		case "Add an entry":
  		  	//await addEntry()
  		  	break
  		case "Remove an entry":
  		  	//await removeEntry()
  		  	break
  		case "List entries":
  			//await listEntries()
  			break
  		case "Generate password":
  			//await genPass()
  			break
  		case "Exit":
  			process.exit()
  			break
  		default:
  			logger.error("Unknown option")
  	}
}

async function ask(){
	await askMaster()
	await askAction()
}

ask()

