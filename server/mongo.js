const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://adam:kubernetes123@testcluster-0ofsh.mongodb.net/sample?retryWrites=true&w=majority"
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