let email = document.getElementById("email");
let sendEmail = document.getElementById("sendEmail");
let countMember = document.getElementById("countMember");
let countDown=document.getElementById("countDown");
let date=new Date(2018,6-1,4,12);

let timer=window.setInterval(function(){
	let dateToday=new Date();
	if(dateToday.getTime()<date.getTime()){
		let totalSeconds=(date.getTime()-dateToday.getTime())/1000;
		let countSeconds=Math.floor(totalSeconds%60);
		let countMinutes=Math.floor((totalSeconds/60)%60);
		let countHours=Math.floor((totalSeconds/60/60)%24);
		let countDays=Math.floor(totalSeconds/60/60/24);
		if(date.getTime()==dateToday.getTime()){
			clearInterval(timer);
		}
		countDown.innerHTML="倒數"+countDays+"天"+countHours+"時"+countMinutes+"分"+countSeconds+"秒";
	}else{
		let totalSeconds=(dateToday.getTime()-date.getTime())/1000;
		let countSeconds=Math.floor(totalSeconds%60);
		let countMinutes=Math.floor((totalSeconds/60)%60);
		let countHours=Math.floor((totalSeconds/60/60)%24);
		let countDays=Math.floor(totalSeconds/60/60/24);
		if(date.getTime()==dateToday.getTime()){
			clearInterval(timer);
		}
		countDown.innerHTML="已過"+countDays+"天"+countHours+"時"+countMinutes+"分"+countSeconds+"秒";
	}
},1000);

function getEmail(strEmail){
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open('POST', "https://www.thef2e.com/api/isSignUp", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");  
    request.send("email=" + strEmail);
    request.onload = function() {
      resolve(this.responseText);
    };
  });
}
function count(){
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open('GET', "https://www.thef2e.com/api/signUpTotal", true); 
    request.send(null);
    request.onload = function() {
      resolve(this.responseText);
      alert("hi");
    };
  });
}
function isEmail(email) {
  let regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if(!regex.test(email)) {
    return false;
  }else{
    return true;
  }
}

sendEmail.addEventListener('click', function(e){
  e.preventDefault();
  if(email.value === ""){
    alert("請輸入信箱");
    
  }else if(isEmail(email.value)){
    sendEmail.value = "Waiting";
    getEmail(email.value).then(function(resv){
       sendEmail.value = "1";
       let applyJson = JSON.parse(resv);
       let str = "";
       if(applyJson.success){
          var time = new Date(applyJson.timeStamp);
          var y = time.getFullYear();
          var m = time.getMonth() + 1;
          var d = time.getDate();
          var h = time.getHours();
          var ms = time.getMinutes();
          var ss = time.getSeconds();
          str =  applyJson.nickName + " 已於 " + y + "年" + m + "月" + d + "日 " + h + ":" + ms + ":" + ss + " " + applyJson.message;
       }else{
         str = applyJson.message;
         email.value = "";
       }
       alert(str);
       sendEmail.value="Submit";
    });
  }else{
    alert("這不是信箱格式");
    
  }
});

(async function(){
  let getTotal = JSON.parse( await count() );
  alert(getTotal);
  if(getTotal.success){
    countMember.innerHTML += getTotal.total + "人";
  }else{
    countMember.innerHTML = "ERROR";
  }
})();