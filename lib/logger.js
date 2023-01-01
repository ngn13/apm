import chalk from "chalk"
import readline from "readline"
import { Writable } from "stream"

class Logger{
	constructor(){
		this.std = this.getStd()
		this.inp = this.getInput(this.std)
	}

    error(text){
		console.log(chalk.red.bold("✗ ") + text)
	}

	success(text){
		console.log(chalk.green.bold("✓ ") + text)
	}

	out(text){
		process.stdout.write(text)
	}

	getStd(){
		let std = new Writable({
			write: function(chunk, encoding, callback) {
			  if (!this.muted)
				process.stdout.write(chunk, encoding);
			  callback();
			}
		});
		  
		std.muted = false
		return std
	}

	getInput(std){
		let inp = readline.createInterface({
			input: process.stdin,
			output: std,
			terminal: true
		});

		return inp
	}

}

export default Logger