const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({

  id:String,
  sku:String,
  productName:String,
  category:String,
  price:String,
 


})
console.log(' product schema is creating')

module.exports = mongoose.model("products",ProductSchema)
 