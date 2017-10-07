var app=angular.module("main.module");
app.controller("bookingHistoryController",["$scope", "$stateParams","$rootScope","httpService","$location",function($scope, $stateParams, $rootScope, httpService,$location){
	
	
	$scope.init = function(id) {
		if($rootScope.userinfo==undefined||$rootScope.userinfo._key==undefined){

		}
		
		$scope.orders =[];
		$scope.time=new Date().getTime();
		$scope.status="upcomming";
		getorders(id);
	};

	$scope.changestatus=function(status){
		$scope.status=status;
	}

	function getorders(id){
		var url=$rootScope.apiBaseUrl+"/profile?id="+$rootScope.userinfo._key+"&target=mybooking";
		httpService.get(url).then(function(response){
			$scope.orders=response.data.order;
			console.log("response",response);
		},function(reason) {
		});
	}

	$scope.init();

	$scope.redirect=function(){
		$location.path("/delhi-ncr");
	}

}]);

app.filter("sortbytime",function(){
	return function(array,value){
		let time=new Date().getTime();
		if(value=="past"){
			return array.filter(function(obj){
				if(obj.type!='profile'){
					return obj.to.startdate<time;
				}
				else{
					return obj.startdate<time;
				}
			});
		}
		else{
			return array.filter(function(obj){
				if(obj.type!='profile'){
					return obj.to.startdate>=time;
				}
				else{
					return obj.startdate>=time;
				}
			});
		}
	}
})

app.directive("bkPdfDirective",function($window){
	return{
		restrict:'EA',
		scope:true,
		replace:true,
		link:function($scope,$element,$attr){
			$scope.download=function(){
				$window.print();
			}

		}

	}
})