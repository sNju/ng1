var app=angular.module("main.module");
app.controller('changepassword', ['$scope','httpService','$rootScope','$location','$window'
	,'homeredirectfactory'
	,function($scope,httpService,$rootScope,$location,$window,homeredirectfactory){
		var baseurl=$rootScope.apiBaseUrl;


		$scope.reset=function(obj,isvalid){

			if(obj.newpassword.length<6 || obj.newpassword.length>20 )
			{
				obj.newpassword="";
				obj.confirmpassword="";
				isvalid=false;
				$scope.$emit("status","Password must be 6 to 20 characters long","alert-warning",undefined,undefined);
			}
			if(obj.newpassword!=obj.confirmpassword)
			{
				obj.confirmpassword="";
				isvalid=false;
				$scope.$emit("status","Passwords do not match!","alert-danger",undefined,undefined);
			}
			if(obj.oldpassword==obj.newpassword){
			    isvalid=false;
			    obj.newpassword="";
			    obj.confirmpassword="";
			    $scope.$emit("status","New Password should be different from Old Password","alert-warning",undefined,undefined);
			}

			if(obj.newpassword.length>=6 && obj.newpassword.length<=20  && isvalid==true){
				$rootScope.$emit("childloading",true);
				obj.id=$rootScope.userinfo._key;
				//  obj.otp=otp;
				//console.log("resetpass",obj);

				url=baseurl+"/changepassword";
				httpService.post(url,obj).then(function(response){
				//console.log("apiresponse",response);
					$rootScope.$emit("childloading",false);
					if(isvalid && response.data!=undefined && response.data.password==true ){

						$scope.$emit("status","Password Updated Successfully","alert-success",undefined,undefined);
						$location.url("/");
					}
					else{
					    obj.oldpassword="";
					    isvalid=false;
					    $scope.$emit("status","Please enter valid Password","alert-danger",undefined,undefined);

					}
				},function(reason){
					$rootScope.$emit("childloading",false);
				});
			}


		}


	}]);





app.directive("closeNavbar",function(){
	return{
		restrict:'EA',
		link:function($scope,$attr,$element){
			$(document).ready(function(){
				$('.forget-passwordNew').click(function(){
					$('#primary-navigation').removeClass('collapse in').addClass('collapse');
				});
			});

		}
	}
});
