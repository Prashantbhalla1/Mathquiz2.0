
const sgMail=require('@sendgrid/mail')
const SGAPI='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'
sgMail.setApiKey(SGAPI)
const sendMailForActivation=(token,email)=>{


    sgMail.send({
to:email,
from:'prashantbhalla2016@gmail.com',
subject:'Activating the Account',

html:`<h1> For Activating your Account in Math Quiz Game <a href=${`http://localhost:3000/email/${token}`} >Click here</a> </h1>`
    }).then(()=>{
        console.log('email sent')
    }).catch((e)=>{
        console.log('error in email')
    })

}
const sendMailForReset=(token,email)=>{
    sgMail.send({
        to:email,
from:'prashantbhalla2016@gmail.com',
subject:'Activating the Account',
text:"hellow",
html:`<h1> For Resting your password <a href=${`http://localhost:3000/passwordred?token=${token}`} >Click here</a> </h1>`
 

    
            })
        
}
module.exports={sendMailForActivation,sendMailForReset}