(function(){
	
	var app=angular.module("profile.module",["ngToast"]);

	app.controller("verifyProfileController",['$scope','ngToast','socialMedailogin','$stateParams','verifyhttpcall'
		,function($scope,ngToast,socialMedailogin,$stateParams,verifyhttpcall){

			$scope.id=$stateParams.id;
			$scope.profile={};
			
			$scope.init=function(){
				verifyhttpcall.claimProfile($scope.id).then(function(response){
					//console.log("$scope.profile",response);
					$scope.profile=response.data.data.profile;
					$scope.changeStatus();
				},function(reason){

				});
			}

			$scope.isphone=false;
			$scope.isemail=false;
			$scope.isphoneVerify=false;
			$scope.isemailVerify=false;
			$scope.isTwitterVerify=false;
			$scope.isFacebookVerify=false;
			$scope.iswebsiteVerify=false;

			$scope.isSubmitEmail=false;
			$scope.isSubmitPhone=false;
			$scope.isSubmitWebsite=false;
			$scope.issentemailotp=false;
			$scope.issentphoneotp=false;
			$scope.isphoneotpsending=false;
			$scope.isemailotpsending=false;
			$scope.sendotp=function(type,value,isValid){
				if(type=="email"){
					$scope.isemailotpsending=true;
					$scope.isSubmitEmail=true;
				}
				else if(type=="phone"){
					$scope.isphoneotpsending=true;
					$scope.isSubmitPhone=true;
				}
				else if(type=="website"){
					$scope.isSubmitWebsite=true;
				}

				if(isValid==true){
					verifyhttpcall.sendotp($scope.id,type,value).then(function(response){
						ngToast.create("otp successfully send");

						if(type=="phone"){
							$scope.isphoneotpsending=false;
							$scope.issentphoneotp=true;
							$scope.isSubmitPhone=false;
							$scope.isphone=true;
						}
						else if(type=="email"){
							$scope.isemailotpsending=false;
							$scope.issentemailotp=true;
							$scope.isemail=true;
							$scope.isSubmitEmail=false;
						}
						else if(type=="website"){
							$scope.isSubmitWebsite=true;
						}
						$scope.$broadcast("change");

					},function(reason){

					})
				}
			}

			$scope.issubmitEmailotp=false;
			$scope.issubmitPhoneotpotp=false;
			$scope.issubmitWebsiteotp=false;
			
			$scope.verifyotp=function(type,code,isvalid){
				if(type=="email"){
					$scope.issubmitEmailotp=true;
				}
				else if(type=="phone"){
					$scope.issubmitPhoneotpotp=true;
				}
				else if(type=="website"){
					$scope.issubmitWebsiteotp=true;
				}
				if(isvalid==true){
					verifyhttpcall.verifyotp($scope.id,type,code).then(function(response){
						//console.log("otp verification response=",response);
						$scope.profile=response.data.data.profile;
						$scope.getProfileStatus();
						if(type=="phone"&&$scope.profile.phone_verify==true){
							$scope.issubmitEmailotp=false;
							ngToast.create("phone number successfully verified");
							$scope.getProfileStatus();
						}
						else if(type=="email"&&$scope.profile.email_verify==true){
							$scope.issubmitEmailotp=false;
							ngToast.create("email successfully verified");
							$scope.getProfileStatus();
						}
						else if(type=="website"&&$scope.profile.website_verify==true){
							$scope.issubmitWebsiteotp=false;
							ngToast.create("email successfully verified");
							$scope.getProfileStatus();
						}
						else
							ngToast.create({
								className:"warning",
								content:"Something went wrong"
							});

					},function(reason){

					})
				}

			}

			$scope.test=function(){
				ngToast.create({
					className:"warning",
					content:"Something went wrong"
				});
				ngToast.create("email successfully verified");
			}

			$scope.facebookLogin=function(user){
				socialMedailogin.facebook(user).then(function(response){
					if(response==true){
						$scope.getProfileStatus();
					}
					
				},function(reason){

				})
			}

			$scope.twitterLogin=function(user){
				socialMedailogin.twitter(user).then(function(response){
					if(response==true){
						$scope.getProfileStatus();
					}

				},function(reason){
					
				})
			}
			$scope.getProfileStatus=function(){
				verifyhttpcall.getProfileStatus($scope.id).then(function(response){
					$scope.profile=response.data.data.profile;
					//console.log("$scope.profile",$scope.profile);
					$scope.changeStatus();

				},function(reason){

				})
			}
			$scope.isEmailExist=true;
			$scope.isPhoneExist=true;
			$scope.changeStatus=function(){
				//console.log("$scope.profile====",$scope.profile);
				if($scope.profile!=undefined){
					$scope.isphoneVerify=$scope.profile.phone_verify;
					$scope.isemailVerify=$scope.profile.email_verify;
					$scope.isTwitterVerify=$scope.profile.twitter_verify;
					$scope.isFacebookVerify=$scope.profile.facebook_verify;
					$scope.iswebsiteVerify=$scope.profile.website_verify;

					$scope.$broadcast("verified");
					debugger;
					debugger;
					if($scope.profile.email!=undefined&&$scope.profile.email!=""){
						$scope.isemail=true;

					}
					else
					{
						$scope.isEmailExist=false;
					}
					if($scope.profile.phone!=undefined&&$scope.profile.phone!=""){
						$scope.isphone=true;
					}
					else{
						$scope.isPhoneExist=false;
					}
					// check if it isclaimed==true
					if($scope.profile.isclaimed==true) {
						// show the pop-up
						$('#verficationSuccessModal').modal({show:true,backdrop:'static'});
					}
					$scope.$emit("statusChange");
				}
			}
			$scope.init();
		}]);


app.factory("verifyhttpcall",function($http,$q,$rootScope){
	var obj={};
	obj.claimProfile=function(user){
		var defer=$q.defer();
		var url=$rootScope.apiBaseUrl;
		url+="/claim";
		url+="?user="+user;
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	obj.sendotp=function(user,type,value){
		var defer=$q.defer();
		var url=$rootScope.apiBaseUrl;
		url+="/applyverify";
		url+="?user="+user;
		url+="&type="+type;
		url+="&value="+value;
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	obj.verifyotp=function(user,type,code){
		var defer=$q.defer();
		var url=$rootScope.apiBaseUrl;
		url+="/doverify";
		url+="?user="+user;
		url+="&type="+type;
		url+="&code="+code;
		//console.log(url);
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	obj.getProfileStatus=function(user){
		var defer=$q.defer();
		var url=$rootScope.apiBaseUrl;
		url+="/profile";
		url+="?id="+user;
		url+="&detail=false"
		debugger;
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
});

app.directive("collapseStatus",function(){
	return{
		replace:true,
		scope:true,
		restrict:'EA',
		link:function($scope,$element,$attr,controller,transclude){
			$(".emailbody").slideUp();
			$(".phonebody").slideUp();

			$scope.$on("verified",function(event){
				if($scope.isemailVerify==true)
				{
					$(".emailbody").slideUp("slow");
				}
				if($scope.isphoneVerify==true){
					$(".phonebody").slideUp("slow");
				}
			});

			$scope.$on("change",function(event){
				if($scope.profile.phone_verify==false&&$scope.issentphoneotp==true){
					$(".phonebody").slideDown("slow");
				}
				if($scope.profile.email_verify==false&&$scope.issentemailotp==true){
					$(".emailbody").slideDown("slow");
				}
			});

			$(".phonehead").on("click",function(){
				debugger;
				if($scope.isPhoneExist==false&&$scope.isphoneVerify==false){
					$(".phonebody").slideDown("slow");
				}
			});

			$(".emailhead").on("click",function(el){
				debugger;
				if($scope.isEmailExist==false&&$scope.isemailVerify==false){
					$(".emailbody").slideDown("slow");
				}
			});

			$(".websitehead").on("click",function(){
				if($scope.profile.iswebsiteVerify==false){
					$(".websitebody").slideToggle("slow");
				}
			});



			$scope.$on("statusChange",function(event){
				if($scope.profile.phone_verify==true){
					$(".phonebody").slideUp();

				}
				if($scope.profile.email_verify==true){
					$(".emailbody").slideUp();
				}
				if($scope.profile.iswebsiteVerify==true){
					$(".websitebody").slideUp();
				}
			});

		}
	}
})

app.factory("socialMedailogin",function($window,$q){
	var obj={};

	obj.facebook=function(user){
		var defer=$q.defer();
		var width = 575,
		height = 400,
		left = ($(window).width() - width) / 2,
		top = ($(window).height() - height) / 2,
		url = this.href,
		opts = 'status=1' +
		',width=' + width +
		',height=' + height +
		',top=' + top +
		',left=' + left;
		var win=window.open("https://api.goparties.com/facebooklogin?user="+user+"&forverify=true", 'facebook.com', opts);

		var interval = window.setInterval(function() {
			try {
				if (win == null || win.closed) {
					window.clearInterval(interval);
					defer.resolve(true);
				}
			}
			catch (e) {
				defer.reject(false);
			}
		}, 1000);
		return defer.promise;
	}

	obj.twitter=function(user){
		var defer=$q.defer();
		var width = 575,
		height = 400,
		left = ($(window).width() - width) / 2,
		top = ($(window).height() - height) / 2,
		url = this.href,
		opts = 'status=1' +
		',width=' + width +
		',height=' + height +
		',top=' + top +
		',left=' + left;
		var win=window.open("https://api.goparties.com/twitterlogin?user="+user+"&forverify=true", 'twitter.com', opts);

		var interval = window.setInterval(function() {
			try {
				if (win == null || win.closed) {
					window.clearInterval(interval);
					defer.resolve(true);
				}
			}
			catch (e) {
				defer.reject(false);
			}
		}, 1000);
		return defer.promise;
	}


	return obj;
});
})();