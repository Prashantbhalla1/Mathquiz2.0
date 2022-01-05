const { spreadProperty, catchClause } = require('@babel/types');
const express=require('express')
const hbs=require('hbs')
const app=express();
require('dotenv').config()
const User=require('./user')
const path=require('path')
const auth=require('./auth')
var cookieParser = require('cookie-parser')
const port=process.env.PORT
const tempyUrl=path.join(__dirname,'/template/views')
app.use(cookieParser());
app.set('view engine', 'hbs');

const urll=path.join(__dirname,'/public/');
console.log(urll)
app.use(express.static(urll));
app.set('views',tempUrl)
app.get('',auth, async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((e)=>{
           return  e.token!=req.token;
        })
        await req.user.save();
        
        res.render('index')}
        catch(e){
            res.render('index')
            
        }
})

app.get('/signup',(req,res)=>{

res.render('signup')


})
const partUrl=path.join(__dirname,'/template/partials')
hbs.registerPartials(partUrl)
app.get('/login',(req,res)=>{
    res.render('login',{
        ldr:req.query.ldr
    })
})
// app.use(express.json())

app.get('/users/logout',auth,async(req,res)=>{

    try{
req.user.tokens=req.user.tokens.filter((e)=>{
   return  e.token!=req.token;
})
await req.user.save();

res.redirect('/login')}
catch(e){
    res.status(400).send(e);
}


})


app.use(express.urlencoded());
app.post('/users',async(req,res)=>{

    try{

        console.log(req.body.cpassword  + ' ' + req.body.password + ' ' + req.body.email)
        if(req.body.password!=req.body.cpassword)
        {
           res.render('signup',{
               pnm:"Passwords not matching"
           })
           return;
        }
        console.log('he1')
    const user=new User({
        email:req.body.email,
        password:req.body.password,
        name:req.body.name,
        username:req.body.username,
        score:0
    })
    console.log('he2')
await user.save();
res.redirect('/login')

}
    catch(e){
        res.render('signup',{
            pnm:"Username must be unique"
        })

    }



})
const bcrypt=require('bcrypt')
app.get('/ranking',auth, async (req,res)=>{

    try{
const user=await User.find({});

user.sort(function(a, b) {
    return (b.score) - (a.score);
});
let c=0;
 const newusers  =user.map((e)=>{
     c=c+1
     return {
         username:e.username,
         score:e.score,
         rank:c

     }
 })
res.render('ranking',{
    user:newusers,
    name:req.user.name
})
}
    catch(e){

res.redirect('/login?ldr=Please Login')

    }



})
app.get('/gamepage',auth,async(req,res)=>{


try{


    res.render('gamepage',{
        name:req.user.name
    })

}
catch(e){
    res.redirect('/login?ldr=Please Login')

}



})

app.post('/users/login', async (req,res)=>{

try{
console.log('he1')
const user=await User.findOne({email:req.body.email})

if(!user){
    res.redirect('/login')



    return
}

console.log('he2')
const match=await bcrypt.compare(req.body.password,user.password)
console.log('he3')
if(!match){
    res.redirect('/login?ldr=Unable to Login')
    return;
}

if(match){
    console.log('he4')
const token=await user.genAuthToken();
console.log('he5')
res.cookie("jwt",token,()=>{
    httpOnly:true
})

console.log('he6')
console.log('he7')
res.redirect('/gamepage')

}
else{
    throw new Error();
}


}

catch(e){
    res.render('login')
    res.status(400).send(e)
}



})
app.get('/progress/delete',auth,async (req,res)=>{

    try{
        console.log('hhhh1')
    await Task.deleteMany({owner:req.user._id})
    console.log('hhhh2')
        res.redirect('/progress')
    }
    catch(e){
        console.log(e)
        res.redirect('/login?ldr=Please Login')
    }
    
    })
app.get('/progress/:id',auth,async (req,res)=>{
try{
    console.log('hh1')
    console.log(req.params.id)
const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
console.log('hh2')
await task.remove();
console.log('hh3')
res.redirect('/progress')
console.log('hh4')
}
catch(e){
    console.log(e)
    res.redirect('/login?ldr=Please Login')

}

})

app.get('/progress',auth, async (req,res)=>{

   try{ const user=req.user
    if(!user){
        throw new Error()
    }
    const task=await Task.find({owner:user._id})
    console.log(task)
    res.render('progress',{
        task:task,
        name:user.name
    })}
    catch(e){
        res.redirect('/login?ldr=Please Login')
    }
    
    
        })
app.listen(port,()=>{
    console.log('server is on ' + port)
})

const Task=require('./task')
app.use(express.json())
app.post("/task",auth, async (req,res)=>{
    try{
        console.log('invokes from js')
        
const task=new Task({
    ...req.body,
    owner:req.user._id
})
const aa=req.user.score
const bb=task.score
req.user.score=aa+bb
await req.user.save()
console.log(task)
console.log('invokes from js1')
await task.save();
console.log('invokes from js2')
}
catch(e){
    res.status(500).send(e);
}


})
