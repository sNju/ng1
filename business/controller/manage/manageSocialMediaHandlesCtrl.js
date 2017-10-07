var app=angular.module("manageSocialMediaHandles.module",[]);
app.controller("manageSocialMediaHandlesCtrl",['$scope','ngToast','facebookLogin','getSocialMediaStatusFactory',
	function($scope,ngToast,facebookLogin,getSocialMediaStatusFactory){
		$scope.facebookConnect=false;
		$scope.instagramConnect=false;
		$scope.twitterConnect=false;
		$scope.facbookButton="CONNECT";
		$scope.twitterButton="CONNECT";
		$scope.instagramButton="CONNECT";
		
		$scope.init=function(){
			facebookLogin.init();
			$scope.socialStatus();
		}

		$scope.socialStatus=function(logout){
			logout=logout||false;
			getSocialMediaStatusFactory.getSocialMediaStatus().then(function(response){
				$scope.socialData=response.data.data.handles;
				if(response.data.data.handles.facebook!=null)
				$scope.facbookButton=response.data.data.handles.facebook.connected==true?"LOGOUT":"CONNECT";
				if(response.data.data.handles.instagram!=null)
				$scope.instagramButton=response.data.data.handles.instagram.connected==true?"LOGOUT":"CONNECT";
				if(response.data.data.handles.twitter!=null)
				$scope.twitterButton=response.data.data.handles.twitter.connected==true?"LOGOUT":"CONNECT";
				if(logout==true)
				ngToast.create("SuccessFully Logout");				 //$scope.$digest();
		},function(reason){

		});
		}
		$scope.logout=function(network){
			
			getSocialMediaStatusFactory.logout(network).then(function(response){
				if(response.data.data.success==true)
				{
					$scope.socialStatus(true);
				}
			},function(reason){

			});
		}

		$scope.init();	

	}]);

app.directive("socialMediaStatus",function(ngToast,twitterLogin,instagramLogin,getSocialMediaStatusFactory,facebookLogin){
	return{
		replace:true,
		scope:true,
		restrict:'EA',
		link:function($scope,element,attr,controller,transclude){
			$("#facebookHeader").on("click",function(e){
				if(e.target.id=="facebookButton"){
					if($scope.facbookButton=="CONNECT"){
						facebookLogin.facebook().then(function(response){
							$scope.facebookPages=response;
							$("#socialMediaPagesListModal").modal("show");
						},function(reason){

						});
					}
					else{
						$scope.logout("facebook");
						$("#facebookSlide").slideUp("slow");
					}
				}
				else{
					if($scope.facbookButton=="LOGOUT"){
						$("#twitterSlide").slideUp("slow");
						$("#instagramSlide").slideUp("slow");
						$("#facebookSlide").slideToggle("slow");
					}
				}
			});
			

			$("#twitterHeader").on("click",function(e){
				if(e.target.id=="twitterButton"){
					if($scope.twitterButton=="CONNECT"){
						var twitter=twitterLogin.twitter().then(function(response){
							if(response==true)
								$scope.socialStatus();
						},function(reason){

						});
					}
					else{
						$scope.logout("twitter");
						$("#twitterSlide").slideUp("slow");
					}

				}
				else if(e.target.id=="twitterConnect"){
					
				}
				else{
					if($scope.twitterButton=="LOGOUT"){
						$("#twitterSlide").slideToggle("slow");
						$("#instagramSlide").slideUp("slow");
						$("#facebookSlide").slideUp("slow");
					}
				}
			});

			$("#instagramHeader").on("click",function(e){
				if(e.target.id=="instagramButton"){
					if($scope.instagramButton=="CONNECT"){
						instagramLogin.instagram().then(function(response){
							if(response==true)
								$scope.socialStatus();
						},function(reason){

						});;
					}
					else{
						$scope.logout("instagram");
						$("#instagramSlide").slideUp("slow");
					}
					
				}
				else if(e.target.id=="instagramLogout"){
					
				}
				else{
					if($scope.instagramButton=="LOGOUT"){
						$("#twitterSlide").slideUp("slow");
						$("#instagramSlide").slideToggle("slow");
						$("#facebookSlide").slideUp("slow");
					}
				}
			});

			$scope.facebookPageClick=function(page){
				var obj={};
				obj.page_id=page.id;
				obj.access_token=$scope.facebookPages.access_token;
				facebookLogin.postInfo(obj).then(function(response){
					ngToast.create("Successfully Post");
					$scope.socialStatus();
				},function(reason){

				});
			}
		}
	}
});

app.factory("getSocialMediaStatusFactory",function($http,$q,urlFactory,$window){
	var obj={};
	obj.getSocialMediaStatus=function(){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/socialhandles?id=";
		url+=$window.sessionStorage.getItem("userId");
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	obj.logout=function(network){
		
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/logoutsocial";
		var data={};
		data.user=$window.sessionStorage.getItem("userId");
		data.network=network;
		$http.post(url,data).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
})