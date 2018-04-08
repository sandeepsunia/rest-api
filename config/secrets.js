/*eslint-env node*/
export const sessionSecret = process.env.SESSION_SECRET || 'Your Session Secret goes here'
export const apiSecret = 'SomeSuperStringAPISecret'
export const google = {
  clientID: process.env.GOOGLE_CLIENTID || 'Google Auth Client ID',
  clientSecret: process.env.GOOGLE_SECRET || 'Google Auth Secret',
  callbackURL: process.env.GOOGLE_CALLBACK || '/auth/google/callback'
}

export const minioConfig = {
  endPoint: 'Asset server path',
  secure: false,
  port: 80,
  accessKey: 'J60BC3ZF3D1GS803E8MZ',
  secretKey: 'v/1TL1lGEK7J20n2bTsorc7VAHRyLmoHMjU3eBvV',
  bucket: 'bucket-name'
}

export const smtpHost = `<SMTP SERVER>`
export const smtpPort = `<SMTP PORT>`
export const smtpUsername = `<SMTP USERNAME>`
export const smtpPassword = `<SMTP PASSWORD>`
export const smtpAdmin = `admin@sandy.net`
