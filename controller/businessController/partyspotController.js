(function(){
	var app=angular.module("partyspot.model",[]);
	app.controller("partyspotController",["$scope",function($scope){

		$scope.init=function(){
			$scope.obj={};
			$scope.obj.profile_type="Party Spot";
			$scope.pagename="Party Spot";
		}

		$scope.isAddProfile=false;
		$scope.$on("isAddProfile",function(event,isAddProfile){
			$scope.isAddProfile=isAddProfile;
		});
		
		$scope.init();
	}]);

	app.directive("partyspotDirective",function(){
		return{
			restrict:'EA',
			replace:true,
			scope:true,
			link:function($scope,$attr,$element){

			}

		}
	});	
})();