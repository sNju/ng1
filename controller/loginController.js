var app=angular.module("login.module",[]);
app.controller("loginController",["$scope","$window","ngToast","$location","$rootScope","httpService","authenticationService",
	function($scope,$window,ngToast,$location,$rootScope,httpService,authenticationService){

		$scope.$emit("TitlePage","Login-GoParties - Your Party App");
		var baseurl=$rootScope.apiBaseUrl;

		$scope.stage="login";

		$scope.$on("stage",function(event,value){
			$scope.stage=value;
		});

		$scope.promoCodeStatus=false;

		$scope.$on("promoCodeStatus",function(event,value){
			$scope.promoCodeStatus=value;
		});

		$scope.gotPromocode=function () {
			$scope.promoCodeStatus=true;

		};

		$scope.loginobj={};

		$scope.$on("resendotp",function($event,value){
			$scope.resendotp=value;
		});

		$scope.$on("otpverification",function($event,value){
			$scope.otpverification=value;
		});

		$scope.$on("otpmsg",function($event,value){
			$scope.otpmsg=value;
		});

		$scope.sendOtp=function(obj,isvalid){
			if(isvalid==true){
				$rootScope.$emit("childloading",true);
				$scope.lastDigitNumber=$scope.loginobj.phone.slice(6,10);
				var url=baseurl+"/otplogin";
				httpService.post(url,obj).then(function(response){
					//console.log(response)
					$rootScope.$emit("childloading",false);
					$scope.stage="otpverify";
					$scope.$emit("otpmsg",true);
					$scope.$emit("resendotp",false);
				},function(reason){
					$rootScope.$emit("childloading",false);
				});
				
			}
		};


		$scope.resendOtp=function(){
			$rootScope.$emit("childloading",true);
			var obj=new Object();
			obj.phone=$scope.loginobj.phone;
			var url=baseurl+"/otploginresend";
			$scope.blink=true;
			$scope.$emit("resendotp",false);
			if(!$scope.$$phase) {
				$scope.$digest();	
			}
			httpService.post(url,obj).then(function(response){
				$rootScope.$emit("childloading",false);
				$scope.blink=false;
				//console.log("$scope.blink",$scope.blink);
				if(!$scope.$$phase) {
					$scope.$digest();	
				}

				if(response.data!=undefined){
					$scope.$emit("otpverification",false);
					$scope.$emit("otpmsg",false);
					$scope.$emit("resendotp",true);
				}
				else{
					ngToast.create({
						content: "Oops ! Your OTP has expired",
						className:"warning"
					});
					return $scope.stage = "login";
				}
			},function(reason){
				$scope.blink=false;
				$rootScope.$emit("childloading",false);
			});

		};

		$scope.confirmOtp=function(obj,isvalid){
			if(isvalid==true){
				$rootScope.$emit("childloading",true);
				var url=baseurl+"/otploginverify";
				httpService.post(url,obj).then(function(response){
					$rootScope.$emit("childloading",false);
					if(response.data!=undefined&&response.data.profile!=undefined){
						var userinfo=response.data.profile;
						$rootScope.$emit("userinfo",userinfo);
						if($rootScope.prevurl!=undefined&&$rootScope.prevurl.indexOf("login")<0){
							$('#loginPopupModal').modal('hide');
							$window.location.reload();
						}
						else{
							$location.path("/");
						}
					}
					else{
						if(response.error!=undefined) {
							debugger;
							var message = response.error.message;
							if(message.indexOf("Maximum")>=0 || message.indexOf("expire")>=0) {
								ngToast.create({
									content: "Oops ! Your OTP has expired",
									className:"warning"
								});
								return $scope.stage = "login";
							}
						}
						$scope.$emit("otpverification",true);
						setTimeout(function(){
							$scope.$emit("otpverification",false);
						},1000);
					}
				},function(reason){
					$rootScope.$emit("childloading",false);
				});
			}
		};
	}]);
