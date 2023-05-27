require('dotenv').config()
const express=require('express')
const hbs=require('hbs')
const app=express();


const User=require('./user')
const path=require('path')
const auth=require('./auth')
var cookieParser = require('cookie-parser')
const port=process.env.PORT ||3000
const tempUrl=path.join(__dirname,'/template/views')
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


const mails=require('./mail')

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
        score:0,
        active:1
    })
    console.log('he2')
    await user.save();
    console.log('he3')
    const toke=await user.genAuthToken();
    console.log('he4')
    user.activeT=toke
    console.log('he5')
    await user.save();
   

    console.log('he6')

res.redirect('/login?ldr=Please Activate Your Account Through mail send on your gamil account to login')

}
    catch(e){
        console.log(e)
        res.render('signup',{
            pnm:"Username must be unique"
        })

    }



})

app.get('/email/:tok',async(req,res)=>{
try{
const user=await User.findOne({activeT:req.params.tok})
if(!user)throw new Error()
user.active=1;
user.activeT=undefined
await user.save();
res.redirect('/login?ldr=Your account is now activated')
}
catch(e){
    res.redirect('/signup');
}



})
app.get('/forgot',async(req,res)=>{

try{
res.render('forgot')

}
catch(e){
res.redirect('/login')

}


})
app.get('/message',async(req,res)=>{
    res.render('message',{
        msg:req.query.msg
    })
})
app.post('/forgot/email',async(req,res)=>{
    try{
        console.log('e1')
    const user=await User.findOne({email:req.body.email})
    console.log('e2')
const toke=await user.genAuthToken();
console.log('e3')
user.activeT=toke
console.log('e4')
await user.save();
console.log('e5')
mails.sendMailForReset(toke,user.email);
console.log('e6')
res.redirect('/message?msg=Mail for resting the password has been sent to your email address')

}
catch(e){
    console.log(e)
    res.redirect('/login')
}


})

app.get('/passwordred',async(req,res)=>{
try{
if(req.query.token)
    {
        const user=await User.findOne({activeT:req.query.token})
        if(user){
        res.render('passwordred',{
token:req.query.token    
})
return 
}
else throw new Error()
}
else throw new Error();
}
catch(e){
    res.redirect('/login')
}
})

app.post('/passwordred/:tok',async(req,res)=>{

try{

    
console.log('hellow post jws')
const user=await User.findOne({activeT:req.params.tok})
if(!user)throw new Error()
user.password=req.body.password
user.activeT=undefined
await user.save();
res.redirect('/login?ldr=Password Reset Successfully')
}
catch(e)
{
    res.redirect('/login')
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
const user=await User.findOne({email:req.body.email,active:1})

if(!user){



    res.redirect('/login?ldr=Unable to login')



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

const Task=require('./task');
const e = require('express');
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
