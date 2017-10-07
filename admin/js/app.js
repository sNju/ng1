var app=angular.module("main.module",["ui.router","facebook","ngMaterial","ngMessages","ngAnimate","angular-bootstrap-select","angular-bootstrap-select.extra","filter.module","oc.lazyLoad","directive.module"]);

app.controller('parentController', ['$scope','homeredirectfactory','$rootScope','$httpParamSerializer','$window','$location','getuserid',
	function($scope,homeredirectfactory,$rootScope,$httpParamSerializer,$window,$location,getuserid){
		var userdata=[];
		$rootScope.roles=["admin","marketing","business","finance","sales"];
		console.log("parent controller inti");
		$scope.signout=function(){
			$rootScope.islogin=false;
			$rootScope.userinfo=undefined;
			$rootScope.accessToken=undefined;
			$rootScope.expirytime=undefined;
			$rootScope.$emit("userinfo",undefined);
			userdata=[];
			$location.path("login");
		}


		$rootScope.$on("internalhttpcall",function(event,value){
			$rootScope.internalhttpcall=value;
		});

		$rootScope.$on("createpartyuser",function(event,id){
			getuserid.setUserId(id);
		});

		$rootScope.$on("AdminPageTitle",function(event,title){
			document.title=title!==undefined?title:"GPBA Admin Application";
		});

		$rootScope.$on("userinfo",function(event,value){
			if(value!=undefined){
				$window.sessionStorage.setItem("userinfo",JSON.stringify(value));
				$window.localStorage.setItem("userinfo",JSON.stringify(value));
				if(value.role!==undefined){
					var type=value.role.charAt(0).toUpperCase() + value.role.slice(1);
					title="GPBA "+type+" Application";
					$rootScope.$emit("AdminPageTitle",title);
					$rootScope.islogin=true;

				}
			}
			else{
				$window.sessionStorage.clear();
				$window.localStorage.clear();
			}
			$rootScope.userinfo=value;
		});


		$rootScope.$on("FacebookToken",function(event,value){
			if(value.authResponse!=null){
				$rootScope.accessToken=value.authResponse.accessToken;
				var now=new Date().getTime()/1000;
				var settime=now+value.authResponse.expiresIn;
				$rootScope.expirytime=settime;

			}

			$window.sessionStorage.setItem("FbaccessToken",$rootScope.accessToken);
			$window.sessionStorage.setItem("ExpiryTime",$rootScope.expirytime);


		});


		$scope.status=function(message,classname,data,path){
			message1=data==undefined?"something went wrong":message;
			message1=message!=undefined?message:message1;
			$scope.$emit("message",{
				message:message1,
				classname:classname
			});
			if(data!=undefined&&path!=undefined){
				//console.log("pathpathpathpathpath",path);
				$location.url(path);
			}
		}

		$scope.$on("status",function($event,message,classname,data,path){
			$scope.status(message,classname,data,path);
		});

		var paginationcount=10;
		$rootScope.paginationcount=paginationcount;


		$rootScope.$watch("paginationcount",function(newVal,oldVal,scope){
			if(newVal!=oldVal){
				paginationcount=newVal;
				$rootScope.paginationcount=newVal;
			}
		},true)


		$scope.paginationinit=function(obj,pagecount){
			obj.since=0;
			obj.limit=pagecount || paginationcount;
		}

		$scope.updateurl=function(obj){
			var path=$location.path();
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}
			$location.url(path);
		}

		$scope.prev=function(obj,pagecount){
			pagecount=pagecount||paginationcount;
			if(obj.since==0||obj.since==undefined){

			}
			else{
				obj.since=parseInt(obj.since)-pagecount;
				//obj.limit=parseInt(obj.limit)-paginationcount;
				$scope.updateurl(obj);
			}
		}


		$scope.next=function(obj,pagecount){
			debugger;
			pagecount=pagecount||paginationcount;
			if(obj.since=="NaN" || obj.since=="" || obj.since==undefined){
				obj.since=0;
			}
			obj.since=parseInt(obj.since)+pagecount;
			//obj.limit=parseInt(obj.limit)+paginationcount;
			$scope.updateurl(obj);

		}

		$scope.indexcalculate=function(index,since){
			if(since==undefined || since=="" || since=="NaN"){
				since=0;
			}
			var value=index+1+parseInt(since);
			return value;
		}




		$scope.filterdata=function(obj,pagecount){
			obj.since=0;
			obj.limit=pagecount || $rootScope.paginationcount;
			if(obj.address==undefined||obj.address.length==0){
				delete obj.latitude;
				delete obj.longitude;
			}
			var path=$location.path();
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}

			$location.url(path);

		}
//header logo click redirect on home page based on role
$scope.redirecthome=function(){
	debugger;
	$location.url(homeredirectfactory.getpage($rootScope.userinfo.role));
}



//socket.io functionality start from here
var connectionOptions =  {
	"force new connection" : true,
	"reconnectionAttempts": "Infinity",
	"timeout" : 10000,
	"secure":true
};

function socketConnect(){
	if($rootScope.socket==undefined){
		$rootScope.socket=io.connect($rootScope.apiBaseUrl,connectionOptions);
		$rootScope.socket.on("connect", function(data){
			$rootScope.socket.emit("register",userdata[0]);
		});


		$rootScope.socket.on(userdata[0].id,function(obj){
			$scope.$broadcast("chat",obj);
		});


		$rootScope.socket.on("onstatuschange",function(data){
		});

		$scope.$on("chatmessage",function(event,sendObj){
			$rootScope.socket.emit("send",sendObj);
		});


	}

}


$scope.initsocket=function(){
	var temp=$rootScope.userinfo;
	$scope.user=temp;
	userdata.push({
		username:temp.username,
		profile_pic:temp.profile_pic,
		cover:temp.cover,
		id:temp._key
	});
	socketConnect();
}


$rootScope.$watch("islogin",function(newVal,oldVal,scope){
	if(newVal!=oldVal){
		if(newVal==true){
			userdata=[];
			$scope.initsocket();
		}
	}
},true);


if($rootScope.islogin==true){
	$scope.initsocket();
}

}]);
app.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise("/");
	$stateProvider.state("/",{
		url:"/",
		templateUrl:"./html/admin/home.html",
		controller:"homeController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/admin/homeController.js","plugins/bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css"]
			})
		}]
	}).state("/login",{
		url:"/login",
		templateUrl:"./html/miscellaneous/login.html",
		controller:"loginController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/miscellaneous/loginController.js"]
			})
		}]
	}).state("/404",{
		url:"/404",
		templateUrl:"./html/miscellaneous/404.html"
	}).state("/users",{
		url:"/users",
		templateUrl:"./html/admin/users.html",
		controller:"userController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/admin/userController.js"]
			})
		}]
	}).state("/adduser",{
		url:"/adduser/:id",
		templateUrl:"./html/admin/adduser.html",
		controller:"adduserController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:[	"js/controller/admin/adduserController.js","plugins/bootstrap-select/css/bootstrap-select.css"]
			})
		}]
	}).state("/appconfig",{
		url:"/appconfig",
		templateUrl:"./html/marketing/appconfig.html",
		controller:"appconfigController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:[	"js/controller/marketing/appconfigController.js","plugins/bootstrap-select/css/bootstrap-select.css"]
			})
		}]
	}).state("/gocontacts",{
		url:"/gocontacts",
		templateUrl:"./html/marketing/gocontacts.html",
		controller:"gocontactsController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/gocontactsController.js"]
			})
		}]
	}).state("/partyfetchlisting",{
		url:"/partyfetchlisting/:id",
		templateUrl:"./html/marketing/partyfetchlisting.html",
		controller:"partyfetchlistingController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/partyfetchlistingController.js"]
			})
		}]
	}).state("/partymoonbookings",{
		url:"/partymoonbookings?params",
		reloadOnSearch: false,
		templateUrl:"./html/marketing/partymoonbookings.html",
		controller:"partymoonbookingsController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/partymoonbookingsController.js"]
			})
		}]
	}).state("/profiles",{
		url:"/profiles?params",
		reloadOnSearch: false,
		templateUrl:"./html/marketing/profiles.html",
		controller:"profilesController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/profilesController.js"]
			})
		}]
	}).state("/tinyurl",{
		url:"/tinyurl",
		templateUrl:"./html/marketing/tinyurl.html",
		controller:"tinyurlController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/tinyurlController.js"]
			})
		}]
	}).state("/addtinyurl",{
		url:"/addtinyurl/:id",
		templateUrl:"./html/marketing/addtinyurl.html",
		controller:"addtinyurlController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/addtinyurlController.js"]
			})
		}]
	}).state("/editprofile",{
		url:"/editprofile/:id",
		templateUrl:"./html/marketing/editprofile.html",
		controller:"editprofileController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/ng-file-upload.js","js/controller/marketing/moduleCommonController.js","js/controller/marketing/editprofileController.js"]
			})
		}]
	}).state("/webslider",{
		url:"/webslider",
		templateUrl:"./html/marketing/webslider.html",
		controller:"websliderController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/moduleCommonController.js","https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js","libjs/sortable.js","js/controller/marketing/websliderController.js"]
			})
		}]
	}).state("/createparty",{
		url:"/createparty/:id",
		templateUrl:"./html/marketing/createparty.html",
		controller:"createpartyController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/ng-file-upload.js","js/controller/marketing/moduleCommonController.js","js/controller/marketing/createpartyController.js"]
			})
		}]
	}).state("finance1",{
		url:"/finance1",
		templateUrl:"./html/finance/finance1.html",
	}).state("orderdetail",{
		url:"/orderdetail/:id",
		templateUrl:"./html/miscellaneous/orderdetail.html",
		controller:"orderdetailController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/miscellaneous/orderdetailController.js"]
			})
		}]
	}).state("/detail",{
		url:"/detail/:type?id",
		reloadOnSearch: false,
		templateUrl:"./html/miscellaneous/partydetail.html",
		controller : "partydetailController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/miscellaneous/partydetailController.js"]
			})
		}]
	}).state("/newbooking",{
		url:"/newbooking/:type?id",
		reloadOnSearch: false,
		templateUrl:"./html/miscellaneous/newbooking.html",
		controller : "newbookingController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/miscellaneous/newbookingController.js"]
			})
		}]
	}).state("/revenue",{
		url:"/revenue?params",
		templateUrl:"./html/admin/revenue.html",
		controller : "revenueController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/admin/revenueController.js"]
			})
		}]
	}).state("/signup",{
		url:"/signup?params",
		templateUrl:"./html/admin/partymonsignup.html",
		controller : "partymonsignupController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/admin/partymonsignupController.js"]
			})
		}]
	}).state("/allelements",{
		url:"/allelements?params",
		reloadOnSearch: false,
		templateUrl:"./html/admin/allelements.html",
		controller : "allelementsController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/admin/allelementsController.js"]
			})
		}]
	}).state("/claimed",{
		url:"/claimed?params",
		templateUrl:"./html/sales/claimed.html",
		controller : "claimedController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/sales/claimedController.js"]
			})
		}]
	}).state("/pending",{
		url:"/pending?params",
		templateUrl:"./html/sales/pending.html",
		controller : "pendingController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/sales/pendingController.js"]
			})
		}]
	}).state("/notifications",{
		url:"/notifications?params",
		templateUrl:"./html/marketing/notifications.html",
		controller:"notificationsController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/notificationsController.js","plugins/bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css"]
			})
		}]
	}).state("/sendnotification",{
		url:"/sendnotification",
		controller:"sendnotificationController",
		templateUrl:"./html/marketing/sendnotification.html",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/moduleCommonController.js","js/controller/marketing/sendnotificationController.js","plugins/bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css"]
			})
		}]
	}).state("/objectselection",{
		url:"/objectselection?params",
		controller:"sendnotificationselectionController",
		templateUrl:"./html/marketing/sendnotificationselection.html",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/moduleCommonController.js","js/controller/marketing/sendnotificationselectionController.js","plugins/bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css"]
			})
		}]
	}).state("/promocodes",{
		url:"/promocodes",
		templateUrl:"./html/marketing/promocodes.html",
		controller : "promocodesController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/promocodesController.js"]
			})
		}]
	}).state("/sendmessages",{
		url:"/sendmessages",
		templateUrl:"./html/marketing/sendmessages.html",
		controller : "sendmessagesController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/sendmessagesController.js"]
			})
		}]
	})
	.state("/createmessagesgroup",{
		url:"/createmessagesgroup/:id",
		templateUrl:"./html/marketing/createmessagesgroup.html",
		controller : "createmessagesgroupController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/createmessagesgroupController.js"]
			})
		}]
	}).state("/addpromocode",{
		url:"/addpromocode/:id",
		templateUrl:"./html/marketing/addpromocode.html",
		controller:"addpromocodeController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/addpromocodeController.js"]
			})
		}]
	}).state("/addgpb",{
		url:"/addgpb/:id",
		templateUrl:"./html/marketing/addgpb.html",
		controller:"addgpbController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/addgpbController.js"]
			})
		}]
	}).state("/partieslisting",{
		url:"/partieslisting?params",
		templateUrl:"./html/marketing/partieslisting.html",
		controller:"partieslistingController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/partieslistingController.js"]
			})
		}]
	}).state("/promocodeusage",{
		url:"/promocodeusage/:id",
		templateUrl:"./html/marketing/promocodeusage.html",
		controller:"promocodeusageController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/promocodeusageController.js"]
			})
		}]
	}).state("/bparties",{
		url:"/bparties?params",
		templateUrl:"./html/business/bparties.html",
		controller:"partieslistingController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/partieslistingController.js"]
			})
		}]
	}).state("/brevenue",{
		url:"/brevenue",
		templateUrl:"./html/business/brevenue.html",
		controller:"brevenueController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/business/brevenueController.js"]
			})
		}]
	}).state("/changepassword",{
		url:"/changepassword",
		templateUrl:"./html/business/changepassword.html",
		controller:"changepassword",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/business/changepassword.js"]
			})
		}]
	}).state("/bprofile",{
		url:"/bprofile",
		templateUrl:"./html/marketing/editprofile.html",
		controller:"editprofileController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/ng-file-upload.js","js/controller/marketing/moduleCommonController.js","js/controller/marketing/editprofileController.js"]
			})
		}]
	}).state("/chat",{
		url:"/chat/:id",
		templateUrl:"./html/miscellaneous/chat.html",
		controller:"chatController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/miscellaneous/chatController.js"]
			})
		}]
	}).state("/bmessages",{
		url:"/bmessages",
		templateUrl:"./html/business/bmessages.html",
		controller:"bmessagesController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/business/bmessagesController.js"]
			})
		}]
	}).state("/blogs",{
		url:"/blogs",
		templateUrl:"./html/marketing/bloglisting.html",
		controller:"bloglistingController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/bloglistingController.js"]
			})
		}]
	}).state("/blog",{
		url:"/blog/:id",
		templateUrl:"./html/marketing/addblog.html",
		controller:"addblogController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["libjs/tinymce/tinymce.js","libjs/angular-ui-tinymce/src/tinymce.js","js/ng-file-upload.js","js/controller/marketing/addblogController.js"]
			})
		}]
	}).state("/feeds",{
		url:"/feeds?params",
		reloadOnSearch: false,
		templateUrl:"./html/marketing/feeds.html",
		controller:"feedsController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/marketing/feedsController.js"]
			})
		}]
	}).state("/relationshipmanager",{
		url:"/relationshipmanager",
		templateUrl:"./html/business/relationshipmanager.html",
		controller:"relationshipmanagerController",
		resolve:["$ocLazyLoad",function($ocLazyLoad){
			return $ocLazyLoad.load({
				cache:true,
				files:["js/controller/business/relationshipmanagerController.js"]
			})
		}]
	});
});

app.config(
	function($provide, $httpProvider,$locationProvider) {
		$httpProvider.interceptors.push('loginInterceptor');
	});


app.run(['$rootScope','$location','$window','isauthorized','$window', 'homeredirectfactory'
	,function($rootScope,$location,$window,isauthorized,$window,homeredirectfactory){
		var path = function() { return $location.path();};
		$rootScope.nestedloader=false;
		$rootScope.parentpreloader=1;
		$rootScope.isfirsttime=0;
		$rootScope.internalhttpcall=false;
		$rootScope.init=0;
		if($rootScope.islogin!=true&&$window.sessionStorage.getItem("userinfo")!=null){
			$rootScope.userinfo=JSON.parse($window.sessionStorage.getItem("userinfo"));
			$rootScope.islogin=true;
		}




		$rootScope.$watch(path, function(newVal, oldVal){
			$rootScope.activetab=newVal;
			if($rootScope.activetab.indexOf("login")>=0){
				$rootScope.islogin=false;
			}
		});

		$rootScope.$on("$stateChangeStart",function(event,toState,toParams){
			debugger;
			if(($rootScope.islogin!=true && $rootScope.activetab.indexOf("404")<0) || ($rootScope.islogin==true && $rootScope.userinfo.role==undefined)){
				$rootScope.init=0;
				$location.path("login");
			}
			else if($rootScope.activetab.indexOf("404")>=0){

			}
			else{

				if(isauthorized.check($location.path())==false){
					$location.url(homeredirectfactory.getpage($rootScope.userinfo.role));
				}
				$rootScope.init++;
				$rootScope.parentpreloader=$rootScope.parentpreloader+1;
			}
		});

		$rootScope
		.$on('$stateChangeSuccess',function (event, toState, toParams, fromState, fromParams) {
			$rootScope.$emit("userinfo",$rootScope.userinfo);
		});

	}]);




app.run(["$rootScope","$window",function($rootScope,$window){
	var url=$window.location.href;
	//$rootScope.apiBaseUrl="http://localhost:1234";
	// if we are running in production change base url
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
		
		$rootScope.webBaseUrl="https://www.goparties.com";
		$rootScope.devapiBaseUrl="https://api.goparties.com";
	}]);


app.factory("httpService",function($http,$q){
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
		$http.get(url).then(function(response){
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

app.service("loginInterceptor",["$q","$window","$location","$rootScope",
	function($q,$window,$location,$rootScope){
		$rootScope.nestedloader=true;
		var xhrCreation=0;
		var xhrResolution=0;
		var method=""
		function isLoading() {
			return xhrResolution < xhrCreation;
		}

		function updateStatus(url) {
			// var array=[];
			// var check=false;
			// var isfind=[];

			// if(url!=undefined){
			// 	isfind=array.filter(function(obj){
			// 		return url.toLowerCase().indexOf(obj.toLowerCase())>=0
			// 	});
			// }

			// check=isfind.length>0;
			// if(check==true)
			// {
			// 	$rootScope.nestedloader=false;
			// }
			// else{
				$rootScope.nestedloader=isLoading();
			//}


		}
		return{
			request:function(config){
				xhrCreation=config.method=='GET'?xhrCreation+1:xhrCreation;
				updateStatus(config.url);
				return config;
			},
			requestError:function(rejection){
				xhrResolution++;
				updateStatus();
				$q.reject(rejection);
			},
			response:function(response){
				xhrResolution=response.config.method=='GET'?xhrResolution+1:xhrResolution;
				updateStatus(response.config.url);
				return response;

			},
			responseError:function(rejection){
				xhrResolution++;
				updateStatus();
				$q.reject(rejection);
			}
		}
	}]);

app.factory("isauthorized",function($rootScope){
	var object=new Object();
	var authobj={
		"sales":["claim","pending"],
		"marketing":["blog","createmessagesgroup","sendmessages","webslider","addpromocode","gocontacts","notifications","promocodeusage","sendnotification"],
		"finance":[],
		"business":["createparty","bparties","brevenue","detail","orderdetail","bmessages","chat","bprofile","relationshipmanager"]
	}
	object.check=function(path){
		var role=$rootScope.userinfo.role;

		if(role=="admin")
		{
			return true;
		}
		
		var array=authobj[role];
		if(array!=undefined){
			for(var index=0;index<array.length;++index){
				if(path.toLowerCase().indexOf(array[index])>=0){
					return true;
				}
			}
		}
		return false;
	}

	return object;
});


app.factory("homeredirectfactory",function($rootScope){
	var object=new Object();
	var rolehome={
		"admin":"/",
		"sales":"/claimed",
		"marketing":"/notifications",
		"finance":"finance1",
		"business":"/bparties"
	}
	object.getpage=function(role){
		if(role=="business"){
			return rolehome[role]+"?user="+$rootScope.userinfo._key
		}
		return rolehome[role];
	}
	return object;
});

app.factory("getuserid",function(){
	var obj=new Object();
	var id;

	obj.getId=function(){
		return id;
	}

	obj.setUserId=function(data){
		id=data;
	}
	return obj;
});

//facebook login functionality start from here

app.config(function(FacebookProvider) {
	FacebookProvider.init('1024779960888137');
})

app.controller('authenticationCtrl', function($scope, Facebook , $rootScope) {
	$scope.login = function() {
		Facebook.login(function(response) {

			//console.log("response",response);
			$rootScope.$emit("FacebookToken",response);
		});
	};

	$scope.getLoginStatus = function() {
		Facebook.getLoginStatus(function(response) {

			if(response.status === 'connected') {
				$scope.loggedIn = true;
			} else {
				$scope.loggedIn = false;
			}
		});
	};

	$scope.me = function() {
		Facebook.api('/me', function(response) {
			$scope.user = response;
		});
	};
});