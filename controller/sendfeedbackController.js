var app=angular.module("feedback.module",[]);
app.controller("feedbackController",["$scope",function($scope){
	$scope.$emit("TitlePage","FeedBack - GoParties Your Party App");
}]);