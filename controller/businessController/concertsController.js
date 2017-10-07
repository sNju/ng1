(function(){
	var app=angular.module("concert.model",[]);
	app.controller("concertsController",["$scope",function($scope){

		
		$scope.init=function(){
			$scope.obj={};
			$scope.obj.profile_type="Concert";
			$scope.pagename="Concert";

		}

		$scope.isAddProfile=false;
		$scope.$on("isAddProfile",function(event,isAddProfile){
			$scope.isAddProfile=isAddProfile;
		});
		$scope.init();
	}]);

	app.directive("concertDirective",function(){
		return{
			restrict:'EA',
			replace:true,
			scope:true,
			link:function($scope,$attr,$element){

			}

		}
	});
})();