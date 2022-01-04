const mongoose=require('mongoose')


const taskSchema=new mongoose.Schema({
    tour:{
type:String,
required:true
    },
    score:{
type:Number,
required:true,

    },
    outof:{
        type:Number,
        
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }

},{
    timestamps:true
})
const Task=mongoose.model('task',taskSchema)
module.exports=Task