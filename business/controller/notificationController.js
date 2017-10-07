var app=angular.module("notification.module",[]);
app.controller("notificationCtrl", ['$scope','$rootScope','httpService','$window','chromeNotificationFactory','ngToast',
	function($scope,$rootScope,httpService,$window,chromeNotificationFactory,ngToast){
		// var $rootScope.socket=io.connect("http://localhost:3000");
		// console.log("$rootScope.socket connected");
		// $rootScope.socket.on("message",function(data){
		// 	console.log("data message=",data); 
		// 	chromeNotificationFactory.sendNotification(data,"http://localhost:8887"); 
		// 	ngToast.create(data);
		// });
		$scope.$emit("getNotification");

	}]);

app.directive("notificationDirective",function($window,httpService,$rootScope){
	return {
		replace:true,
		restrict:'EA',
		scope:false,
		templateUrl:"directive/notificationInfo.html",
		link:function($scope,element,attr,controller,transclude){
			$scope.notifications=[];
			$scope.$on("getNotification",function(event){
				$scope.updateNotification();
			});

			$scope.updateNotification=function(){
				if($scope.notifications.length==0){
					var url=$rootScope.apiBaseUrl;
					var temp=JSON.parse($window.sessionStorage.getItem("userInfo"));
					url+="/alerts?user="+temp._key;
					httpService.get(url).then(function(response){
						console.log("response come from notification",response);
						$scope.notificationsdetail=response.data.alerts;
						$scope.notifications=response.data.alerts.length>5?response.data.alerts.slice(0, 5):response.data.alerts;
						$rootScope.unreadNotificationCount=undefined;
					},function(reason){

					})
				}
			}

			$scope.init=function(){
				var url=$rootScope.apiBaseUrl;
				var temp=JSON.parse($window.sessionStorage.getItem("userInfo"));
				url+="/alerts?user="+temp._key;
				url+="&countonly=true";
				httpService.get(url).then(function(response){
					$rootScope.unreadNotificationCount=response.data.alerts>0?response.data.alerts:undefined;
				},function(reason){

				});
			}

			$scope.init();
			
		}
	}
});





app.directive("notoficationDirective",function($window,$rootScope){

	return {
		link:function($scope,attr,controller){

			var connectionOptions =  {
				"force new connection" : true,
				"reconnectionAttempts": "Infinity", 
				"timeout" : 10000, 
				"secure":true
			};
			var userdata=[];
			function socketConnect(){
				$rootScope.socket=io.connect("https://api.goparties.com",connectionOptions);
				$rootScope.socket.on("connect", function(data){
					$rootScope.socket.emit("register",userdata[0]);
				});

				$rootScope.socket.on(userdata[0].id,function(obj){
					console.log("data come In socket obj",obj);
					$rootScope.$broadcast("chat",obj);
				});

				$rootScope.socket.on("onstatuschange",function(data){
				});
			}


			$scope.init=function(){
			//$scope.getMessages();
			var temp=JSON.parse($window.sessionStorage.getItem("userInfo"));
			$scope.user=temp;
			userdata.push({
				username:temp.username,
				profile_pic:temp.profile_pic,
				cover:temp.cover,
				id:temp._key
			});
			socketConnect();
		}

		
		$scope.init();

	}
}
})