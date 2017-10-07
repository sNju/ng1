var app=angular.module('main.module', ["ui.router","ngToast","filter.module","ngMaterial","common.module","home.module",
	"oc.lazyLoad","ngAnimate","service.module"]);
app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/");
	$stateProvider.state("/",{ 
		url:"/",
		templateUrl:"./html/home/body.html",
		controller:"homeController"
	})
	.state("mainsearch",{
		url:"/search",
		templateUrl:"html/search.html",
		controller:"searchController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["css/search.css","libcss/ADM-dateTimePicker.min.css",
				"libjs/ADM-dateTimePicker.min.js","controller/searchController.js"]
			})
		}]
	}).state("login",{
		url:"/login",
		templateUrl:"html/login.html",
		controller:"loginController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["css/signup-page.css", "controller/loginController.js"]
			})
		}]
	}).state("claimprofiles",{  
		url:"/claimprofiles",
		templateUrl:"html/claimprofiletype.html",
		controller:"claimprofiletypeController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["css/claimprofiletype.css", "controller/claimprofiletypeController.js"]
			})
		}]
	}).state("contact",{  
		url:"/contactUs",
		templateUrl:"html/contact.html",
		controller:"contactusController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["css/static-pages.css", "controller/contactusController.js"]

			})
		}]
	}).state("sendfeedback",{  
		url:"/sendfeedback",
		templateUrl:"html/sendfeedback.html",
		controller:"feedbackController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["css/static-pages.css", "controller/sendfeedbackController.js"]
			})
		}]
	}).state("faq",{
		url:"/faq",
		templateUrl:"html/faq.html",
		controller:"faqController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["css/static-pages.css", "controller/faqController.js"]
			})
		}]
	}).state("privacyPolicy",{
		url:"/privacyPolicy",
		templateUrl:"html/privacyPolicy.html",
		controller:"privacyPolicyController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["css/static-pages.css", "controller/privacyPolicyController.js"]
			})
		}]
	}).state("tnc",{
		url:"/tnc",
		templateUrl:"html/tnc.html",
		controller:"tncController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["css/static-pages.css", "controller/tncController.js"]
			})
		}]
	}).state("blog",{
		url:"/blog",
		templateUrl:"html/blog.html",
		controller:"blogController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["css/blog.css","controller/blogController.js"]
			})
		}]
	}).state("blogdetail",{
		url:"/blogdetail",
		templateUrl:"html/blogdetail.html",
		controller:"blogdetailController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["css/blog-inner.css", "css/slick.css","controller/blogdetailController.js"]
			})
		}]
	}).state("business",{
		url:"/business",
		templateUrl:"html/businesshtml/baparent.html",
		resolve:{
			loadFiles:["$ocLazyLoad",function($ocLazyLoad){
				return $ocLazyLoad.load({
					cache:true,
					files:["css/claim-listing.css", "controller/businessController/baDirective.js",
					"controller/claimListing/searchController.js"]
				})
			}]
		}
	}).state("search",{
		url:"/claimsearch",
		parent:"business",
		templateUrl:"./html/claimYourListing/search.html",
		controller:"searchController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["controller/claimListing/searchController.js"]
			})
		}]
	})
	.state("verifyprofile",{
		url:"/verify/:id",
		parent:"business",
		templateUrl:"./html/claimYourListing/verify-profile.html",
		controller:"verifyProfileController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["controller/claimListing/verifyProfileController.js"]
			})
		}]
	}).state("artist",{
		url:"/artist",
		parent:"business",
		templateUrl:"html/businesshtml/artist.html",
		controller:"artistController",
		resolve:{
			loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
				return $ocLazyLoad.load({
					cache:true,
					files:["controller/businessController/artistController.js"]
				})
			}]
		}
	}).state("band",{
		url:"/band",
		parent:"business",
		templateUrl:"html/businesshtml/band.html",
		controller:"bandController",
		resolve:{
			loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
				return $ocLazyLoad.load({
					cache:true,
					files:["controller/businessController/bandController.js"]
				})
			}]
		}
	}).state("dj",{
		url:"/dj",
		parent:"business",
		templateUrl:"html/businesshtml/dj.html",
		controller:"djController",
		resolve:{
			loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
				return $ocLazyLoad.load({
					cache:true,
					files:["controller/businessController/djController.js"]
				})
			}]
		}
	}).state("concerts",{
		url:"/concerts",
		parent:"business",
		templateUrl:"html/businesshtml/concerts.html",
		controller:"concertsController",
		resolve:{
			loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
				return $ocLazyLoad.load({
					cache:true,
					files:["controller/businessController/concertsController.js"]
				})
			}]
		}
	}).state("partyspot",{
		url:"/partyspot",
		parent:"business",
		templateUrl:"html/businesshtml/partyspot.html",
		controller:"partyspotController",
		resolve:{
			loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
				return $ocLazyLoad.load({
					cache:true,
					files:["controller/businessController/partyspotController.js"]
				})
			}]
		}
	}).state("checkstatus",{
		url:"/checkStatus",
		parent:"business",
		templateUrl:"html/businesshtml/checkStatus.html",
		controller:"checkstatusController",
		resolve:{
			loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
				return $ocLazyLoad.load({
					cache:true,
					files:["controller/businessController/checkstatusController.js"]
				})
			}]
		}
	}).state("ios",{
		url:"/ios",
		templateUrl:"html/ios.html",
	}).state("android",{
		url:"/android",
		templateUrl:"html/android.html",
	}).state("profileDetail",{
		url:"/profile/:profileId",
		templateUrl:"html/profile/newprofiledetail.html",
		controller:"newprofileController",
		resolve:{
			loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
				return $ocLazyLoad.load({
					cache:true,
					serie:true,
					files:[
					"css/profile-detail.css",
					"controller/newprofileController.js"]
				});
			}]
		}
	//}).state("profileDetail",{
	// 	url:"/profile/:profileId",
	// 	templateUrl:"html/profile/profiledetail.html",
	// 	controller:"profileController",
	// 	resolve:{
	// 		loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
	// 			return $ocLazyLoad.load({
	// 				cache:true,
	// 				serie:true,
	// 				files:["controller/profileController.js"]
	// 			});
	// 		}]
	// 	}
	// }).state("profileDetail.live",{
	// 	url:"/live",
	// 	parent:"profileDetail",
	// 	templateUrl:"html/profile/profiledetail.live.html"
	// }).state("profileDetail.past",{
	// 	url:"/past",
	// 	parent:"profileDetail",
	// 	templateUrl:"html/profile/profiledetail.past.html"
	// }).state("profileDetail.works",{
	// 	url:"/works",
	// 	parent:"profileDetail",
	// 	templateUrl:"html/profile/profiledetail.works.html"
	// }).state("profileDetail.crowdquotient",{
	// 	url:"/crowdquotient",
	// 	parent:"profileDetail",
	// 	templateUrl:"html/profile/crowdquotient.html"
	// }).state("profileDetail.socialbuzz",{
	// 	url:"/socialbuzz",
	// 	parent:"profileDetail",
	// 	templateUrl:"html/profile/socialbuzz.html"
// }).state("partydetail",{
// 	url:"/party/:id",
// 	templateUrl:"html/party/partydetail.html",
// 	controller:"partyDetailController",
// 	resolve:{
// 		loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
// 			return $ocLazyLoad.load({
// 				cache:true,
// 				files:["controller/partyDetailController.js"]
// 			});
// 		}]
// 	}
}).state("partydetail",{
	url:"/party/:id",
	templateUrl:"html/party/newpartydetail.html",
	controller:"newpartydetailcontroller",
	resolve:{
		loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["css/party-detail.css", "controller/newpartydetailcontroller.js"]
			});
		}]
	}
}).state("myprofile",{
	url:"/myprofile",
	templateUrl:"html/profile/myprofile.html",
	controller:"myprofileController",
	resolve:{
		loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["css/myprofile.css", "controller/myprofilecontroller.js"]
			});
		}]
	}
}).state("dealdetail",{
	url:"/deal/:id",
	templateUrl:"html/deal/dealdetail.html",
	controller:"dealDetailController",
	resolve:{
		loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["controller/dealDetailController.js"]
			});
		}]
	}
});
});

app.config(
	function($provide, $httpProvider,$locationProvider) {
		// $locationProvider.html5Mode(true);
		// 	//requireBase: true);
		// $httpProvider.interceptors.push('loginInterceptor');
		
	});





app.run(['$rootScope','$q','$stateParams','$location','registerDevice','$window','descryptFactory','$state',
	function($rootScope,$q,$stateParams,$location,registerDevice,$window,descryptFactory,$state){
		$rootScope.apiBaseUrl="https://api.goparties.com";
		$rootScope.key="goparties";
		$rootScope.childloading=false;
		$rootScope.cssname="home";
		var path = function() { return $location.path();};
		$rootScope.$watch(path, function(newVal, oldVal){
			$rootScope.activetab=newVal.split('/')[1];
		});

		$rootScope.$on("$stateChangeStart",function(event,toState,toParams){
			if($window.localStorage.getItem("key")==null||$window.localStorage.getItem("token")==null){
				event.preventDefault();
				registerDevice.register().then(function(response){
					var data=descryptFactory.decryptwithoutbase64(response.data,$rootScope.key);
					$window.localStorage.setItem("key",data.data.credentials.key);
					$window.localStorage.setItem("token",data.data.credentials.token);
					$window.location.reload();
				},function(reason){

					
				});
			}
			

			

		});

		$rootScope
		.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams){ 
				$window.scrollTo(0, 0);
			});

		var path=function(){return $location.path();}
		$rootScope.$watch(path,function(newval,oldval){
			var array=newval.split("/");
			$rootScope.activetab=array[array.length-1];
		});


	}]);



app.factory("authenticationService",function(){
	var obj=new Object();
	obj.islogin=false;
	obj.userinfo={};
	return obj;
});



app.service("loginInterceptor",["$q","descryptFactory","$window","$location","$rootScope",
	function($q,descryptFactory,$window,$location,$rootScope){
		$rootScope.loading=true;
		var xhrCreation=0;
		var xhrResolution=0;
		function isLoading() {
			return xhrResolution < xhrCreation;
		}

		function updateStatus(url) {
			var array=["claimsearch","/search","/feed","gpprofilecard.html","gppartycard.html","gpdealcard.html","directive/auth/"];
			var check=false;
			var isfind=[];

			if(url!=undefined){
				isfind=array.filter(function(obj){
					return url.toLowerCase().indexOf(obj.toLowerCase())>=0
				});
			}
			
			check=isfind.length>0;
			if(check==true)
			{
				$rootScope.loading=false;
			}
			else{
				$rootScope.loading=isLoading();	
			}
			
		}
		return{
			request:function(config){
				xhrCreation++;
				updateStatus(config.url);
				if($window.localStorage.getItem("token")!=null){
					config.headers.authorization=$window.localStorage.getItem("token");
				}
				
				else{
					$location.replace('/');
				}
				return config;
			},
			requestError:function(rejection){
				console.log("response of",rejection);
				xhrResolution++;
				updateStatus();
				$q.reject(rejection);
			},
			response:function(response){
				xhrResolution++;
				updateStatus(response.config.url);
				if((response.config.url.toLowerCase().indexOf("registerdevice")<=0)&&(response.config.url.toLowerCase().indexOf("goparties.com")>=0)){
					response.data=descryptFactory.decrypt(response.data,$window.localStorage.getItem("key"));	
				}
				return response;
				//
			},
			responseError:function(rejection){
				xhrResolution++;
				updateStatus();
				$q.reject(rejection);
			}
		}
	}]);

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


app.factory("descryptFactory",function($window,Base64){
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


app.factory('Base64', function () {
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




app.directive("footerPage",function($rootScope,httpService,ngToast){
	return{
		restrict:'EA',
		scope:true,
		replace:true,
		link:function($scope,$attr,$element,controller,transclude){
			$scope.init=function(){
				$scope.obj={};
				$scope.isSubmit=false;
			}

			$rootScope.$on('$stateChangeSuccess',function(){
				$scope.mytemplate="directive/footer.html";
			});
			
			$scope.init();
			$scope.submit=function(data,isValid){
				if(isValid==true){
					var url=$rootScope.apiBaseUrl;
					url+="/newsletter";
					httpService.post(url,data).then(function(response){
						if(response.data!=undefined){
							ngToast.create("Successfully Subscribe");
							$scope.init();
						}
						else
							ngToast.create({
								className:"warning",
								content:"Something went wrong"
							});
					},function(reason){
						ngToast.create({
							className:"warning",
							content:"Something went wrong"
						});
					});

				}
				else{
					$scope.isSubmit=true;
				}
			}
			
		},
		template:'<div ng-include="mytemplate"></div>',
	}
});

app.directive('a', function() {
	return {
		restrict: 'E',
		link: function(scope, elem, attrs) {
			if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
				elem.on('click', function(e){
					e.preventDefault();
				});
			}
		}
	};
});


