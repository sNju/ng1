var app=angular.module("broadcastGroup.module",[]);
app.controller("broadcastGroupCtrl",['$scope','$rootScope','$stateParams','httpService',
	function($scope,$rootScope,$stateParams,httpService){
		$scope.id=$stateParams.id;
		$scope.init=function(){
			var url=$rootScope.apiBaseUrl;
			url+="/getallorders?id="+$scope.id;
			httpService.get(url).then(function(response){
				console.log("response come in broadcast controller",response);
				$scope.orders=response.data.orders;
				$scope.party=response.data.party;
			},function(reason){

			});

		}

		$scope.init();
	}]);
app.directive("mobilePartyDateTimeToggle",function(){
	return {
		replace: true,
		restrict:'EA',
		scope:true,
		link:function($scope,element,attr,controller,transclude){

			var window_width = $(window).width();


			if( window_width < 768 ) {
				$('.party-datetime-toggle').on('click', function() {

					console.log(window_width);

					$(this).closest('.booking-details-header').find('.booking-details').slideToggle('200');
				});
			}
		}
	}
});		