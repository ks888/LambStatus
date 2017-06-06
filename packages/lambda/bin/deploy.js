import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { execSync } from 'child_process'

dotenv.config({path: `${__dirname}/../../../.env`})

const buildDir = path.normalize(`${__dirname}/../build`)
const funcsDir = path.normalize(`${buildDir}/functions`)

try {
  const funcs = fs.readdirSync(funcsDir)
  funcs.forEach(funcName => {
    const cmd = `apex deploy ${funcName}`
    const numRetries = 3
    let i
    for (i = 0; i < numRetries; i++) {
      try {
        // sometimes 'apex deploy' returns error
        execSync(cmd, { cwd: buildDir, maxBuffer: 100 * 1024 * 1024, timeout: 10 * 1000 })
        console.log(`deployed ${funcName}`)
        break
      } catch (error) {
        console.log('retry...')
      }
    }

    if (i === numRetries) {
      throw new Error(`failed to deploy ${funcName}`)
    }
  })
} catch (error) {
  console.log(error.message)
  console.log(error.stack)
}
