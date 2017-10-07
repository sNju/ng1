(function(){
var app=angular.module("artist.model",[]);
app.controller("artistController",["$scope",function($scope){
	
	$scope.init=function(){
		$scope.obj={};
		$scope.obj.profile_type="Artist";
		$scope.pagename="Artist";
	}
	$scope.isAddProfile=false;
		$scope.$on("isAddProfile",function(event,isAddProfile){
			$scope.isAddProfile=isAddProfile;
		});
	$scope.init();
}]);

app.directive("artistDirective",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:true,
		link:function($scope,$attr,$element){
			$(document).ready(function(){
				$("#forgotPassword_popup").hide();
				$("#forgotPasswordPopup").click(function(){
					$("#businessLogin_popup").hide();
					$("#forgotPassword_popup").show();
				});
				$("#loginPopup").click(function(){
					$("#forgotPassword_popup").hide();
					$("#businessLogin_popup").show();
				});
			});

			$(document).ready(function(){
				$("#forgotPassword_popup").hide();
				$("#forgotPasswordPopup").click(function(){
					$("#businessLogin_popup").hide();
					$("#forgotPassword_popup").show();
				});
				$("#loginPopup").click(function(){
					$("#forgotPassword_popup").hide();
					$("#businessLogin_popup").show();
				});
			});
		}

	}
});


app.factory("httpCall",function($http,$q){
	var obj={};
	obj.post=function(url,data){
		//console.log("url,data",url,data);
		var defer=$q.defer();
		$http.post(url,data).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
});


})();