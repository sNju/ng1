var app=angular.module("main.module");
app.controller('loginController', ['$scope','$httpParamSerializer','httpService','$rootScope','$location','$window' 
	,'homeredirectfactory'
	,function($scope,$httpParamSerializer,httpService,$rootScope,$location,$window,homeredirectfactory){
		var baseurl=$rootScope.apiBaseUrl;
		$scope.$emit("AdminPageTitle","GPBA Login Panel");
		$scope.chnagestate=function(value){
			$scope.stage=value;
		}

		$scope.notnow=function(){
			$scope.stage="login";
		}
		$scope.$on("wrongemail",function($event,value){
			$scope.wrongemail=value;
		});

		$scope.forget=function(obj,isvalid){
			
			$scope.emailsent=obj.value;
			if(isvalid==true){
				$rootScope.$emit("childloading",true);
				value=obj.value;
				url=baseurl+"/forgot";
				httpService.post(url,obj).then(function(response){
					$rootScope.$emit("childloading",false);
					if(response.data!=undefined&&response.data.forgot==true){
						$scope.stage="verify";
					}
					else{
						$scope.message=response.error!=undefined?response.error.message:"please enter valid email";
						$scope.$emit("wrongemail",true);
						setTimeout(function(){
							$scope.$emit("wrongemail",false);
						},1000)
					}

				},function(reason){
					$rootScope.$emit("childloading",false);
				});
			}

		}

		$scope.verify=function(obj,isvalid){
			if(isvalid==true){
				$rootScope.$emit("childloading",true);
				obj.value=value;
				otp=obj.otp;
				//console.log("objval",obj);
				url=baseurl+"/verify";
			    //console.log("url",url);
			    httpService.post(url,obj).then(function(response){
					//console.log("response",response);
					$rootScope.$emit("childloading",false);
					if(response.data!=undefined&&response.data.verify==true){

						$scope.stage="reset";
						
					}
					else{
						$scope.$emit("otpverification",true);
						
						setTimeout(function(){
							$scope.$emit("otpverification",false);
						},1000)
					}
				},function(reason){
					$rootScope.$emit("childloading",false);
				});
			}
		}


		$scope.reset=function(obj,isvalid){

			if(obj.password.length<6 || obj.password.length>20 )
			{
				obj.password="";
				obj.confirmpassword="";
				isvalid=false;
				$scope.$emit("status","Password must be 6 to 20 characters long","alert-warning",undefined,undefined);
				
			}
			if(obj.password!=obj.confirmpassword)
			{
				obj.confirmpassword="";
				isvalid=false;
				$scope.$emit("status","Passwords do not match!","alert-danger",undefined,undefined);

			}

			if(obj.password.length>=6 && obj.password.length<=20  && isvalid==true){
				$rootScope.$emit("childloading",true);
				obj.value=value;
				obj.otp=otp;
				url=baseurl+"/reset";
				httpService.post(url,obj).then(function(response){
					$rootScope.$emit("childloading",false);
					if(isvalid && response.data!=undefined && response.data.reset==true ){

						$scope.$emit("status","Password updated successfully","alert-success",undefined,undefined);
						$scope.stage="login";
					}
					else if(response.error!=undefined){
						ngToast.create({
							content:response.error.message,
							className:"warning"
						});
					}
					else{
						$scope.$emit("status","Please enter valid password","alert-warning",undefined,undefined);
					}
				},function(reason){
					$rootScope.$emit("childloading",false);
				});
			}

			
		}

		$scope.$on("resendotp",function($event,value){
			$scope.resendotp=value;
		});

		$scope.$on("otpverification",function($event,value){
			$scope.otpverification=value;
		});

		$scope.resend=function(){
			$scope.$emit("otpverification",false);
			$rootScope.$emit("childloading",true);
			var obj=new Object();
			obj.value=value;
			url=baseurl+"/resend";
			httpService.post(url,obj).then(function(response){
				//console.log("response resend",response);
				$rootScope.$emit("childloading",false);
				if(response.data!=undefined){
					$scope.$emit("resendotp",true);
					setTimeout(function(){
						$scope.$emit("resendotp",false);
					},1000);
				}
				else{
					ngToast.create({
						content:response.error.message,
						className:"warning"
					});
				}
			},function(reason){
				$rootScope.$emit("childloading",false);
			});

		}
		
		$scope.login=function(obj){
			url=baseurl+"/login";
			httpService.post(url,obj).then(function(response){
				$scope.parse(response);
			},function(reason){

			});
		}

		$scope.parse=function(response){
			if(response.data!=undefined){
				$rootScope.userinfo=response.data.profile;
				if($rootScope.roles.indexOf($rootScope.userinfo.role)>-1){
					$rootScope.$emit("userinfo",$rootScope.userinfo);
					$location.url(homeredirectfactory.getpage($rootScope.userinfo.role));

				}
				else{
					$scope.$emit("status","you do not have permission to access App","alert-danger",undefined,"");
				}
			}
			else{
				$scope.$emit("status",response.error.message,"alert-danger",undefined,"");
			}
		}

		$scope.init=function(obj){
			if((angular.equals({}, $location.search())!=true)&&$location.search().token!=undefined){
			    var data = $location.search();
				url=baseurl+"/authorize";
				httpService.post(url, data).then(function(response){
					$scope.parse(response);
				},function(reason){

				});
			}
			else{
				$scope.stage="login";
			}
		}
		$scope.init();




	}]);



app.directive("loginPageParent",function(){
	return{
		restrict:'EA',
		scope:false,
		link:function($scope,$element,$attr){
			$attr.$observe("stage", function (newValue){
				console.log("parent $scope.stage",$scope.stage);
				if($scope.stage!=undefined){
					$scope.parenttemplate="directive/auth/parent.html";
				}
				else{
					$scope.parenttemplate="";
				}
			});
		},
		template:'<div ng-include="parenttemplate" class="flex-center-position"></div>'
	}
});





app.directive("loginPageBody",function(){
	return{
		restrict:'EA',
		replace:true,
		scope:false,
		link:function($scope,$element,$attr){
			$attr.$observe("stage", function (newValue) {
				$scope.status=$attr.stage;
				console.log("child $scope.stage",$scope.stage);
				switch($scope.stage){
					case "login":
					$scope.template="directive/auth/login.html";
					break;
					case "forget":
					$scope.template="directive/auth/forget.html";
					break;
					case "reset":
					$scope.template="directive/auth/reset.html";
					break;
					case "verify":
					$scope.template="directive/auth/verify.html";
					break;
					default:
					$scope.template="";

				}

			});
		},
		template:'<div ng-include="template"></div>'
	}
});



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
