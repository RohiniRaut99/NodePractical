const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({

  sku:String,
  password:String

})
console.log(' user schema is creating')
//  const User = mongoose.model("User", UserSchema);

// module.exports = User;
module.exports = mongoose.model("users",UserSchema)