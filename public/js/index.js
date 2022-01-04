let q = 0;
let start = false;
let a;
let randomoper;
let b;
let stype=-1
let qtype=-1
let type=""
let oper = [];
let randomposition;
let ansa = [];
let ans;
let userclicked = -1;
let time = 15;
let st = 0,userans=0;
let username;
let useroption = 0;
let noqu=1000000;
function started(){
  if (!start) {
    $(".timer").removeClass("widthse");
   

       for (i = 1; i <= 4; i++) {
 $("#s" + i).removeClass("right");
      $("#s" + i).removeClass("wrong");

    }

    userclicked = 0;
    st = 1;

    username = prompt("Enter your name");
    
     
     
    maine();
    start = true;
    $(".bt").css("display","none");
  }
}

$(document).keypress(function () {
let vallll=$(".cont").css("display");
if(vallll=="block")
  started();

});

$(".bt").click(function(){

  started();



})
let correct=0;
setInterval(() => {
  if (userclicked == 0 && time < 0 && start) {
if(noqu==1000000)
    {    over();
    congo(2);
    userclicked = 1;}
    else {userclicked = 1;
      $(".timer").text("TIME OVER");
    $(".timer").addClass("widthse");
      if (start === true) {
        setTimeout(maine, 2000);
      }
      $("#" + useroption).addClass("wrong");
  $("#s"+globalrandom).addClass("right");
     setTimeout(() => {$(".timer").text("15");
      $(".timer").removeClass("widthse");
      for (i = 1; i <= 4; i++) {
        $("#s" + i).removeClass("right");
             $("#s" + i).removeClass("wrong");
       
           }
     }, 2000);}
  }
  
  else if (st == 1 && time >= 0 && q) {
    $(".timer").text(time);
  }

  time--;
}, 1000);
let globalrandom;
$(".ans").click(function () {
  if(userans==1){userclicked = 1;userans=0;
  aq = new Audio("green.mp3");
  aq.play();

  useroption = $(this).attr("id");

  $("#" + useroption).addClass("press");

  setTimeout(() => {
    $("#" + useroption).removeClass("press");
  }, 100);

  userans = $(".an" + useroption).text();
  console.log(userans);
  if (userans == ans) {
    if (start === true) {
      setTimeout(maine, 1500);
    }
    correct++;
  }
  else if(noqu!=1000000){
    if (start === true) {
      setTimeout(maine, 2000);
    }
    $("#" + useroption).addClass("wrong");
$("#s"+globalrandom).addClass("right");
   setTimeout(() => {
    for (i = 1; i <= 4; i++) {
      $("#s" + i).removeClass("right");
           $("#s" + i).removeClass("wrong");
     
         }
   }, 2000);

  }
  
  else {
    $("#" + useroption).removeClass("press");
    over();
    congo(0);
    
  }
  
}
});

function congo(ff){
   $(".timer").text("15s");
   $(".timer").removeClass("widthse");
   

   for (i = 1; i <= 4; i++) {
$("#s" + i).removeClass("right");
  $("#s" + i).removeClass("wrong");

}
    useroption = 1;
    st = 0;
    userans=0;
    userclicked = 1;

time=15;
  start = 0;
  $(".cont").css("display","none");
  $(".new").css("display","flex");$(".newbutton1").css("display","none");
  stype=correct
  if(qtype==-1)qtype=undefined
  fetch("/task", {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body:JSON.stringify({
      tour:type,
      score:stype,
      outof:qtype
    })
  }).then(res => {
    console.log("Request complete! response:", res);
  });
  if(ff==1)
  {
    let audio=new Audio("congo.mp3");
    audio.play();
    
    
    $(".newh1").html("Congratulations 🥳🥳 " + username +" Scored " + correct + "/" + noqu );}
  else if(ff==2){
    $(".newh1").html("TIME-OVER, " + username + " Score = " + correct);
  }
  else{
    $(".newh1").html("GAME-OVER, " + username + " Score = " +correct);
  }

 $(".quess").text(
    "Start Please"
  );
  for (i = 1; i <= 4; i++) {
   
      $(".ans" + i).text("Option "+i);
     
    
  }
  correct=0;noqu=1000000;
  q=0;
 if (!start) {
      $(".conth1").text("Press any key to Restart the Game");
    }

}
$("button").click(function(){
  aq = new Audio("red.mp3");
  aq.play();
})

function maine() {
  useroption = 0;
  st = 1;
  time = 15;userans=1;
  userclicked = 0;
  aq = new Audio("red.mp3");
  aq.play();
  q++;
 
if(q>noqu){
  congo(1);
}
else 
{
  $(".conth1").text("QUESTION - " + q);
  a = Math.random();

  a = a * 200;
  a = Math.floor(a);
  b = Math.random();
  b = b * 200;
  b = Math.floor(b);

  oper = ["+", "*", "-", "%(rem)"];

  randomoper = Math.random();
  randomoper = randomoper * 4;
  randomoper = Math.floor(randomoper);
  $(".quess").text(
    "Q" + q + ". " + a + " " + oper[randomoper] + " " + b + " = ?"
  );
  if (randomoper == 0) {
    ans = a + b;
  } else if (randomoper == 1) {
    ans = a * b;
  } else if (randomoper == 2) {
    ans = a - b;
  } else {
    ans = a % b;
  }
  randomposition = Math.random();
  randomposition = randomposition * 4;
  randomposition = Math.floor(randomposition);
  randomposition = randomposition + 1;
  globalrandom=randomposition;
  $(".ans" + randomposition).text("   " + ans);
  ansa = [];

  ansa[0] = ans + 1;
  ansa[1] = ans - 1;
  ansa[2] = ans + 2;

  let k = 0;
  for (i = 1; i <= 4; i++) {
    if (i != randomposition) {
      $(".ans" + i).text("   " + ansa[k]);
      k++;
    }
  }}
}
function startagain() {
 
  start = false;noqu=1000000;
  $(".bt").css("display","inline-block");
}
function over() {
  st = 0;
  au = new Audio("wrong.mp3");

  au.play();
  $("body").addClass("gameover");

  setTimeout(() => {
    $("body").removeClass("gameover");
  }, 200);
 
  if (userclicked == 0) {
    $(".timer").text("TIME OVER");
    $(".timer").addClass("widthse");
  }
  $("#s" + randomposition).addClass("right");

  $("#" + useroption).addClass("wrong");
  setTimeout(() => {
 
    if (!start) {
      $(".conth1").text("Press any key to Restart the Game");
    }
  }, 6000);

  startagain();
}

var i = 0;
var txt = "MATH";
var speed = 200;
function Reverse() {
  if (i >= 0) {
    document.getElementById("mainmath").innerHTML = txt.substr(0, i);
    i--;
    setTimeout(Reverse, 80);
  } else {
    i++;
    setTimeout(typeWriter, speed);
  }
}
function typeWriter() {
  if (i < txt.length) {
    document.getElementById("mainmath").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  } else {
    setTimeout(Reverse, 1500);
  }
}

setTimeout(typeWriter, 280);

$(".newbutton1").click(function (){
location.reload();

})

$(".mainbutton").click(function (){

$(".main").css("display","none");
$(".secondg").css("display","flex");$(".foo").css("display","none");
$(".newbutton1").css("display","block");
})
$(".newbutton").click(function (){
  $(".second").css("display","flex");
  $(".new").css("display","none");$(".newbutton1").css("display","block");

})
$(".button2").click(function (){

  type="No. of Questions"

noqu=Number(prompt("No. of Question You want to answer"));

while(noqu<=0 || noqu%1!=0 ){
  noqu=Number(prompt("Enter Valid Questions")); 
}
qtype=noqu
$(".second").css("display","none");
$(".cont").css("display","block");
$(".foo").css("display","none");
  })
  $(".button1").click(function (){
type="KnockOut"
qtype=-1;
    $(".second").css("display","none");
    $(".cont").css("display","block");
    $(".foo").css("display","none");
  })
  $(".button1g").click(function (){

    $(".secondg").css("display","none");
    $(".second").css("display","flex");
    $(".cont").css("display","none");
    $(".foo").css("display","none");
  })
 