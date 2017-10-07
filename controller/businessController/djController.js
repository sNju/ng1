(function(){
	var app=angular.module("dj.model",[]);
	app.controller("djController",["$scope",function($scope){
		$scope.init=function(){
			$scope.obj={};
			$scope.obj.profile_type="DJ";
			$scope.pagename="DJ";
		}

		$scope.isAddProfile=false;
		$scope.$on("isAddProfile",function(event,isAddProfile){
			$scope.isAddProfile=isAddProfile;
		});
		$scope.init();

	}]);

	app.directive("djDirective",function(){
		return{
			restrict:'EA',
			replace:true,
			scope:true,
			link:function($scope,$attr,$element){

			}

		}
	});
})();