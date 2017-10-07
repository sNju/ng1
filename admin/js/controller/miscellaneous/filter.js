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
		if(date==undefined)
			return "";


		else if(date==" "){
			return "";
		}
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
	return function(date,separator,istime){
		separator=separator||" ";
		var formatedDate="";
		var time="";
		if(date!=undefined&&date!=null&&date.length>0){
			var month=parseInt(date.substring(3,5));
			month--;
			var day=date.substring(0,2)
			var year=date.substring(6,10);
			formatedDate=day+separator+months[month]+separator+year;
			var hour=parseInt(date.substring(11,13));
			var minute=date.substring(13,date.length);

			if(istime==true){
				if(hour>9){
					if(hour==12)
						time=hour+minute+' AM';
					else if(hour>12)
						time=parseInt(hour)-12+minute+' PM';

					else
						time=hour+minute+' AM';
				}
				else if(hour=='0' && minute==':00'){
				    time='12'+minute+' AM';

				}
				else
				{
					time='0'+hour+minute+' AM';
				}

				return formatedDate+" "+time; 
			}

			else{
				return formatedDate;
			}
		}
		
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
		time=$filter("timeStampToDate")(time,"dd-mm-yyyy","-",1);
		time=$filter("calendarDateTimeFormat")(time,'-',false);
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

app.filter("dateddmmyyyytotimestamp",function(){
	return function(time){
		if(time!=undefined&&time!=""){
			var months=["jan","feb","mar","apr","may","june","july","aug","sep","oct","nov","dec"];
			var timestring;
			var month;
			for( var i=0;i<12;++i){
				if(time.toLowerCase().indexOf(months[i])>=0)
				{
					month=i+1;
					break;
				}
			}
			timestring=time.match(/\d+/g);
			time=month+"/"+timestring[0]+"/"+timestring[1];
			if(timestring.length==4){
				time+=" "+timestring[2]+":"+timestring[3];
			}
			return new Date(time).getTime();
		}
	}
});


app.filter("timestamptodatetimepickerformat",function(){
	return function(time){
		var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		var months=["January","February","March","April","May","June",
		"July","August","September","October","November","December"];
		if(time!=undefined&&time!=""){
			var day=days[new Date(time).getDay()];
			var month=months[new Date(time).getMonth()];
			var timestring=String(new Date(time)).match(/\d+/g);
			
			var format=day+" "+timestring[0]+" "+month+" "+timestring[1]+" - "+timestring[2]+":"+timestring[2];
			return format;
		}

	}
	
});


app.filter("timetotimestamp",function(){
	return function(time){
		var hour="";
		if(time!=undefined&&time!=""){
			debugger;
			var timearray=time.match(/\d+/g);
			hour=parseInt(timearray[0])*60*60*1000;
			hour+=parseInt(timearray[1])*60*1000;

		}
		return hour;

	}
});

app.filter("timestamptotime",function(){
	return function(time){
		var hour;
		var minute;
		if(time!=undefined&&time!=""){
			if(time.toString().indexOf(":")>=0){
				return time;
			}
			debugger;
			time=time/(1000*60);
			hour=parseInt(time/60);
			time=time%60;
			minute=time;
			hour=hour<10?"0"+hour:hour;
			minute=minute<10?"0"+minute:minute;
			return hour+":"+minute;
		}

		return "";

	}
});


app.filter("timestamptoindiantimeformat",function($filter){
	return function(time){
		var hour;
		var minute;
		if(time!=undefined&&time!=""){
			if(time.toString().indexOf(":")>=0){
				return time;
			}
			debugger;
			time=time/(1000*60);
			hour=parseInt(time/60);
			time=parseInt(time)%60;
			minute=time;
			hour=hour<10?"0"+hour:hour;
			minute=minute<10?"0"+minute:minute;
			return $filter("indianTimeFormat")(hour)+":"+minute+" "+$filter("amAndPm")(hour);
		}

		return "";

	}
});


app.filter("chattimepolicy",function($filter){
	return function(time){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; 
		var yyyy = today.getFullYear();
		var date=mm+"/"+dd+"/"+yyyy+" 00:00";
		var todaytimestamp=new Date(date).getTime();
		var oneday=24*60*60*1000;
		var yesterday=todaytimestamp-oneday;
		if(todaytimestamp<time){
			return $filter("timestamptoindiantimeformat")(time-todaytimestamp);
		}

		else if(yesterday<=time&&time<todaytimestamp){
			return 'Yesterday';
		}

		else{
			return $filter("timeStamptoProperDate")(time);
		}

	}
})

app.filter("trustUrl", ['$sce', function ($sce) {
	return function (recordingUrl) {
		return $sce.trustAsResourceUrl(recordingUrl);
	};
}]);
