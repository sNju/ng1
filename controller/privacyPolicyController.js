(function(){
	var app=angular.module('privacyPolicy.module', []);
	app.controller("privacyPolicyController",["$scope",function($scope){
		$scope.$emit("TitlePage","Privacy Policies - GoParties | Your Party App");

	}]);

	app.directive("privacyPolicyDirective",function(){
		return{
			restrict:'EA',
			replace:true,
			scope:true,
			link:function($scope,$attr,$element){
			}
		}
	})
})()