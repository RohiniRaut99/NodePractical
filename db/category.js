const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({

  id:String,
  name:String,
  
})
console.log('category schema is creating')

module.exports = mongoose.model("category",CategorySchema)