import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { exec } from 'child_process'

dotenv.config({path: `${__dirname}/../../../.env`})

const buildDir = path.normalize(`${__dirname}/../build`)
const funcsDir = path.normalize(`${buildDir}/functions`)

const deploy = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: buildDir, maxBuffer: 100 * 1024 * 1024, timeout: 10 * 1000 }, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }
      if (stdout.toString().length === 0 && stderr.toString().length === 0) {
        // If the output is empty, it is doubtful the deploy was really successful
        reject(new Error('apex exited successfully but the output is suspicious'))
        return
      }
      resolve()
    })
  })
}

const deployAll = async () => {
  const funcs = fs.readdirSync(funcsDir)
  for (let i = 0; i < funcs.length; i++) {
    const func = funcs[i]
    const cmd = `apex deploy ${func}`
    const numRetries = 3
    let j
    for (j = 0; j < numRetries; j++) {
      try {
        // sometimes 'apex deploy' returns error
        await deploy(cmd)
        console.log(`deployed ${func}`)
        break
      } catch (err) {
        console.log(err)
        console.log('retry...')
      }
    }

    if (j === numRetries) {
      throw new Error(`failed to deploy ${func}`)
    }
  }
}

deployAll().then(() => {
  console.log('deployed all functions')
}).catch(err => {
  console.log(err)
})
