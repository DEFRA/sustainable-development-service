import { SEQUELIZE, GRAPH } from '@defra/wls-connectors-lib'
import { createQueue, queueDefinitions, queueWorker } from '@defra/wls-queue-defs'
import { createModels } from '@defra/wls-database-model'
import { fileJobProcess } from './file-job-process.js'
import fs from 'fs'

const json = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
console.log(`Starting ${json.name}:${json.version}`)

Promise.all([
  SEQUELIZE.initialiseConnection().then(() => createModels()),
  GRAPH.client().init(),
  createQueue(queueDefinitions.APPLICATION_FILE_QUEUE, { type: 'subscriber' })
]).then(() => queueWorker(queueDefinitions.APPLICATION_FILE_QUEUE, fileJobProcess))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
