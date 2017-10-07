var app=angular.module("main.module");
app.controller("bmessagesController",["$scope","httpService","$rootScope",
	function($scope,httpService,$rootScope){

		$scope.init=function(){
			$scope.getallmessages();
		}
        $rootScope.$emit("AdminPageTitle","GPBA Messages");
		$scope.getallmessages=function(){
			var url=$rootScope.apiBaseUrl;
			url+="/mymessages?user="+$rootScope.userinfo._key;
			httpService.get(url).then(function(response){
				console.log("response",url,response);
				$scope.messages=response.data.mymessages;
				console.log("$scope.messages",$scope.messages);
			},function(reason){
				
			});
		}
		$scope.init();

	}]);


