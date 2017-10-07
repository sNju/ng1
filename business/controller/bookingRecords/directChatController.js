var app=angular.module('directchat.module', []);

app.controller("directchatController",["$scope","$rootScope","$stateParams","httpService",
	function($scope,$rootScope,$stateParams,httpService){
		$scope.id=$stateParams.id;
		//$scope.record_id=undefined;
		$scope.init=function(){
			var url=$rootScope.apiBaseUrl;
			url+="/profile?id="+$scope.id;
			httpService.get(url).then(function(response){
				console.log("response come in directccontrooler",response);
				var obj={};
				obj.to=response.data.detail.profile;
				$scope.$broadcast("toUser",obj);
			},function(reason){

			});
		}
		$scope.init();
		console.log("hello this is chat conteoller");
	}])