require('./mongoose')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    name:{
type:String,
required:true,
trim:true
    },
    password:{
        type:String,
        required:true
    },
    activeT:{
        type:String
    },
    tokens:[
        {
            token:{
                type:String,
               // required:true
            }
        }
    ],
    username:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    score:{
        type:Number,
        required:true
    },
    
    active:{
        type:Boolean,
        required:true
    }
})
const jwt=require('jsonwebtoken')
userSchema.methods.genAuthToken=async function(){
    const user=this
    console.log('hee1')
    const token=jwt.sign({_id:user._id.toString()},'thisismehellowbabyyo')
    console.log('hee2')
    user.tokens=user.tokens.concat({token})
    console.log('hee3')
    await user.save();
    return token;
}
userSchema.methods.toJSON=async function(){

    const user=this
    const a=user.toObject();
    delete a.password
    delete a.tokens
    delete a._id
    delete a.email
    return a;



}
userSchema.pre('save',async function(next){
const user=this
if(user.isModified('password')){
user.password=await bcrypt.hash(user.password,8)}
next();
})
const User=mongoose.model('user',userSchema)
module.exports=User;