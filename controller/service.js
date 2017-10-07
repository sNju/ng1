(function(){
	var app=angular.module("service.module",[]);

	app.factory("httpService",function($http,$rootScope,$q,cachedataservice){
		var obj=new Object();
		obj.post=function(url,data){
			var defer=$q.defer();
			$http.post(url,data).then(function(response){
				if(response!=undefined&&response.data!=undefined)
					defer.resolve(response.data);
				else{
					defer.reject("something went wrong");
				}
			},function(reason){
				defer.reject(reason);
			})
			return defer.promise;
		}
		obj.get=function(url){
			var defer=$q.defer();

			if($rootScope.islogin==true){
				if(url.split("?").length>1){
					url=url+"&user="+$rootScope.userinfo._key;
				}
				else{
					url=url+"?user="+$rootScope.userinfo._key;
				}
			}
			if(cachedataservice.get(url)==undefined){
				$http.get(url).then(function(response){
//				console.log("service",response);
if(response!=undefined&&response.data!=undefined){
	cachedataservice.set(url,response.data);
						// var value=amplify.store("testvar");
						// console.log("response_amplify",value);
						defer.resolve(response.data);
					}

					else{
						defer.reject("something went wrong");
					}
				},function(reason){
					defer.reject(reason);
				});
			}
			else{
				setTimeout(defer.resolve(cachedataservice.get(url)),10);
			}
			return defer.promise;
		}

		obj.put=function(url,data){
			//console.log("url,data",url,data);
			var defer=$q.defer();
			$http.put(url,data).then(function(response){
				if(response!=undefined&&response.data!=undefined)
					defer.resolve(response.data);
				else{
					defer.reject("something went wrong");
				}
			},function(reason){
				defer.reject(reason);
			});
			return defer.promise;
		}

		obj.delete=function(url){
			var defer=$q.defer();
			$http.delete(url).then(function(response){
				if(response!=undefined&&response.data!=undefined)
					defer.resolve(response.data);
				else{
					defer.reject("something went wrong");
				}
			},function(reason){
				defer.reject(reason);
			});
			return defer.promise;
		}
		return obj;
	});


	app.factory("cachedataservice",function($rootScope,$q){
		var data={};
		var object=new Object();
		function makeurl(url){
			if($rootScope.islogin==true){
				if(url.split("?").length>1){
					url=url+"&user="+$rootScope.userinfo._key;
				}
				else{
					url=url+"?user="+$rootScope.userinfo._key;
				}
			}
			return url;
		}

		object.set=function(key,value){
			data[key]=value;
		}

		object.get=function(key){
			// check if we already have the response from the server
			for(var url in window.cachedata) {
				if(url!='' && key.toLowerCase()==url.toLowerCase()) {
					return window.cachedata[url];
				}				
			}
			return data[key];
		}

		object.getlocal=function(key){
			var defer=$q.defer();
			var url=makeurl(key);
			defer.resolve(data[url]);
			return defer.promise;
		}
		return object;
	});


	app.factory("calculateRemainTime",function(){
		var obj=new Object();
		obj.calculate_remainingtime=function(timestamp)
		{


			var timestring="";
			var  party_date=parseInt(timestamp);
			var  current_timestamp= new Date().getTime();
			var day=party_date-current_timestamp;
			var hour=(day/(60*60*1000))%24;
			day=day/(24*60*60*1000);
			if(day>=1||day<=-1)
			{
				day=Math.floor(day);
				timestring=day.toString();
				if(day<=-1)
					timestring+="D";
				return timestring;
			}
			else
			{
				return Math.floor(hour);
			}

		}

		obj.calculateDays_string=function(timestamp)
		{
			var timestring;

	//var date=new Date(d_day *1000);

	var  party_date=parseInt(timestamp*1000);

	var  current_timestamp= new Date().getTime();
	var day=party_date-current_timestamp;
	//var diff = (date2-date1) / 3600000;
	day=Math.floor(day/(24*60*60*1000));

	//console.log("day=",day);
	if(day==0)
	{
		timestring="Hour Left";
	}

	else if(day==1)
	{
		timestring="Day Left";
	}
	else if(day>1)
	{
		timestring="Days Left";
	}
	else
	{
		timestring="Gone"
	}

	return timestring;
}
return obj;
});


	app.factory("distanceCalculate",function($q,$rootScope){
		var obj=new Object();
		var latitude,longitude,object="",set=false;
		function showlocation() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition);
			} else {
				alert("your browser geolocation not support so we are not able to identify your current position")
			}
		}

		function showPosition(position){
			latitude=position.coords.latitude;
			longitude=position.coords.longitude;
			object=new Object();
			object.latitude=latitude;
			object.longitude=longitude;
			if(set==false){
				set=true;
				$rootScope.$broadcast("txtlocation",object);
			}



		}

		obj.initlocation=function(){
			if(object=="")
				showlocation();
			else{
				$rootScope.latitude=object.latitude;
				$rootScope.longitude=object.longitude;
				$rootScope.$broadcast("txtlocation",object);
			}
		}

		obj.getDistanceFromLatLonInKm=function(lat2, lon2){

			if(lat2==undefined||lon2==undefined){
				return "";
			}

			if(latitude==undefined){
				showlocation();
				return "";
			}
			var p = 0.017453292519943295;
			var c = Math.cos;
			var a = 0.5 - c((lat2 - latitude) * p)/2 +
			c(latitude * p) * c(lat2 * p) *
			(1 - c((lon2 - longitude) * p))/2;

			var km=parseInt(12742 * Math.asin(Math.sqrt(a)));
			return km+" KM";

		}
		obj.getDistanceFromLatLonInKmusingpromise=function(lat2, lon2){
			var defer=$q.defer();
			if(lat2==undefined||lon2==undefined){
				return "";
			}

			if(latitude==undefined){
				showlocation();
				return "";
			}
			var p = 0.017453292519943295;
			var c = Math.cos;
			var a = 0.5 - c((lat2 - latitude) * p)/2 +
			c(latitude * p) * c(lat2 * p) *
			(1 - c((lon2 - longitude) * p))/2;

			var km=parseInt(12742 * Math.asin(Math.sqrt(a)));
			//console.log("km=",km);
			return km+" KM";

		}
		return obj;
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
			var month=now.getMonth()+increment;
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

	app.filter("timeStamptoProperDate",function($filter){
		return function(time){
			if(time==undefined)
				return "";
			time=parseInt(time);
			if(time>9999999){
				time=time/1000;
			}
			time=$filter("timeStampToDate")(time,"dd-mm-yyyy");
			time=$filter("calendarDateTimeFormat")(time);
			return time;
		}
	});


	app.directive("ratingDirective",function(){
		return {
			replace:true,
			restrict:'EA',
			scope:{
				ratingObj:'='
			},
			templateUrl:"directive/rating.html",
			link:function($scope,element,attrs,controller,transclude){
				//console.log("attrs.rating",attrs.rating);
				$scope.rating=attrs.rating;
				attrs.$observe("rating", function (newValue) {
					$scope.rating=attrs.rating;
				});
			}
		}
	});

	app.directive("preloaderDirective",function($rootScope){
		return {
			replace:true,
			restrict:'EA',
			scope:false,
			link:function($scope,element,attrs,controller,transclude){
				// var counter=0;

				// $rootScope.$watch("loading",function(newval,oldval){
				// 	if($rootScope.loading==false&&counter==0){
				// 		counter++;
				// 		$('#gpAppModal').modal('show');
				// 	}
				// });

			}
		}
	});



	app.directive("modalOpen",function(){
		return {
			link:function($scope,$attr,$element){
				$scope.$on("opendownloadmodal",function($event){
					$('#gpAppModal').modal('show');
				});
			}
		}
	});
})();
