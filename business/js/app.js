var app=angular.module("app.module",["ui.router","oc.lazyLoad","analytics.module","ui.bootstrap","filter.module","ngAnimate","ngToast","ngAnimate","ADM-dateTimePicker","httpRequest.module","common.module","discoverAndBook.module",
	"create.module","ui.tinymce","ngCookies","chat.module","directchat.module","supportService.module","bookingRecords.module","broadcastGroup.module","createAvailability.module","commonDirective.module","createdParties.module","cardDirective.module"
	,"card.module","launchMyWork.module","createdDeals.module","notification.module","myLaunchedWork.module", "launchAlbum.module","payment.module","paymenthistory.module","payoutrequest.model","createPost.module", "createdPost.module", "smmFirstTimeScreen.module", "manageProfile.module", "manageSocialMediaHandles.module", "faq.module", "relationshipManager.module"]);

app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/");
	var login={
		url:"/login",
		templateUrl:"./login.html"
	}
	$stateProvider.state("/",{
		url:"/profile/:profile_type?token",
		templateUrl:"./html/discoverAndBook/discoverAndBook.html",
		controller:"discoverController"
	}).state("notificationdetail",{
		url:"/notificationdetail?token",
		templateUrl:"./html/notificationdetail.html",
		controller:"notificationCtrl"
	}).state("analytics",{
		url:"/analytics?token",
		templateUrl:"./html/analytics/analytics.html"
	})
	.state("profile",{
		url:"/?token",
		templateUrl:"./html/discoverAndBook/discoverAndBook.html",
		controller:"discoverController"
	})
	.state("createParty",{
		url:"/createparty/:id?token",
		templateUrl:"./html/create/createParty.html",
		controller:"createpartyController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["controller/create/createpartyController.js"]
			})
		}]
	})
	.state("createdParties",{
		url:"/createdParties/:category?token",
		templateUrl:"./html/create/createdParties.html",
		controller:"createdPartiesCtrl"
	})
	.state("createStandAloneDeal",{
		url:"/createStandAloneDeal/:id?token",
		templateUrl:"./html/create/createStandAloneDeal.html",
		controller:"createstandaloneController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["controller/create/createstandaloneController.js"]
			})
		}]
	})
	.state("createdStandAloneDeals",{
		url:"/createdStandAloneDeals/:category?token",
		templateUrl:"./html/create/createdStandAloneDeals.html",
		controller:"createdDealsCtrl"
	})

	.state("availability",{
		url:"/createdAvailabilities?token",
		templateUrl:"./html/create/availability.html",
		controller:"createAvailabilityCtrl"
	})
	.state("bookingRecords",{
		url:"/bookingRecords/:category?token",
		templateUrl:"./html/bookingRecords/bookingRecords.html",
		controller:"bookingRecordsCtrl"
	})
	.state("broadcastgroup",{
		url:"/broadcastGroup/:id?token",
		templateUrl:"./html/bookingRecords/broadcastGroup.html",
		controller:"broadcastGroupCtrl" 	
	})
	.state("bookingchat",{
		url:"/bookingchat/:id?record_id&token",
		templateUrl:"./html/bookingRecords/bookingChat.html",
		controller:"chatCtrl"
	})
	.state("directchat",{
		url:"/directchat/:id?token",
		templateUrl:"./html/bookingRecords/directchat.html",
		controller:"directchatController"
	})

	.state("launchMyWork", {
		url:"/launchMyWork/:id?token",
		templateUrl:"./html/launchMyWork/launchMyWork.html",
		controller:"launchMyWorkCtrl.fileUploadCtrl"
	})
	.state("myLaunchedWork", {
		url:"/myLaunchedWork/:category?token",
		templateUrl:"./html/launchMyWork/myLaunchedWork.html",
		controller:"myLaunchedWorkCtrl"
	}).state("launchAlbum", {
		url:"/launchAlbum/:id?token",
		templateUrl:"./html/launchMyWork/launchAlbum.html",
		controller:"launchAlbumController"
	})
	.state("categoryList",{
		url:"/categoryList?token",
		templateUrl:"./html/supportServices/categoryList.html",
		controller:"supportServiceCtrl"
	}).state("serviceList",{
		url:"/serviceList/:type?token",
		templateUrl:"./html/supportServices/serviceList.html",
		controller:"supportServiceCtrl.serviceListCtrl"
	}).state("serviceDetail",{
		url:"/serviceDetail:id?token",
		templateUrl:"./html/supportServices/serviceDetail.html",
		controller:"supportServiceCtrl.serviceDetailCtrl"
	}).state("cardHolder",{
		url:"/payment/cardHolder?token",
		templateUrl:"./html/payment/cardHolder.html",
		controller:"paymentCtrl"
	}).state("paymentHistory",{
		url:"/payment/paymentHistory?token",
		templateUrl:"./html/payment/paymentHistory.html",
		controller:"paymenthistoryController"
	}).state("payoutrequest",{
		url:"/payment/payoutrequest?token",
		templateUrl:"./html/payment/payoutrequest.html",
		controller:"payoutrequestController"
	})
	.state("smmFirstTimeScreen",{
		url:"/smmFirstTimeScreen?token",
		templateUrl:"./html/socialMediaManagement/smmFirstTimeScreen.html",
		controller:"smmFirstTimeScreenCtrl"
	})
	.state("createPost",{
		url:"/createPost?token",
		templateUrl:"./html/socialMediaManagement/createPost.html",
		controller:"createPostCtrl"
	})
	.state("createdPost",{
		url:"/createdPost/:network?token",
		templateUrl:"./html/socialMediaManagement/createdPost.html",
		controller:"createdPostCtrl"
	})
	
	.state("manageProfile",{
		url:"/manageProfile?token",
		templateUrl:"./html/manage/manageProfile.html",
		controller:"manageProfileCtrl"
	})
	.state("manageSocialMediaHandles",{
		url:"/manageSocialMediaHandles?token",
		templateUrl:"./html/manage/manageSocialMediaHandles.html",
		controller:"manageSocialMediaHandlesCtrl"
	})

	.state("faq",{
		url:"/faq?token",
		templateUrl:"./html/help/faq.html",
		controller:"faqCtrl"
	})
	.state("relationshipManager",{
		url:"/relationshipManager?token",
		templateUrl:"./html/help/relationshipManager.html",
		controller:"relationshipManagerCtrl"
	})




});

app.run(function($rootScope,$state,$cookies,registerDevice,dcryptionFactory,$location,loginService,$window,loginService,$stateParams,httpService){
	$rootScope.$on("$stateChangeStart",function(event,toState,toParams){
		var value=$window.sessionStorage.getItem("isLoggedIn");
		$rootScope.apiBaseUrl="https://api.goparties.com";
		$rootScope.key="goparties";
		$rootScope.homeurl="http://www.goparties.com/index.html#/";
		$window.sessionStorage.setItem("location",$location.path());

		function getUserInfo(toParams){
			var data={};
			data.token=toParams.token;
			var url=$rootScope.apiBaseUrl;
			url+="/authorize"
			httpService.post(url,data).then(function(response){
				console.log("response come from token=",response);
				if(response.data!=undefined)
				{
					$cookies.put("userToken",toParams.token);
					console.log("inner vvalue response come from token=",response);
					var userInfo=response.data.profile;
					loginService.isLoggedIn=true;
					$window.sessionStorage.setItem("isLoggedIn",true);
					$window.sessionStorage.setItem("userInfo",JSON.stringify(userInfo));
					$window.sessionStorage.setItem("userId",userInfo._key);
					$window.localStorage.setItem("userInfo",JSON.stringify(userInfo));
					$window.location.reload();
				}
				else{
					$window.location.href=$rootScope.homeurl;
				}
			},function(reason){

			});

		}




		if(value=="true")
			loginService.isLoggedIn=true;
		else if(loginService.isLoggedIn==true)
		{
		}
		else if(toParams.token!=undefined){
			event.preventDefault();
			
			if($window.localStorage.getItem("key")==null||$window.localStorage.getItem("token")==null){
				event.preventDefault();
				registerDevice.register().then(function(response){
					var data=dcryptionFactory.decryptwithoutbase64(response.data,$rootScope.key);
					$window.localStorage.setItem("key",data.data.credentials.key);
					$window.localStorage.setItem("token",data.data.credentials.token);
					getUserInfo(toParams);
				},function(reason){

					
				});
			}
			else{
				getUserInfo(toParams);
			}

		}
		else
		{
			$window.location.href=$rootScope.homeurl;
		}
	});

	$rootScope
	.$on('$stateChangeSuccess',
		function(event, toState, toParams, fromState, fromParams){ 
			$window.scrollTo(0, 0);
			$rootScope.$on('$routeChangeSuccess',()=>$uibModalStack.dismissAll());
		});


});

app.service("loginService",function($http,$q,$window,dcryptionFactory){
	var obj={};
	obj.isLoggedIn=false;
	obj.userName="";
	obj.userId="";
	return obj;
});

app.config(['ADMdtpProvider', function(ADMdtp) {
	ADMdtp.setOptions({
		calType: 'gregorian',
		format: 'DD/MM/YYYY',
		autoClose:true
	});
}]);

app.run(['$rootScope', '$location', function($rootScope, $location){

	var path = function() { return $location.path();};
	$rootScope.$watch(path, function(newVal, oldVal){
		$rootScope.activetab=newVal;
	});
}]);

app.config(
	function($provide, $httpProvider) {
		$httpProvider.interceptors.push('LoadingInterceptor');
	});




app.service('LoadingInterceptor', ['$q','dcryptionFactory' ,'$rootScope', '$log','$window','$location', 
	function ($q,dcryptionFactory, $rootScope, $log,$window,$location) {
		'use strict';

		var xhrCreations = 0;
		var xhrResolutions = 0;

		function isLoading() {
			console.log("xhrResolutions",xhrResolutions,xhrCreations);
			return xhrResolutions < xhrCreations;

		}

		function updateStatus(url) {
			var array=["/uploadfile","/bookmark","availability","alerts","&target=message","sendChatMessage.html","receiveChatMessage.html"];
			array.forEach(function(value){
				var regex=new RegExp("\\b("+value+")\\b","gi");
				if(regex.test(url)==true){
					xhrCreations--;
				}
			});
			$rootScope.loading=isLoading();
		}

		return {
			request: function (config) {
				xhrCreations++;
				updateStatus(config.url);
				if($window.localStorage.getItem("token")!=null){
					config.headers.authorization=$window.localStorage.getItem("token");
				}
				
				else{
					$location.replace('/');
				}
				return config;
			},
			requestError: function (rejection) {
				console.log("request error");
				xhrResolutions++;
				updateStatus();
				console.log("request error occured during");
				$log.error('Request error:', rejection);
				return $q.reject(rejection);
			},
			response: function (response){
				xhrResolutions++;
				updateStatus();

				if(response.config.url.toLowerCase().indexOf("goparties.com")>=0){
					if(response.data.error!=undefined){
						if(response.data.error.code=="401")
							$location.replace('/');

					}
					if((response.config.url.toLowerCase().indexOf("registerdevice")<=0)&&(response.config.url.toLowerCase().indexOf("goparties.com")>=0)){
						response.data=dcryptionFactory.decrypt(response.data,$window.localStorage.getItem("key"));	
					}
					
					//response.data=$window.decrypt(response.data,$window.localStorage.getItem("key"));	
				}
				
				
				return response;
			},
			responseError: function (rejection) {
				xhrResolutions++;
				updateStatus();
				console.log("response error occured during");
				//$log.error('Response error:', rejection);
				return $q.reject(rejection);
			}
		};
	}]);

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
		var defer=$q.defer();
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



app.factory("dcryptionFactory",function($window,Base64){
	var obj={};

	function b64DecodeUnicode(str) {
		return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
	}


	obj.decrypt=function(data,key){
		var output="";
		newkey=Base64.decode(key);
		var input =b64DecodeUnicode(data);
		for(var i=0;i<input.length;i++){
			var c = input.charCodeAt(i);
			var k = newkey.charCodeAt(i%newkey.length);

			output += String.fromCharCode(c ^ k);
		}
		debugger;
		return JSON.parse(output);
		
	}
	obj.decryptwithoutbase64=function(data,key){
		var input =Base64.decode(data);
		var output="";

		for(var i=0;i<input.length;i++){
			var c = input.charCodeAt(i);
			var k = key.charCodeAt(i%key.length);

			output += String.fromCharCode(c ^ k);
		}
		debugger;
		return JSON.parse(output);
		
	}
	return obj;
});




app.factory('Base64', function() {

    // private property
    var _keyStr='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=?';

    // private method for UTF-8 encoding
    var _utf8_encode = function(string) {
    	string = string.replace(/\r\n/g, '\n');
    	var utftext = '';

    	for (var n = 0; n < string.length; n += 1) {

    		var c = string.charCodeAt(n);

    		if (c < 128) {
    			utftext += String.fromCharCode(c);
    		} else if ((c > 127) && (c < 2048)) {
    			utftext += String.fromCharCode((c >> 6) | 192);
    			utftext += String.fromCharCode((c & 63) | 128);
    		} else {
    			utftext += String.fromCharCode((c >> 12) | 224);
    			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
    			utftext += String.fromCharCode((c & 63) | 128);
    		}

    	}

    	return utftext;
    };

    // private method for UTF-8 decoding
    var _utf8_decode = function(utftext) {
    	var string = '';
    	var i = 0;
    	var c = 0;
    	var c1 = 0;
    	var c2 = 0;
    	var c3;

    	while (i < utftext.length) {

    		c = utftext.charCodeAt(i);

    		if (c < 128) {
    			string += String.fromCharCode(c);
    			i += 1;
    		} else if ((c > 191) && (c < 224)) {
    			c2 = utftext.charCodeAt(i + 1);
    			string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
    			i += 2;
    		} else {
    			c2 = utftext.charCodeAt(i + 1);
    			c3 = utftext.charCodeAt(i + 2);
    			string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
    			i += 3;
    		}

    	}

    	return string;
    };

    return {
        // public method for encoding
        encode: function(input) {
        	var output = '';
        	var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        	var i = 0;

        	input = _utf8_encode(input);

        	while (i < input.length) {

        		chr1 = input.charCodeAt(i += 1);
        		chr2 = input.charCodeAt(i += 1);
        		chr3 = input.charCodeAt(i += 1);

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
        		_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        		_keyStr.charAt(enc3) + _keyStr.charAt(enc4);

        	}

        	return output;
        },

        // public method for decoding
        decode: function(input) {
        	var output = '';
        	var chr1, chr2, chr3;
        	var enc1, enc2, enc3, enc4;
        	var i = 0;

        	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

        	while (i < input.length) {

        		/* jshint ignore:start */

        		enc1 = _keyStr.indexOf(input.charAt(i++));
        		enc2 = _keyStr.indexOf(input.charAt(i++));
        		enc3 = _keyStr.indexOf(input.charAt(i++));
        		enc4 = _keyStr.indexOf(input.charAt(i++));

        		/* jshint ignore:end */

        		chr1 = (enc1 << 2) | (enc2 >> 4);
        		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        		chr3 = ((enc3 & 3) << 6) | enc4;

        		output = output + String.fromCharCode(chr1);


        		if (enc3 !== 64) {
        			output = output + String.fromCharCode(chr2);
        		}
        		if (enc4 !== 64) {
        			output = output + String.fromCharCode(chr3);
        		}

        	}

        	output = _utf8_decode(output);

        	return output;
        }
    };
})


app.factory("registerDevice",function($http,$q,$window,$rootScope){
	var obj={};
	obj.isCall=false;
	obj.register=function(){
		var defer=$q.defer();
		var url;
		var key=$rootScope.key;
		url=$rootScope.apiBaseUrl+"/registerdevice";
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
