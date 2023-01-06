import crypto from "crypto"

class APMEncryption{
	constructor(){
		this.alg = "aes-256-cbc"
	}

	getRandomIV(){
		return crypto.randomBytes(16)
	}

	encrypt(text, password, iv) {
		password = crypto.createHash("sha256").update(String(password)).digest("base64").substr(0, 32)
 		let cipher = crypto.createCipheriv(this.alg, Buffer.from(password), iv)
 		let encrypted = cipher.update(text)
 		encrypted = Buffer.concat([encrypted, cipher.final()])
 		return Buffer.from(encrypted.toString("hex")+":"+iv.toString("hex"))
	}

	decrypt(text, password) {
		let [enc, iv] = text.toString().split(":")
		password = crypto.createHash("sha256").update(String(password)).digest("base64").substr(0, 32)
 		iv = Buffer.from(iv, "hex");
 		let encryptedText = Buffer.from(enc, "hex")
 		let decipher = crypto.createDecipheriv(this.alg, Buffer.from(password), iv)
 		let decrypted = decipher.update(encryptedText)
 		decrypted = Buffer.concat([decrypted, decipher.final()])
 		return [decrypted, iv]
	}

}

export default APMEncryption