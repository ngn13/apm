import clipboard from "clipboardy";

class Cmd{
    constructor(){
        this.funcMap = {
            "read":     [this.read,       2,    null],
            "list":     [this.list,       1,    null],
            "add":      [this.add,        2,    null],
            "delete":   [this.delete,     2,    null],
            "restore":  [this.restore,    1,    "path"],
            "backup":   [this.backup,     1,    "path"]
        }
    }

    list(apm, log){
        if(!apm.masterCheck()){
            log.error("Bad master")
            process.exit()
        }
 
        let entries = apm.readEntries()

        if(entries===false || entries.length === 0){
            log.error("No current entries!")
            process.exit()
        }

        log.success("Listing entries...")
        for(let i = 0; i < entries.length; i++){
            if(i===entries.length-1){
                log.out(entries[i]["name"])
            }else{
                log.out(entries[i]["name"] + ", ")
            }
        }
        log.out("\n")
        process.exit()
    }

    add(apm, log, arg){
        if(!apm.masterCheck()){
            log.error("Bad master")
            process.exit()
        }

        let name = arg[0] 

        function setUsername(usr){
            log.std.muted = false
            log.inp.question("Password: ", (pass)=>{
                setPassword(usr, pass)
            })
            log.std.muted = true
        }

        function setPassword(usr, pass){
            console.log()
            apm.addEntry(name, usr, pass)
            log.success("Added entry: " + name)
            process.exit()
        }

        log.std.muted = false
        log.inp.question("Username: ", (usr)=>{
            setUsername(usr)
        })
    }

    delete(apm, log, arg){
        if(!apm.masterCheck()){
            log.error("Bad master")
            process.exit()
        }
        
        let name = arg[0] 
        if(apm.removeEntry(name)){
            log.success("Entry deleted")
            process.exit()
        }

        log.error("No entry found for: " + name)
        process.exit()
    }
    
    backup(apm, log, path=null){
        if(!apm.masterCheck()){
            log.error("Bad master")
            process.exit()
        }

        if(path.length!==0){
            apm.backup(path=path[0])
            log.success("Backup success!")
            process.exit()
        }
        
        apm.backup()
        log.success("Backup success!")
        process.exit()
    }

    restore(apm, log, path=null){
        if(!apm.masterCheck()){
            log.error("Bad master")
            process.exit()
        }

        if(path.length!==0){
            if(!apm.restore(path=path[0])){
                log.error("Backup file not found")
                process.exit()
            }
            log.success("Restored from last backup")
            process.exit()
        }
        
        if(!apm.restore()){
            log.error("Backup file not found")
            process.exit()
        }
        log.success("Restored from last backup")
        process.exit()
        
    }

    read(apm, log, args){
        if(!apm.masterCheck()){
            log.error("Bad master")
            process.exit()
        }

        let name = args[0]

        let entry = apm.findEntry(name)
        if(entry===false){
            log.error("Entry not found!")
            process.exit()
        }

        log.success("Found entry!")
        console.log(`Name    :   ${entry["name"]}\nUsername:   ${entry["user"]}\nPassword:   ${entry["pass"]}`)
        clipboard.writeSync(entry["pass"])
        log.success("Password copied to clipboard")
        process.exit()
    }

    help(apm, log){
        console.log(`
Awesome Password Manager ${apm.version}

COMMAND         DESC
list            list entries
add <name>      add entry
read <name>     read entry
remove <name>   remove entry
backup          backup entries
restore         restore entries
        `)
    }
}

export default Cmd