var app=angular.module("login.module",["ui.router"]);
app.config(function ($httpProvider) {
	$httpProvider.defaults.headers.common = {};
	$httpProvider.defaults.headers.post = {};
	$httpProvider.defaults.headers.put = {};
	$httpProvider.defaults.headers.patch = {};
});

app.controller('loginCtrl', ['$scope','descryptFactory','registerDevice','loginService','$location','$window', 
	function($scope,descryptFactory,registerDevice,loginService,$location,$window){
		$scope.user={};
		$scope.login=function(){
			loginService.login($scope.user).then(function(response){
				debugger;
				if(response==true)
				{
					$window.location.href ="./index.html#"+$window.sessionStorage.getItem("location") ;//'./index.html#/analytics';
				}
				else if(response==false)
				{
					alert("something went wrong")
				}
				else
				{
					
				}
				
			},function(reason){

			})
			
		}
		$scope.key="goparties";
		$scope.init=function(){
			registerDevice.register($scope.key).then(function(response){
				var data=descryptFactory.decrypt(response.data,$scope.key);
				$window.localStorage.setItem("key",data.data.credentials.key);
				$window.localStorage.setItem("token",data.data.credentials.token);
			},function(reason){

			});
		}
		$scope.init();
	}]);


app.factory("registerDevice",function($http,$q,$window){
	var obj={};
	obj.isCall=false;
	obj.register=function(key){
		var defer=$q.defer();
		var url;
		url="https://api.goparties.com/registerdevice"
		$http({
			method:'GET',
			url:url,
			headers:{
				authorization:key
			}
		}).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		})
		return defer.promise;
	}
	obj.isAuthorize=function(){
		if($window.localStorage.getItem("accessToken")!=null)
		{
			return $window.localStorage.getItem("accessToken");
			
		}
		else{
			this.register().then(function(response){
			},function(reason){
				
			});
			
		}
	}
	return obj;
})




app.factory("descryptFactory",function($http,$window,Base64){
	var obj={};
	obj.decrypt=function(data,key){

		var input =Base64.decode(data);
		var output="";

		for(var i=0;i<input.length;i++){
			var c = input.charCodeAt(i);
			var k = key.charCodeAt(i%key.length);

			output += String.fromCharCode(c ^ k);
		}
		return JSON.parse(output);
	}
	return obj;
});

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/




app.factory('Base64', function () {
	/* jshint ignore:start */

	var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	return {
		encode: function (input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			do {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output +
				keyStr.charAt(enc1) +
				keyStr.charAt(enc2) +
				keyStr.charAt(enc3) +
				keyStr.charAt(enc4);
				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			} while (i < input.length);

			return output;
		},

		decode: function (input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
            	window.alert("There were invalid base64 characters in the input text.\n" +
            		"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            		"Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
            	enc1 = keyStr.indexOf(input.charAt(i++));
            	enc2 = keyStr.indexOf(input.charAt(i++));
            	enc3 = keyStr.indexOf(input.charAt(i++));
            	enc4 = keyStr.indexOf(input.charAt(i++));

            	chr1 = (enc1 << 2) | (enc2 >> 4);
            	chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            	chr3 = ((enc3 & 3) << 6) | enc4;

            	output = output + String.fromCharCode(chr1);

            	if (enc3 != 64) {
            		output = output + String.fromCharCode(chr2);
            	}
            	if (enc4 != 64) {
            		output = output + String.fromCharCode(chr3);
            	}

            	chr1 = chr2 = chr3 = "";
            	enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    /* jshint ignore:end */
});



app.service("loginService",function($http,$q,$window,dcryptionFactory){
	var obj={};
	obj.isLoggedIn=false;
	obj.userName="";
	obj.userId="";

	obj.login=function(user){
		var defer=$q.defer();
		
		var url='https://api.goparties.com/login';
		var data={};
		data.email=user.email;
		data.password=user.password;
		debugger;
		$http({
			method:'POST',
			url:url,
			data:data,
			headers:{
				authorization:$window.localStorage.getItem("token")
			}

		})
		.then(function(response){
			response.data=dcryptionFactory.decrypt(response.data,$window.localStorage.getItem("key"));	
			if(response.data.hasOwnProperty("data")&&response.data.data.profile.profile_type=="Partymon")
			{
				var userInfo=response.data.data.profile;
				obj.isLoggedIn=true;
				$window.sessionStorage.setItem("isLoggedIn",true);
				obj.userName=userInfo.username;
				obj.userId=userInfo.id;
				$window.sessionStorage.setItem("userInfo",JSON.stringify(userInfo));
				$window.sessionStorage.setItem("userId",userInfo._key);
				$window.localStorage.setItem("userInfo",JSON.stringify(userInfo));
				defer.resolve(true);
			}
			else if(response.data.data.profile.profile_type=="Partymon"){
				alert("profile type Partymon not allow to access business application");
			}
			else if(response.data.hasOwnProperty("error"))
			{
				obj.isLoggedIn=false;
				$window.sessionStorage.setItem("isLoggedIn",false);
				obj.userName="";
				obj.userId="";
				defer.resolve(response.data.error.message);
			}
			else
			{
				obj.isLoggedIn=false;
				$window.sessionStorage.setItem("isLoggedIn",false);
				obj.userName="";
				obj.userId="";
				defer.reject(false);
			}

			
		},function(reason){
			defer.reject(reason)
		});
		return defer.promise;
	}
	return obj;
});




app.factory("dcryptionFactory",function($window,Base64){
	var obj={};
	obj.decrypt=function(data,key){
		var output="";
		newkey=Base64.decode(key);
		var input = Base64.decode(data);
		for(var i=0;i<input.length;i++){
			var c = input.charCodeAt(i);
			var k = newkey.charCodeAt(i%newkey.length);

			output += String.fromCharCode(c ^ k);
		}
		return JSON.parse(output);
		
	}
	return obj;
});






var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}
