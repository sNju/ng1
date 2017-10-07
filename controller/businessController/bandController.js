(function(){
	var app=angular.module("band.model",[]);
	app.controller("bandController",["$scope",function($scope){
		$scope.init=function(){
			$scope.obj={};
			$scope.obj.profile_type="Band";
			$scope.pagename="Band";
		}
		$scope.isAddProfile=false;
		$scope.$on("isAddProfile",function(event,isAddProfile){
			$scope.isAddProfile=isAddProfile;
		});
		$scope.init();
	}]);
	
	app.directive("bandDirective",function(){
		return{
			restrict:'EA',
			replace:true,
			scope:true,
			link:function($scope,$attr,$element){

			}

		}
	});
})();