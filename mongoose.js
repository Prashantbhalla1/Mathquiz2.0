const mongoose=require('mongoose')
const validator=require('validator')
console.log(process.env.MONGOURL)
mongoose.connect('mongodb://127.0.0.1:27017/mathquiz',{
    useNewUrlParser:true,
    
})
