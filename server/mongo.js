const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://adam:test123@phoenixparts-inya4.mongodb.net/test?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true })

const startMongo = cb => {
  client.connect(err => {
    if(err) {
      console.log(err)
      process.exit(1)
    }
  
    cb(client)
  })
}

module.exports = {
  startMongo,
  client
}