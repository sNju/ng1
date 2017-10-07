(function(){
	var app=angular.module("dealDetail.module",[]);
	app.controller("dealDetailController",["$scope","$stateParams","httpService","$rootScope","calculateRemainTime",
		function($scope,$stateParams,httpService,$rootScope,calculateRemainTime){
			$scope.deal={};
			$scope.user={};
			$scope.id=$stateParams.id;
			$scope.init=function(){
				var url=$rootScope.apiBaseUrl;
				url+="/deal?id="+$stateParams.id;
				httpService.get(url).then(function(response){
					console.log("response come from deal=",response.data.detail);
					$scope.deal=response.data.detail.deal;
					$scope.user=response.data.detail.user;
					$rootScope.image=$scope.deal.thumburl;
					$rootScope.title=$scope.deal.title;
					$rootScope.description=$scope.deal.description;
				},function(reason){

				});
			}
			$scope.getRemainTime=function(date){
				return calculateRemainTime.calculate_remainingtime(date)+" "+calculateRemainTime.calculateDays_string(date);
			}
			$scope.init();
			$scope.$emit("TitlePage",Deals - GoParties | Your Party App);

		}]);
})();