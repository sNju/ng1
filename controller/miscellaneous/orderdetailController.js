var app=angular.module("main.module");
app.controller("orderdetailController",["$scope", "$stateParams","$rootScope","httpService",function($scope, $stateParams, $rootScope, httpService){
	
	$scope.orderobj = 
	$scope.init = function(id) {
		var url=$rootScope.apiBaseUrl+"/order?id="+id;
		httpService.get(url).then(function(response){
			$scope.orderobj = response.data.order;
			console.log("$scope.orderobj",$scope.orderobj);
		},function(reason) {
		});
	};

	$scope.init($stateParams.id);
	$scope.$emit("TitlePage","Orders - GoParties | Your Party App");
}]);



app.directive("jspdfDirective",function($window){
	return{
		restrict:'EA',
		scope:true,
		replace:true,
		link:function($scope,$element,$attr){
			$scope.download=function(){
				$window.print();
			}

		}

	}
})

