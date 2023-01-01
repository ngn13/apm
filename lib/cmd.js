class Cmd{
    constructor(){
        this.funcMap = {
            "list":     [this.list,       1],
            "add":      [this.add,        2],
            "delete":   [this.delete,     2],
            "restore":  [this.restore,    1],
            "backup":   [this.backup,     1]
        }
    }

    list(apm, log){
        let entries = apm.actualReadAll()
        if(entries===false){
            log.error("Bad master")
            process.exit()
        }

        log.success("Listing entries...")
        for(let i = 0; i < entries.length; i++){
            if(i===entries.length-1){
                log.out(entries[i]["name"])
            }else{
                log.out(entries[i]["name"], ", ")
            }
        }
        log.out("\n")
        process.exit()
    }

    add(apm, log, arg){
        let entries = apm.actualReadAll()
        if(entries===false){
            log.error("Bad master")
            process.exit()
        }

        let name = arg[0]

        for(let i = 0; i < entries.length; i++){
            if(entries[i]["name"]===name){
                log.error("An entry with same name exists")
                process.exit()
            }
        }

        function setUsername(usr){
            log.std.muted = false
            log.inp.question("Password: ", (pass)=>{
                setPassword(usr, pass)
            })
            log.std.muted = true
        }

        function setPassword(usr, pass){
            console.log()
            apm.addNewEntry(name, usr, pass)
            log.success("Added entry: " + name)
            process.exit()
        }

        log.std.muted = false
        log.inp.question("Username: ", (usr)=>{
            setUsername(usr)
        })
    }

    delete(apm, log, arg){
        let entries = apm.actualReadAll()
        if(entries===false){
            log.error("Bad master")
            process.exit()
        }
        
        let name = arg[0]
        for(let i = 0; i < entries.length; i++){
            if (entries[i]["name"]===name){
                apm.removeEntry(i)
                log.success("Entry deleted")
                process.exit()
            }
        }

        log.error("No entry found for: " + name)
        process.exit()
    }
    
    backup(apm, log){
        let entries = apm.actualReadAll()
        if(entries===false){
            log.error("Bad master")
            process.exit()
        }

        apm.backup()
        log.success("Backup success!")
        process.exit()
    }

    restore(apm, log){
        let entries = apm.actualReadAll()
        if(entries===false){
            log.error("Bad master")
            process.exit()
        }

        if(!apm.restore()){
            log.error("No backup found")
            process.exit()
        }
        log.success("Restored from last backup")
        process.exit()
    }

    help(apm, log){
        console.log(`
Awesome Password Manager ${apm.version}

COMMAND         DESC
list            list entries
add <name>      add entry
remove <name>   remove entry
backup          backup entries
restore         restore entries
        `)
    }
}

export default Cmd