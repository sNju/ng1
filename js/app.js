var app=angular.module('main.module', ["ui.router","ngToast","filter.module","ngMaterial","common.module","home.module",
	"oc.lazyLoad","ngAnimate","service.module"]);

// Set limit for ngToast display and its timeout
app.config(['ngToastProvider', function(ngToast) {
	ngToast.configure({
		maxNumber: 1,
		timeout:1500,
		animation: 'fade'
	});
}]);


app.controller('parentController', ['$scope','$rootScope','$window','$location','authenticationService','$httpParamSerializer',
	function($scope,$rootScope,$window,$location,authenticationService,$httpParamSerializer){

//this function is use for homepage link generate for entire web application
(function(){
	var url=$window.homepagelink;
	if(url!=undefined){
		url="/"+url.split("/").slice(1,url.length).join('/');
		$rootScope.homepagelink=url;
	}
	$rootScope.homepagelink=$rootScope.homepagelink==undefined?"/":$rootScope.homepagelink;
})();



$rootScope.getGpUrl = function(obj){
	if(obj!=undefined && Object.keys(obj).length>0 && (obj.gpurl || obj._id)){
		var url = obj.gpurl==undefined?obj._id:obj.gpurl;
		
		if(obj.gpurl==undefined && obj.profile_type!=undefined){
			return (obj.profile_type.toLowerCase()+"/"+obj._key).replace(/ /g,"");
		}

		else if(url!=undefined&&url[0]!='/')
			return '/'+url;
		
		return url;
	}
	return "/";
};

$rootScope.redirectWithScroll=function(obj){
	var url=$rootScope.getGpUrl(obj);
	url+="?scroll=true";
	$location.url(url);
}



$rootScope.$on("childloading",function(event,value){
	$rootScope.childloading=value;
});

$rootScope.$on("userinfo",function(event,userinfo){
	debugger;
	console.log("userinfo",userinfo);
	$rootScope.userinfo=$rootScope.userinfo==undefined?{}:$rootScope.userinfo;
	Object.assign($rootScope.userinfo,userinfo);
	authenticationService.islogin=true;
	authenticationService.userinfo=$rootScope.userinfo;
	$rootScope.islogin=true;
	$window.sessionStorage.setItem("isLoggedIn",true);
	$window.sessionStorage.setItem("userinfo",JSON.stringify($rootScope.userinfo));
	$window.sessionStorage.setItem("userId",$rootScope.userinfo._key);
	$window.localStorage.setItem("userinfo",JSON.stringify($rootScope.userinfo));
	
});


$scope.logout=function(){
	$rootScope.$emit("islogin",false);
	$rootScope.$emit("userinfo",'');
	$window.sessionStorage.clear();
	$window.localStorage.removeItem("userinfo");
	$window.location.reload();
}

$rootScope.$on("logout",function($event){
	$scope.logout();
});



$rootScope.$on("islogin",function(event,value){
	$rootScope.islogin=value;
});

$rootScope.$on("loadmore",function(event,value){
	$rootScope.loadmore=value;
});

$rootScope.$on("loading",function(event,value){
	$rootScope.loading=value;
});

		// not changing the title for the first time as it is set by PHP
		var titlecount=undefined;
		$scope.$on("TitlePage",function($event,title){
			titlecount = titlecount!=undefined?document.title=title:1;
		});


		$rootScope.paginationcount=10;



		$scope.searchdata=function(keyword){
			var obj=$location.search();
			obj.since=0;
			obj.limit=$rootScope.paginationcount;
			if(keyword!=undefined){
				obj.keyword=keyword;
			}
			if(obj.sort==undefined){
				obj.sort='r';
			}
			var path="search?"+$httpParamSerializer(obj);
			$location.url(path);
		}

		$scope.next=function(obj,length){
			debugger;
			$rootScope.$emit("loadmore",true);//this is for load more prloader
			var object=$location.search();
			if(length!=undefined){
				object.since=length;
			}
			else if(object.since!=undefined){
				object.since=parseInt(object.since)+$rootScope.paginationcount;
			}
			else{
				object.since=0;
			}

			if(object.limit!=undefined){
				object.limit=$rootScope.paginationcount;
			}
			else{
				object.limit=0;
			}
			var path=$location.path();
			path+="?"+$httpParamSerializer(object);
			$location.url(path);
		}


		$scope.redirect=function(url){
			$location.url(url);
		}


	}])

app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/");
	$stateProvider.state("mainsearch",{
		url:"/search?params",
		templateUrl:"html/search.html",
		controller:"searchController",
		resolve:["$ocLazyLoad",function($ocLazyLoad,$rootScope){
			return $ocLazyLoad.load({
				cache:false,
				files:["css/rdsearch.css","controller/searchController.js"],

			})
		}],
	}).state("myprofile",{
		url:"/myprofile",
		templateUrl:"html/profile/myprofile.html",
		controller:"myprofileController",
		resolve:{
			loadCtrl:["$ocLazyLoad","$rootScope",function($ocLazyLoad,$rootScope){
				//$rootScope.pageTitle="Profile - GoParties";
				return $ocLazyLoad.load({
					cache:false,
					files:["css/myprofile.css", "controller/myprofilecontroller.js"]
				});
			}]
		}
	})

// Test Onboard
.state("onboard",{
	url:"/onboard",
	templateUrl:"html/onboard.html",
	resolve:["$ocLazyLoad","$rootScope",function($ocLazyLoad,$rootScope){
		//$rootScope.pageTitle="OnBoard -GoParties Your Party App";
		return $ocLazyLoad.load({
			cache:false,
			files:["css/onboard.css"]

		})
	}],

})

//Test onboard ends
.state("login",{
	url:"/login",
	templateUrl:"html/login.html",
	controller:"loginController",
	resolve:["$ocLazyLoad",function($ocLazyLoad,$rootScope){
		//$rootScope.pageTitle="Login - GoParties Your Party App";
		return $ocLazyLoad.load({
			cache:false,
			files:["css/signup-page.css", "controller/loginController.js"]
		})
	}]
}).state("claimprofiles",{
	url:"/claimprofiles",
	templateUrl:"html/claimprofiletype.html",
	controller:"claimprofiletypeController",
	resolve:["$ocLazyLoad","$rootScope",function($ocLazyLoad,$rootScope){
		//$rootScope.pageTitle="Profile - GoParties Your Party App";
		return $ocLazyLoad.load({
			cache:false,
			files:["css/claimprofiletype.css", "controller/claimprofiletypeController.js"]
		})
	}]
}).state("contact",{
	url:"/contactUs",
	templateUrl:"html/contact.html",
	controller:"contactusController",
	resolve:["$ocLazyLoad","$rootScope",function($ocLazyLoad,$rootScope){
		//$rootScope.pageTitle="Contact Us - GoParties Your Party App";
		return $ocLazyLoad.load({
			cache:false,
			files:["css/static-pages.css", "controller/contactusController.js"]

		})
	}]
}).state("sendfeedback",{
	url:"/sendfeedback",
	templateUrl:"html/sendfeedback.html",
	controller:"feedbackController",
	resolve:["$ocLazyLoad",function($ocLazyLoad,$rootScope){
		//$rootScope.pageTitle="Feedbacks - GoParties Your Party App";
		return $ocLazyLoad.load({
			cache:false,
			files:["css/static-pages.css", "controller/sendfeedbackController.js"]
		})
	}]
}).state("faq",{
	url:"/faq",
	templateUrl:"html/faq.html",
	controller:"faqController",
	resolve:["$ocLazyLoad",function($ocLazyLoad,$rootScope){
		//$rootScope.pageTitle="FAQs - GoParties Your Party App";
		return $ocLazyLoad.load({
			cache:false,
			files:["css/static-pages.css", "controller/faqController.js"]
		})
	}]
}).state("privacyPolicy",{
	url:"/privacyPolicy",
	templateUrl:"html/privacyPolicy.html",
	controller:"privacyPolicyController",
	resolve:["$ocLazyLoad",function($ocLazyLoad,$rootScope){
		//$rootScope.pageTitle="Privacy Policy - GoParties Your Party App";
		return $ocLazyLoad.load({
			cache:false,
			files:["css/static-pages.css", "controller/privacyPolicyController.js"]
		})
	}]
}).state("tnc",{
	url:"/tnc",
	templateUrl:"html/tnc.html",
	controller:"tncController",
	resolve:["$ocLazyLoad",function($ocLazyLoad,$rootScope){
		//$rootScope.pageTitle="Terms & Conditions - GoParties Your Party App";
		return $ocLazyLoad.load({
			cache:false,
			files:["css/static-pages.css", "controller/tncController.js"]
		})
	}]
}).state("blogs",{
	url:"/blog",
	templateUrl:"html/blog.html",
	controller:"blogController",
	resolve:["$ocLazyLoad",function($ocLazyLoad,$rootScope){
		//$rootScope.pageTitle="Blog - GoParties Your Party App";
		return $ocLazyLoad.load({
			cache:false,
			files:["css/blog.css","controller/blogController.js"]
		})
	}]
}).state("blog",{
	url:"/blog/:id",
	templateUrl:"html/blogdetail.html",
	controller:"blogdetailController",
	resolve:["$ocLazyLoad",function($ocLazyLoad){
		return $ocLazyLoad.load({
			cache:false,
			files:["css/blog-inner.css", "css/slick.css","controller/blogdetailController.js"]
		})
	}]
}).state("business",{
	url:"/business",
	templateUrl:"html/businesshtml/baparent.html",
	resolve:{
		loadFiles:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:false,
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
			cache:false,
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
			cache:false,
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
				cache:false,
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
				cache:false,
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
				cache:false,
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
				cache:false,
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
				cache:false,
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
				cache:false,
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
	// }).state("profileDetail",{
	// 	url:"/profile/:profileId",
	// 	templateUrl:"html/profile/newprofiledetail.html",
	// 	controller:"newprofileController",
	// 	resolve:{
	// 		loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
	// 			return $ocLazyLoad.load({
	// 				cache:false,
	// 				serie:true,
	// 				files:[
	// 				"css/profile-detail.css",
	// 				"controller/newprofileController.js"]
	// 			});
	// 		}]
	// 	}
}).state("order",{
	url:"/order/:id",
	templateUrl:"html/miscellaneous/orderdetail.html",
	controller:"orderdetailController",
	resolve:{
		loadCtrl:["$ocLazyLoad",function($ocLazyLoad,$rootScope){
			//$rootScope.pageTitle="Orders - GoParties Your Party App";
			return $ocLazyLoad.load({
				cache:false,
				files:["css/orderid.css",
				"//monospaced.github.io/bower-qrcode-generator/js/qrcode.js",
				"libjs/angular-qrcode.js",
				"controller/miscellaneous/orderdetailController.js"]
			});
		}]
	}
}).state("dealdetail",{
	url:"/deal/:id",
	templateUrl:"html/deal/dealdetail.html",
	controller:"dealDetailController",
	resolve:{
		loadCtrl:["$ocLazyLoad",function($ocLazyLoad,$rootScope){
			//$rootScope.pageTitle="Deals -GoParties Your Party App";
			return $ocLazyLoad.load({
				cache:false,
				files:["controller/dealDetailController.js"]
			});
		}]
	}
})
/*Client Details*/
.state("welcome",{
	url:"/welcome/:token",
	templateUrl:"html/client-details.html",
	controller:"clientdetailsController",
	resolve:["$ocLazyLoad",function($ocLazyLoad,$rootScope){
		return $ocLazyLoad.load({
			cache:true,
			files:["js/ng-file-upload.js","controller/moduleCommonController.js","controller/clientdetailsController.js", "css/client-panel.css",]
		})
	}]
})
/*404 Error*/
.state("pagenotfound",{
	url:"/404error",
	templateUrl:"html/404error.html",	
	resolve:["$ocLazyLoad",function($ocLazyLoad,$rootScope){		
		return $ocLazyLoad.load({
			cache:false,
			files:["css/common.css"]
		})
	}]		
})


/*career page*/
.state("career",{
	url:"/career",
	templateUrl:"html/career.html",
	resolve:["$ocLazyLoad",function($ocLazyLoad,$rootScope){
		return $ocLazyLoad.load({
			cache:false,
			files:["css/career.css"]
		})
	}]
})

.state("partydetail",{
	url:"{myPath1:[a-zA-Z0-9.!@?#$%&:';()*\+,\/;\-=[\\\]\^_{|}<>~`-]*}/{mypath2:[(party)]+}/{id:[^]*}",
	templateUrl:"html/party/partydetail.html",
	controller:"partydetailController",
	resolve:{
		loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:false,
				files:[ "css/rd-party.css",
				"controller/profilepartyDirective.js",
				"controller/partydetailController.js"]
			});
		}]
	}
})

.state("artistProfile",{
	url:"{myPath1:[a-zA-Z0-9.!@?#$%&:';()*\+,\/;\-=[\\\]\^_{|}<>~`-]*}/{mypath2:[(dj)|(artist)(band)]+}/{id:[a-zA-Z0-9.!@?#$%&:';()*\+,\/;\-=[\\\]\^_{|}<>~`-]*}",
	templateUrl:"html/profile/performer.html",
	controller:"performerController",
	resolve:{
		loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:false,
				serie:true,
				files:["css/artist-profile.css",
				"controller/performerController.js"]
			});
		}]
	}})
.state("profileDetail",{
	url:"{myPath1:[a-zA-Z0-9.!@?#$%&:';()*\+,\/;\-=[\\\]\^_{|}<>~`-]*}/{mypath2:[(profile)|(partyspot)|(Partymon)]+}/{id:[^]*}",
	templateUrl:"html/profile/profiledetail.html",
	controller:"profiledetailController",
	resolve:{
		loadCtrl:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:false,
				serie:true,
				files:[
				"css/rd-profile.css",
				"controller/profilepartyDirective.js",
				"controller/profiledetailController.js"]
			});
		}]
	}})

.state("bookingHistory",{
	url:"/bookinghistory",
	templateUrl:"html/bookingHistory.html",	
	controller:"bookingHistoryController",	
	resolve:["$ocLazyLoad",function($ocLazyLoad){
		return $ocLazyLoad.load({
			cache:false,
			files:[
			"css/orderid.css",
			"controller/bookingHistoryController.js"]
		})
	}]
})

.state("myAccount",{
	url:"/my-account",
	templateUrl:"html/myAccount.html",
	controller:"myAccountController1",
	resolve:["$ocLazyLoad",function($ocLazyLoad){
		return $ocLazyLoad.load({
			cache:false,
			files:["css/my-account.css",
			"js/ng-file-upload.js",
			"controller/myAccountController.js"]
		})
	}]
})

.state("/",{
	reloadOnSearch: false,
	url:"/{homepath:[a-zA-Z0-9.!@?#$%&:';()*\+,;\/\-=[\\\]\^_{|}<>~`-]*}",
	templateUrl:"./html/home/body.html",
	controller:"homeController"
})




});

app.config(
	function($provide, $httpProvider,$locationProvider) {
		$httpProvider.interceptors.push('loginInterceptor');
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	});

//check internet connection weather it is online off line
app.run(function($window, $rootScope,$location) {
	$rootScope.online = navigator.onLine;
	$window.addEventListener("offline", function() {
		$rootScope.$apply(function() {
			$rootScope.online = false;
		});
	}, false);

	$window.addEventListener("online", function() {
		$rootScope.$apply(function() {
			$rootScope.online = true;
		});
	}, false);




});




app.run(['$rootScope','$q','$stateParams','$location','registerDevice','$window','descryptFactory','$state',
	function($rootScope,$q,$stateParams,$location,registerDevice,$window,descryptFactory,$state){
		var url=$window.location.href;

		if(url.indexOf("goparties.com")>=0 && url.indexOf("testing")<0){
			$rootScope.apiBaseUrl="https://api.goparties.com";
		} else if(url.indexOf("staging")>=0){
			$rootScope.apiBaseUrl="http://staging.goparties.com:1234";
			//$rootScope.apiBaseUrl="http://testing.goparties.com";
		} else {
			$rootScope.apiBaseUrl="http://testing.goparties.com";
			//$rootScope.apiBaseUrl="http://staging.goparties.com:1234";
			//$rootScope.apiBaseUrl="http://localhost:1234";
		}
		$rootScope.webAddress="https://www.goparties.com";
		$rootScope.devapiBaseUrl=$rootScope.apiBaseUrl;//"https://api.goparties.com";
		$rootScope.key="goparties";
		$rootScope.childloading=false;
		$rootScope.loadmore=false;
		$rootScope.islogin=false;
		$rootScope.cssname="home";
		$rootScope.scroll={};
		var path = function() { return $location.path();};
		$rootScope.$watch(path, function(newVal, oldVal){
			$rootScope.activetab=newVal.split('/')[1];
		});



		//console.log("$rootScope.userinfo",$rootScope.userinfo);
		$rootScope.$on("$stateChangeStart",function(event,toState,toParams){
			$rootScope.prevurl=$location.path().indexOf("login")<0?$location.path():$rootScope.prevurl;
			if($window.localStorage.getItem("key")==null||$window.localStorage.getItem("token")==null){
				debugger;
				event.preventDefault();
				registerDevice.register().then(function(response){
					var data=descryptFactory.decryptwithoutbase64(response.data,$rootScope.key);
					$window.localStorage.setItem("key",data.data.credentials.key);
					$window.localStorage.setItem("token",data.data.credentials.token);
					$window.location.reload();
				},function(reason){


				});

			}

			if($rootScope.islogin!=true&&$window.localStorage.getItem("userinfo")!=null){
				$rootScope.userinfo=JSON.parse($window.localStorage.getItem("userinfo"));
				$rootScope.islogin=true;
			}
			else if($rootScope.islogin==true&&$window.localStorage.getItem("userinfo")==null){
				$rootScope.$emit("logout");
			}

			//this functionality is use if unauthentic user try to access authentic page then not allowed
			var loginpath=["/bookinghistory","/my-account"];
			if(loginpath.indexOf($location.path())>=0 && !$rootScope.islogin){
				$location.path("/delhi-ncr");
			}

		});

		$rootScope
		.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams){
				var x=0,y=0;
				if($rootScope.scroll[$location.url()]!=undefined){
					x=$rootScope.scroll[$location.url()].x;
					y=$rootScope.scroll[$location.url()].y;
				}
				$rootScope.keyword=$location.path().indexOf("search")>=0?$rootScope.keyword:"";
				if($location.path().indexOf("login")>=0&&$window.localStorage.getItem("userinfo")!=null)
				{
					$location.url("/");
				}
				$window.scrollTo(x, y);
			});

		var path=function(){return $location.path();}
		$rootScope.$watch(path,function(newval,oldval){
			var array=newval.split("/");
			$rootScope.activetab=array[array.length-1];
		});


	}]);



app.factory("authenticationService",function($location,ngToast,$timeout,$rootScope,$window){
	var obj=new Object();
	obj.islogin=false;
	obj.userinfo={};
	obj.login=function(){
		if($rootScope.islogin==true){
			return $rootScope.islogin;
		}
		else{
			$rootScope.scroll[$location.url()]={};
			$rootScope.scroll[$location.url()].x=$window.scrollX;
			$rootScope.scroll[$location.url()].y=$window.scrollY;
			ngToast.create({
				content:"Please login before proceeding",
				className:"warning"
			})
			$timeout(function(){
				$location.url("login");
			},500);
		}
	}
	return obj;
});



app.service("loginInterceptor",["$q","descryptFactory","cachedataservice","$window","$location","$rootScope",
	function($q,descryptFactory,cachedataservice,$window,$location,$rootScope){
		var xhrCreation=0;
		var xhrResolution=0;
		function isLoading(url){
			if(cachedataservice.get(url)==undefined)
				return xhrResolution<xhrCreation;

			return false;
		}

		function updateStatus(url){
			if(url!=undefined&&url.indexOf("html")<0&&url.indexOf("jpg")<0&&url.indexOf("png")<0){
				$rootScope.$broadcast("loading",isLoading(url));
			}

		}

		function increment(method,counter,url){
			var skiploaderarray=["/feed",".html","jpg","png"];
			if(method=='GET'){
				skiploaderarray.forEach(function(currentValue) {
					if(url.indexOf(currentValue)>=0){
						counter=counter-1;
					}
				});
				return counter+1;
			}
			return counter;
		}

		return{
			request:function(config){
				xhrCreation=increment(config.method,xhrCreation,config.url);
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
				xhrResolution++;
				updateStatus();
				$q.reject(rejection);
			},
			response:function(response){
				xhrResolution=increment(response.config.method,xhrResolution,response.config.url);
				updateStatus(response.config.url);
				if((response.config.url.toLowerCase().indexOf("registerdevice")<=0)&&(response.config.url.toLowerCase().indexOf($rootScope.apiBaseUrl)>=0)){
					if(response.data!=undefined&&response.data.data!=undefined&&response.data.data.code=="401"){
						$window.localStorage.clear();
						$window.sessionStorage.clear();
						$window.location.reload();
					}
					else{
						response.data=descryptFactory.decrypt(response.data,$window.localStorage.getItem("key"));
					}

				}
				return response;

			},
			responseError:function(rejection){
				xhrResolution++;
				updateStatus();
				$q.reject(rejection);
			}
		}
	}]);

app.factory("registerDevice",function($http,$q,$window,$rootScope,cachedataservice){
	var obj={};
	obj.isCall=false;
	obj.register=function(){
		var defer=$q.defer();
		var url;
		var key=$rootScope.key;
		url=$rootScope.apiBaseUrl+"/registerdevice";

		if(cachedataservice.get(url)!=undefined){
			defer.resolve(cachedataservice.get(url));
		}

		else{
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
		}
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
							ngToast.create("Successfully Subscribed");
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
