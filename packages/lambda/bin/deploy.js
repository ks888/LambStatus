import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { execSync } from 'child_process'

dotenv.config({path: `${__dirname}/../../../.env`})

const buildDir = path.normalize(`${__dirname}/../build`)
const funcsDir = path.normalize(`${buildDir}/functions`)

const deploy = async () => {
  const funcs = fs.readdirSync(funcsDir)
  await Promise.all(funcs.map(async funcName => {
    const cmd = `apex deploy ${funcName}`
    const numRetries = 3
    let i
    for (i = 0; i < numRetries; i++) {
      try {
        // sometimes 'apex deploy' returns error
        execSync(cmd, { cwd: buildDir, maxBuffer: 100 * 1024 * 1024, timeout: 10 * 1000 })
        break
      } catch (error) {
        console.log('retry...')
      }
    }

    if (i === numRetries) {
      throw new Error(`failed to deploy ${funcName}`)
    }
  }))
}

deploy().catch(error => {
  console.log(error.message)
  console.log(error.stack)
})
