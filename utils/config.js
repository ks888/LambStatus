import dotenv from 'dotenv'

dotenv.config({path: `${__dirname}/../.env`})

var key = process.argv[2]
console.log(process.env[key])
