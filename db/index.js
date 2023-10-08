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
    result = result.toObject()

    delete result.password
    Jwt.sign({result},jwtKey,{expiresIn:"2h"},(err,token)=>{
        if(err){
         res.send({result:"something went wrong,please aftert try"})
        }
         res.send({result,auth:token})
        
     })
    
});

app.get('/view',verifyToken,async(req,res)=>{
    console.log('request is :',req)
    console.log(req.body.sku)
    console.log('my id', req.body.sku)
    const user =  await User.findById({_id:req.body.id});

    if(user){
       res.send(user.toObject())
       
    }else{
       res.send({result:"no user  found"})
    }

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
    });


app.post("/product", async(req,res)=>{
   let product = new Product(req.body)
   let result = await product.save()
   res.send(result)
});



app.post('/login',async(req,res)=>{
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
   
});
        

// Middleware to verify JWT token
function invalidateToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  Jwt.verify(token, jwtKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.decoded = decoded;
    next();
  });
}
app.post('/logout', invalidateToken,(req, res) => {
 
  res.json({ message: 'Logout successful' });
});

   function verifyToken(req,res,next){
    let  token =req.headers['authorization'];
  
    if(token){

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