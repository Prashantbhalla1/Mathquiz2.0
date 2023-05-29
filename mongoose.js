const mongoose=require('mongoose')
const validator=require('validator')
console.log(process.env.MONGOURL)
mongoose.connect(process.env.MONGOURL,{
    useNewUrlParser:true,
    
})
