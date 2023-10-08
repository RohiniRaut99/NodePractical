const express = require('express');
 require('./config')
const cors = require('cors')
const axios = require('axios')


const Product = require('./product')
const User = require('./user')
const app = express('')

const Jwt = require('jsonwebtoken')
const jwtKey = 'screate-key';


app.use(express.json());
app.use(cors());




app.post('/SignUp',async(req,res)=>{
    let user = new User(req.body)
    let result = await user.save()
    // users mean users model we use here
    result = result.toObject()

    delete result.password
    // above line add for remove password
    Jwt.sign({result},jwtKey,{expiresIn:"2h"},(err,token)=>{
        if(err){
         res.send({result:"something went wrong,please aftert try"})
        }
         res.send({result,auth:token})
         console.warn(' authentication token got ')
     })
    
    // res.send(result) 
});
app.get('/signUP',async(req,res)=>{
    let user =new User (req.body)
    let result = await user.save()
    res.send(result)
});

    app.get("/random-Joke",async(req,res)=>{
        try {
        
            const response = await axios.get('https://api.chucknorris.io/jokes/random');

            if (response.status === 200) {        
              res.status(200).send(response.data);
            } else {
              
              res.status(response.status)
            }
          } catch (error) {

            console.error(error);
    
          }

        

    })


app.post("/product",verifyToken, async(req,res)=>{
   let product = new Product(req.body)
   let result = await product.save()
   res.send(result)
})
app.get("/products",async(req,res)=>{
   const products =  await Product.find();
   if(products.length>0){
      res.send(products)
      console.log (' new product found')
   }else{
      res.send({result:"no produt  found"})
   }
  
})

app.post('/login',async(req,res)=>{
//    console.log(req.body);
   console.log('login page working')
    let user = await User.findOne(req.body).select('-password')
       if (user){
           Jwt.sign({user},jwtKey,{expiresIn:"2h"},(err,token)=>{
              if(err){
               res.send({result:"something went wrong,please try after sometime"})
              }
               res.send({user,auth:token})
           })
           
       }else{
           res.send({result:'no user found'})
       }
   
   })
   function verifyToken(req,res,next){
    let  token =req.headers['authorization'];
    console.log('authorisaton succsfull..',token)
    if(token){
    token = token.split('')[1];
    Jwt.verify(token,jwtKey,(err,valid)=>{
        if(err){
            res.status(401).send({result:"please provide valid token"})
        } else{
            next();
        }
    })

}else{
       res.status(401).send({result:"please add token with header"})
       } 
 }

    

app.listen(7100)