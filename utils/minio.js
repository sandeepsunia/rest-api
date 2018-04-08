import { minioConfig } from '../config/secrets'
import * as Minio from 'minio'
import crypto from 'crypto'

var minioClient = new Minio.Client({
  endPoint: minioConfig.endPoint,
  secure: minioConfig.secure,
  port: minioConfig.port,
  accessKey: minioConfig.accessKey,
  secretKey: minioConfig.secretKey
})

export function minioUpload(req, res, next) {
  if (req.files) {
    req.body.fileName = new Array()
    for (let i=0; i<req.files.length; i++) {
      const file = req.files[i].fieldname
      const originalname = req.files[i].originalname
      let data = `${req.user.id}${req.files[i].originalname}user${new Date()}`
      let ext = req.files[i].mimetype.split('/')[1]
      if ((ext == 'png') || (ext == 'jpg') || (ext == 'jpeg') || (ext == 'bmp') || (ext == 'gif')) {
        let filename = `${crypto.createHash('md5').update(data).digest("hex")}.${ext}`
        minioClient.putObject(`${minioConfig.bucket}`, filename, req.files[i].buffer, function(error) {
          if(error) {
            return res.status(200).json({ success: false, message: `Something went wrong while uploading file ${error}` })
          }
        })
        req.body.fileName.push({field: file,name: filename, originalname: originalname})
      }
      else
        return res.status(200).json({ success: false, message: `File Format not supported. Supported formats are png, jpg, jpeg, bmp and gif` })
    }
  }
  next()
}

export default {
  minioUpload
}
