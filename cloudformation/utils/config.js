import dotenv from 'dotenv'

dotenv.config()

var key = process.argv[2]
console.log(process.env[key])
