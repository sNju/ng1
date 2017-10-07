var app=angular.module("main.module");
app.controller("tinyurlController", ["$scope","httpService","$rootScope" 
	,function($scope,httpService,$rootScope){


		$scope.init=function(){
			var url=$rootScope.apiBaseUrl;
			url+="/alltinyurl";
			httpService.get(url).then(function(response){
				if(response.data!=undefined){
					$scope.urls=response.data.tinyurl;
				}
				console.log("response",response);
			},function(reason){

			});
		}

		$scope.togglestate=function(data){
			data.active=data.active==true?false:true;
			var url=$rootScope.apiBaseUrl;
			url+="/tinyurl/?id="+data._key;
			httpService.put(url,data).then(function(response){
				data.active=response.data.tinyurl.active;
			},function(reason){
				data.active=data.active==true?false:true;
			});
		}
		$scope.init();
	}])
