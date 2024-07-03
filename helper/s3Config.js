const { PutObjectCommand, S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { handleCatchError } = require('./utilities.services')
const config = require('../config/config')
const s3Client = new S3Client({ region: config.AWS_REGION, credentials: { accessKeyId: config.AWS_ACCESS_KEY, secretAccessKey: config.AWS_SECRET_KEY } })

async function signedUrl(sFileName, sContentType, path) {
    try {
        sFileName = sFileName.replace('/', '-')
        sFileName = sFileName.replace(/\s/gi, '-')

        const fileKey = sFileName // date time formate change
        const s3Path = path

        const params = {
            Bucket: config.AWS_BUCKET_NAME,
            Key: s3Path + fileKey,
            ContentType: sContentType
        }

        const expiresIn = 300
        const command = new PutObjectCommand(params)
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn })

        return { sUrl: signedUrl, sPath: s3Path + fileKey }
    } catch (error) {
        handleCatchError(error)
    }
}

async function getSignUrl(sFilePath) {
    try {
        const params = {
            Bucket: config.AWS_BUCKET_NAME,
            Key: sFilePath,
        }
        const command = new GetObjectCommand(params)
        const signedUrl = await getSignedUrl(s3Client, command)
        return { sUrl: signedUrl }
    } catch (error) {
        handleCatchError(error)
    }
}

async function deleteUrl(sFilePath) {
    try {
        const params = {
            Bucket: config.AWS_BUCKET_NAME,
            Key: sFilePath,
        }
        const command = new DeleteObjectCommand(params)
        const response = await getSignedUrl(s3Client, command)
        return { sUrl: response }
    } catch (error) {
        handleCatchError(error)
    }
}

module.exports = {
    signedUrl,
    getSignUrl,
    deleteUrl
}