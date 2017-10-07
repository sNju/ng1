var app=angular.module("smmFirstTimeScreen.module",[]);
app.controller("smmFirstTimeScreenCtrl",['$scope',function($scope){
	// Tooltip Initialization 
	$('[data-toggle="tooltip"]').tooltip({
		container: 'body',
		placement: 'auto bottom',
		trigger: 'hover'	
	});
	
}]);