var app=angular.module("relationshipManager.module",[]);
app.controller("relationshipManagerCtrl",['$scope','posFeedbackFactory','ngToast'
	,function($scope,posFeedbackFactory,ngToast){
		$scope.feedbackObj={};
		$scope.postFeedback=function(){
			posFeedbackFactory.postFeedback($scope.feedbackObj).then(function(response){
				if(response.data.data.query!=undefined){
					ngToast.create("feedback Successfully send to the concern person");
					$scope.feedbackObj.query="";
				}
				else{
					ngToast.create({
						className:"warning",
						content:"Something went wrong try after sometime"
					});
				}
			},function(reason){
				ngToast.create({
					className:"warning",
					content:"Something went wrong try after sometime"
				});
			});
		}


		$scope.init=function(){
			$scope.show=true;
			posFeedbackFactory.getManagerInfo().then(function(response){
				$scope.manager=response.data.data.detail.profile.rsm;
				$scope.show=false;
				
			},function(reason){

			})
		}
		$scope.init();
	}]);

app.factory("posFeedbackFactory",function($http,$q,urlFactory,$window){
	var obj={};
	obj.postFeedback=function(data){
		var defer=$q.defer();
		data.user=$window.sessionStorage.getItem("userId");
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/query";
		$http.post(url,data).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	obj.getManagerInfo=function(){
		//http://52.77.185.79:8179/profile?id=37970
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/profile";
		url+="?id="+$window.sessionStorage.getItem("userId");
		$http.get(url).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;

	}

	return obj;
});

app.directive("feedbackAccordian",function(){
	return{
		restrict:'EA',
		scope:true,
		replace:true,
		link:function($scope,attr,controller){
			// $(".feedback-panel-header").on("click",function(e){
			// 	$(".feedback-panel-body").slideToggle("slow");
			// })
		}
	}
})