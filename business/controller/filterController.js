var app=angular.module("filter.module",[]);
app.filter("dateFormat",function(){
	var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
	return function(date,separator){
		separator=separator||"-";
		if(date!=undefined&&date!=null&&date.length>0){
			var month=parseInt(date.substring(3,5));
			var day=date.substring(0,2)
			var year=date.substring(6,10);
			return day+separator+months[month]+separator+year;
		}
	}
});
app.filter("timeFormat",function(){
	return function(date){
		if(date!=undefined&&date!=null&&date.length>0){
			var hour=parseInt(date.substring(11,13));
			var minute=date.substring(14,date.length);
			minute=minute==""?0:minute;
			minute=parseInt(minute);
			minute=minute<10?"0"+minute:minute;
			if(hour>9){
				if(hour==12)
					return hour+":"+minute+' AM';
				else if(hour>12)
					return parseInt(hour)-12+":"+minute+' PM';
				return hour+":"+minute+' AM';
			}
			else
			{
				return '0'+hour+":"+minute+' AM';
			}
		}
		
	}
});

app.filter("timeStampToDate",function(){
	return function(date,format,separator,increment,isOnlyDate){
		increment=increment||0;
		separator=separator||"-";
		format=format||"dd-mm-yyyy";
		var now;
		if(parseInt(date)>=1000000000000){
			now= new Date(date);
		}
		else{
			now= new Date(date*1000);
		}
		
		var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
		var day=now.getDate();
		day=day<10?'0'+day:day;
		var month=(now.getMonth()+1);
		month=month<10?'0'+month:month;
		var year=now.getFullYear();
		var hours=now.getHours();
		hours=hours<10?'0'+hours:hours;
		var minute=now.getMinutes();
		minute=minute<10?'0'+minute:minute;
		if(isOnlyDate==undefined){
			if(format=="dd-mm-yyyy")
				return day+separator+month+separator+year+" "+hours+":"+minute;
			else if(format=="mm-dd-yyyy") 
				return month+separator+day+separator+year+" "+hours+":"+minute;
			else 
				return year+separator+month+separator+day+" "+hours+":"+minute;
		}
		else{
			if(format=="dd-mm-yyyy")
				return day+separator+month+separator+year;
			else if(format=="mm-dd-yyyy") 
				return month+separator+day+separator+year;
			else 
				return year+separator+month+separator+day;

		}
	}
});

app.filter("calendarDateTimeFormat",function(){
	var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
	return function(date,separator){
		separator=separator||" ";
		var formatedDate="";
		var time="";
		if(date!=undefined&&date!=null&&date.length>0){
			var month=parseInt(date.substring(3,5));
			var day=date.substring(0,2)
			var year=date.substring(6,10);
			formatedDate=day+separator+months[month]+separator+year;
			var hour=parseInt(date.substring(11,13));
			var minute=date.substring(13,date.length);
			if(hour>9){
				if(hour==12)
					time=hour+minute+' AM';
				else if(hour>12)
					time=parseInt(hour)-12+minute+' PM';
				
				else
					time=hour+minute+' AM';
			}
			else
			{
				time='0'+hour+minute+' AM';
			}
		}
		return formatedDate+", "+time; 
	}



});

app.filter("indianTimeFormat",function(){
	return function(hour){
		hour=parseInt(hour);
		if(hour>9){
			
			if(hour>12)
			{

				hour=(hour-12);//<9?'0'+hour:hour;

			}
			return hour<10?'0'+hour:hour;
		}
		else
		{
			return '0'+hour;
		}
	}
});

app.filter("amAndPm",function(){
	return function(hour){
		hour=parseInt(hour);
		return hour>12?'PM':'AM';
	}
});

app.filter("timeStamptoProperDate",function($filter){
	return function(time){
		if(time==undefined)
			return "";
		time=parseInt(time);
		if(time>9999999){
			time=time/1000;//date,format,separator,increment
		}
		time=$filter("timeStampToDate")(time,"dd-mm-yyyy","-",1,true);
		time=$filter("calendarDateTimeFormat")(time);
		return time;
	}
});


app.filter("formatchnageandConvertTimeStamp",function(){
	return function(time){
		if(typeof time==='string'){
			var day=time.substring(0,2);
			var month=time.substring(3,5);
			var year=time.substring(6,10);
			var hour=time.substring(11,time.length);
			return new Date(month+"/"+day+"/"+year+" "+hour).getTime();
		}
	}
})


app.filter("getremaintimecalculate",function(){
	return function(startdate,enddate){
		if(startdate<1000000000000){
			startdate=startdate*1000;
		}
		if(enddate<1000000000000){
			enddate=enddate*1000;
		}
		var current=new Date().getTime();
		if(startdate<current&&current<enddate)
			return "Ongoing";
		else if(current>=enddate)
			return "Happened";
		else{
			var remain=startdate-current;
			var day=parseInt(remain/(24*60*60*1000));
			remain=remain%(24*60*60*1000);
			var hour=parseInt(remain/(60*60*1000));
			remain=remain%(60*60*1000);
			var minute=parseInt(remain%(60*1000));
			minute=parseInt(minute/1000);
			var string="";
			if(day!=0){
				string=day+" ";
				if(day==1)
					string+="Day";
				else{
					string+="Days";
				} 

			}
			if(hour!=0){
				string+=" "+hour+" ";
				
				if(hour==1){
					string+="hour ";
				}
				else{
					string+="hours ";
				}

			}
			if(day==0){
				string+=minute+" Minute";

			}
			return string;
		}

	}
});
