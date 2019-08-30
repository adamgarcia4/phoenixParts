const mongoose = require("mongoose")

const partSchema = new mongoose.Schema({
  name: String,
  number: String,
  status: {
    type: String,
    enum: [
      'not_ordered',
      'ordered',
      'delivered'
    ],
    default: 'not_ordered'
  },
  material: String,
  description: String,
  quantity: Number,
  total: Number
}, {timestamps: true})


const partModel = mongoose.model("parts", partSchema)

module.exports = partModel