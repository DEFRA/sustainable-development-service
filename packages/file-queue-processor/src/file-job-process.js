import { models } from '@defra/wls-database-model'
import { AWS, GRAPH } from '@defra/wls-connectors-lib'
import db from 'debug'
// const debug = db('file-queue-processor:file-job-process')
const { S3Client, GetObjectCommand } = AWS()

export class RecoverableUploadError extends Error {}
export class UnRecoverableUploadError extends Error {}

const client = GRAPH.getClient()
console.log(client)

const details = client.api('/sites/root/drives').get()
details.then(d => console.log(d)).catch(e => console.error(e))

/**
 * Process a (single) file job
 * @param job
 * @returns {Promise<void>}
 */
export const fileJobProcess = async job => {
  const { id, applicationId } = job.data
  try {
    const { bucket, objectKey, filename } = await models.applicationUploads.findByPk(id)

    db(`Consume file - queue item ${{ bucket, objectKey, filename }}`)
    // Check that the file exists in the AWS bucket

    try {
      const response = await S3Client.send(new GetObjectCommand({
        Bucket: bucket,
        Key: objectKey
      }))

      // Got a response response.Body.pipe(res)
    } catch (err) {
      if (Math.floor(err.httpStstusCode / 100) === 4) {
        // Client errors, such as missing buckets are unrecoverable
        throw new RecoverableUploadError(err.message)
      } else {
        // Other errors are assumed to be recoverable
        throw new RecoverableUploadError(err.message)
      }
    }
  } catch (error) {
    if (error instanceof UnRecoverableUploadError) {
      console.error(`Unrecoverable error for job: ${JSON.stringify(job.data)}`, error.message)
    } else {
      console.log(`Recoverable error for job: ${JSON.stringify(job.data)}`, error.message)
      throw new Error(`File process job fail for applicationId: ${applicationId} fileId: ${id}`)
    }
  }
}
