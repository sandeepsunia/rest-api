const winstonConfig = {
  'development': {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  },
  'test': {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  },
  'production': {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: false
  }
}

export default winstonConfig
