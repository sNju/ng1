var app=angular.module("common.module",['ngMaterial']);

app.controller('commonController', ['$scope', function($scope,$window){
	
}]);
app.factory("urlFactory",function($q,$window){
	var obj={};
	obj.userId=$window.sessionStorage.getItem("userId");
	var urls=[{
		key:"apiBaseUrl",
		value:"http://52.77.185.79:4689/api"
	},
	{
		key:"apiBaseUrlUpdated",
		value:"https://api.goparties.com"
	},
	{
		key:"uploadfile",
		value:"/uploadfile"
	},
	{
		key:"album",
		value:"/album"
	},
	{
		key:"work",
		value:"/work"
	},
	{
		key:"album",
		value:"/album"
	},
	{
		key:"party",
		value:"/party"
	},
	{
		key:"deal",
		value:"/deal"
	},
	{
		key:"servicecategory",
		value:"/servicecategory"
	},
	{
		key:"localBaseUrl",
		value:"http://192.168.0.43:8179"
	},
	{
		key:"network",
		value:"/network"
	},
	{
		key:"profile",
		value:"/profile"
	},
	{
		key:"post",
		value:"/post"
	},
	{
		key:"discover",
		value:"/discover"
	},
	{
		key:"booking",
		value:"/booking"
	},
	{
		key:"oldApiBaseUrl",
		value:"http://www.goparties.com/api/api.php"
	},
	{
		key:"access_token",
		value:"133688745fb3253a0b4c3cbb3f67d444cf4b418a"
	},
	{
		key:"autocompleteNameUrl",
		value:"http://52.77.185.79:4689/api/profile?minified=true&access_token=133688745fb3253a0b4c3cbb3f67d444cf4b418a"
	},
	{
		
		key:"getMyRequest",
		value:"http://52.77.185.79:4689/api/getmybookings?access_token=133688745fb3253a0b4c3cbb3f67d444cf4b418a&userid="+obj.userId
	},
	{
		key:"getSupportProfiles",
		value:"/getsupportprofiles"
	},
	{
		key:"apiBaseUrlPHP",
		value:"http://goparties.com/api/api.php"
	}
	];

	
	var defer=$q.defer();

	obj.getUrl=function(key){
		
		if(key!=undefined||key.length()>0)
		{
			var url=urls.filter(function(obj){
				return obj.key.toLowerCase()==key.toLowerCase();
			});
			var obj={};
			obj.key=url[0].key;
			obj.value=url[0].value;
			return obj;
		}
		else
		{
			alert("please make send correct key value");
		}
	}
	obj.setUrl=function(url){

	}
	return obj;
});
app.factory("dateFactory",function(){
	var obj={};
	obj.converttoTimeStamp=function(date,format){
		if(date!=undefined&&date!=null&&date.length>0)
		{
			var staggingDate="";
			var stagingTime="";
			if(format=="dd-mm-yyyy"){
				var staggingDate=date.substring(3,5)+"-"+date.substring(0,2)+"-"+date.substring(6,10);
			}
			else
			{
				staggingDate=date;
			}
			if(date.length>11){
				stagingTime=date.substring(11,date.length);
			}
			return new Date(staggingDate+" "+stagingTime).getTime();
		}
		else
		{
			return "";
		}
	}
	return obj;
});
app.factory("toastMessage",function($mdToast){
	var obj={};
	obj.success=function(message){
		$mdToast.show(
			$mdToast.simple()
			.textContent('Hello World!')
			.position("left bottom")                      
			.hideDelay(3000)
			);
	};
	return obj;
});




app.factory("latlongFactory",function($window,$rootScope){
	var obj={};
	obj.initialize=function() {
		//console.log("lat long call");
		var address = (document.getElementById('txtlocation'));
		var autocomplete = new google.maps.places.Autocomplete(address);
		autocomplete.setTypes(['geocode']);
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				return;
			}
			var address = '';
			if (place.address_components) {
				address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
				obj.codeAddress();
				//console.log("address.value",document.getElementById('txtlocation').value);
				$rootScope.$emit("locationEvent",document.getElementById('txtlocation').value);
			}
		});
	}
	obj.codeAddress=function() {
		geocoder = new google.maps.Geocoder();
		var address = document.getElementById("txtlocation").value;
		geocoder.geocode( {'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var latitude=results[0].geometry.location.lat();
				var longitude=results[0].geometry.location.lng();
				$window.sessionStorage.setItem("latitude",latitude);
				$window.sessionStorage.setItem("longitude",longitude);
			}else{
				alert("Geocode was not successful for the following reason: " + status);
			}
		});
	}

	obj.currentLatLong=function() {
		if($window.sessionStorage.getItem("Curlattitude")==null||$window.sessionStorage.getItem("Curlongitude")==null)
		{
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(obj.showPosition);
			} else {
				alert("your browser geolocation not support so we are not able to identify your current position")
			}
		}
		else
		{
			
		}
	}
	obj.showPosition=function(position) {
		$window.sessionStorage.setItem("Curlattitude",position.coords.latitude);
		$window.sessionStorage.setItem("Curlongitude",position.coords.longitude);
	}

	return obj;
});
app.factory("countryList",function(urlFactory,$q,$http,countryListResolve){
	var obj={};
	var defer=$q.defer();
	obj.getCountry=function(){
		debugger;
		var url=urlFactory.getUrl("oldApiBaseUrl").value;
		url+="/countrieslist?access_token=133688745fb3253a0b4c3cbb3f67d444cf4b418a";
		$http.get(url).then(function(response){
			countryListResolve.resolveCountry(response);
			defer.resolve(response);
		},function(error){
			defer.reject(error);
		});
		return defer.promise;
	}
	return obj;
});

app.factory("countryListResolve",function(){
	var obj={};
	obj.resolveCountry=function(data)
	{
		var country=data.data.data.countries;
		var countryObj={};
	}
	return obj
});


app.factory("chromeNotificationFactory",function(){
	var obj={};
	obj.sendNotification=function(message,link){
		if (Notification.permission !== "granted")
			Notification.requestPermission();
		if (!Notification) {
			alert('Desktop notifications not available in your browser. Try Chromium.'); 
			return;
		}
		if (Notification.permission !== "granted")
			Notification.requestPermission();
		else {
			var notification = new Notification('Notification title', {
				icon: 'http://gopartiesstatic.s3.amazonaws.com/favicon.png',
				body: message,
			});
			//setTimeout(Notification.close(), 1000);
			notification.onclick = function () {
				window.open(link);      
			};


		}

		
	}
	return obj;
})


app.factory("genreCoversionFactory",function(){
	var obj={};
	obj.makergenreArray=function(string){
		if(string==null||string=="")
			return new Array();
		if(string.constructor === Array)
			return string;
		var array=string.split(',');
		var newarray=[];
		for(var i=0;i<array.length;i++){
			if(array[i]!=','){
				newarray.push({
					value: array[i].toLowerCase(),
					display: array[i],
					name:array[i].toUpperCase()
				});
			}
		}
		return newarray;
	}

	obj.convertGenreToString=function(genres){
		var genre="";
		debugger;
		for(var i=0;i<genres.length-1;i++){
			genre+=genres[i].display+",";
		}
		if(genres.length>0)
			genre+=genres[genres.length-1].display;
		return genre;
	}
	return obj;
})

app.factory("makePartyAndDealArrayProper",function(){
	var obj={};
	
	obj.formatArray=function(array,keyArray){
		var newArray=[];
		for(var i=0;i<array.length;i++){
			var obj=new Object();
			for(var j=0;j<keyArray.length;j++){
				if(array[i][keyArray[j]]==undefined)
					array[i][keyArray[j]]="";
				obj[keyArray[j]]=array[i][keyArray[j]];
				
			}
			newArray.push(obj);
			
		}
		return newArray;
	}
	return obj;
});



app.factory("autoCompleteThemeGenreAndProfile",function($q,$window,$rootScope,httpService){
	var obj={};
	var genre=[];
	var theme=[];
	function getsearchData(data){
		return data.map( function (state) {
			return {
				value: state.toLowerCase(),
				display: state,
				image:"",
				name:state.toUpperCase(),
				email:""
			};
		});
	}

	obj.loadTheme=function(){
		if(theme==""){
			var defer=$q.defer();
			var url=$rootScope.apiBaseUrl;
			url+="/"+"theme";
			
			httpService.get(url).then(function(response){
				theme=response.data.theme;
			},function(reason){
				
			});
			
		}
		return getsearchData(theme);
	};

	obj.querySearch=function(query,method) {
		if(query==null||query=="")
		{
			return obj.loadStates();
		}
		var results = query ? obj[method]().filter(function(state){
			var lowercaseQuery = angular.lowercase(query);
			return (state.value.indexOf(lowercaseQuery) === 0);
		}) :  obj[method]();
		if(results.length==0)
		{
			results.push({
				value: query.toLowerCase(),
				display: query,
				image:"",
				name:query.toUpperCase(),
				email:""
			})
		}
		return results;
	};

	obj.loadGenre=function()
	{
		if(genre==""){
			var defer=$q.defer();
			var url=$rootScope.apiBaseUrl;
			url+="/"+"genre";
			
			httpService.get(url).then(function(response){
				genre=response.data.genre;
			},function(reason){
				
			});
			
		}
		return getsearchData(genre);
	}

	obj.loadProfile=function(){
		var allStates = 'Alabamaaaaaaaaaaa, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
		Florida, Georgia, aawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
		Maine, Maryland, aassachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
		Nebraska, Nevada, aew Hampshire, New Jersey, New Mexico, New York, North Carolina,\
		North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
		South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
		Wisconsin, Wyoming';
		return allStates.split(/, +/g).map( function (state) {
			return {
				value: state.toLowerCase(),
				display: state,
				image:"",
				name:state.toUpperCase(),
				email:""
			};
		});
	}
	obj.loadGenre();
	obj.loadTheme();
	return obj;
});



app.factory("httpService",function($http,$q){
	var obj=new Object();
	obj.post=function(url,data){
		var defer=$q.defer();
		$http.post(url,data).then(function(response){
			defer.resolve(response.data);
		},function(reason){
			defer.reject(reason);
		})
		return defer.promise;
	}
	obj.get=function(url){
		var defer=$q.defer();
		$http.get(url).then(function(response){
			defer.resolve(response.data);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}

	obj.put=function(url,data){
		var defer=$.defer();
		$http.put(url,data).then(function(response){
			defer.resolve(response.data);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}

	obj.delete=function(url){
		var defer=$q.defer();
		$http.delete(url).then(function(response){
			defer.resolve(response.data);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
});
