const { startMongo } = require('./mongo')

const server = require('./server')

server.start()
// startMongo(client => server.start())