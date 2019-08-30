const mongoose = require('mongoose')
const uri = "mongodb://localhost:27017/phoenixParts"

mongoose.connect(uri, {useNewUrlParser: true});

const startMongo = cb => {

}

module.exports = {
  startMongo,
}