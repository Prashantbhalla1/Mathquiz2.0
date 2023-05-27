const User = require("./user")
const jwt=require('jsonwebtoken')

const auth=async(req,res,next)=>{
   try{
const token=req.cookies.jwt
if(!token){
    throw new Error()
}
const aa=jwt.verify(token,'thisismehellowbabyyo')
const user=await User.findOne({_id:aa._id,'tokens.token':token})
if(!user)throw new Error() 
console.log(user)
req.user=user;
req.token=token
next();}
catch(e){
    req.user=undefined
    next()
}
}



module.exports=auth