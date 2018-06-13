var email = document.getElementById("email");
var sendEmail = document.getElementById("sendEmail");
var countMember = document.getElementById("countMember");
var countDown=document.getElementById("countDown");
var date=new Date(2018,6-1,4,12);

var timer=window.setInterval(function(){
	var dateToday=new Date();
	if(dateToday.getTime()<date.getTime()){
		var totalSeconds=(date.getTime()-dateToday.getTime())/1000;
		var countSeconds=Math.floor(totalSeconds%60);
		var countMinutes=Math.floor((totalSeconds/60)%60);
		var countHours=Math.floor((totalSeconds/60/60)%24);
		var countDays=Math.floor(totalSeconds/60/60/24);
		if(date.getTime()==dateToday.getTime()){
			clearInterval(timer);
		}
		countDown.innerHTML="倒數"+countDays+"天"+countHours+"時"+countMinutes+"分"+countSeconds+"秒";
	}else{
		var totalSeconds=(dateToday.getTime()-date.getTime())/1000;
		var countSeconds=Math.floor(totalSeconds%60);
		var countMinutes=Math.floor((totalSeconds/60)%60);
		var countHours=Math.floor((totalSeconds/60/60)%24);
		var countDays=Math.floor(totalSeconds/60/60/24);
		if(date.getTime()==dateToday.getTime()){
			clearInterval(timer);
		}
		countDown.innerHTML="已過"+countDays+"天"+countHours+"時"+countMinutes+"分"+countSeconds+"秒";
	}
},1000);

function getEmail(strEmail){
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
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
    var request = new XMLHttpRequest();
    request.open('GET', "https://www.thef2e.com/api/signUpTotal", true); 
    request.send(null);
    request.onload = function() {
      resolve(this.responseText);
    };
  });
}
function isEmail(email) {
  var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
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
       var applyJson = JSON.parse(resv);
       var str = "";
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
  var getTotal = JSON.parse( await count() );
  if(getTotal.success){
    countMember.innerHTML += getTotal.total + "人";
  }else{
    countMember.innerHTML = "ERROR";
  }
})();