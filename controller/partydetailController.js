var app=angular.module("main.module");
app.controller('partydetailController', ['$scope','$rootScope','$timeout','httpService','$location','$stateParams','$window','authenticationService',
	function($scope,$rootScope,$timeout,httpService,$location,$stateParams,$window,authenticationService){
		$scope.party={};
		$scope.user={};
		$scope.deals=[];
		$scope.buzzs=[];
		$scope.ratings=[];
		var id=$stateParams.id;
		$scope.getparty=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/party?id="+id;
			httpService.get(url).then(function(response){
				$scope.parse(response);
			},function(reason){

			});
		}

		$scope.parse=function(response){
			if(response!=undefined&&response.data!=undefined){
				response=response.data.detail;
				$scope.party=response.party;
				$scope.party.type="party";

				if($scope.party.genre=="")
					delete $scope.party.genre;
				if($scope.party.theme=="")
					delete $scope.party.theme;
				
				$timeout(function(){
					$scope.$broadcast("bookingdetail",$scope.party);
				},500);
				
				$scope.suggested=response.suggested;
				$scope.deals=response.deal;
				$scope.buzzs=response.buzz;
				$scope.user=response.user;
				$scope.ratings=response.rating;
				$rootScope.image=$scope.party.banner;
				$title=$scope.party.title+" - "+$scope.party.address+"GoParties Your Party App";
				$scope.$emit("TitlePage",$title);
				$rootScope.title=$scope.party.title;
				$rootScope.description=$scope.party.description;

				$scope.map={
					lat:$scope.party.latitude,
					lng:$scope.party.longitude
				};
				var map = new google.maps.Map(document.getElementById('map'), {
					zoom: 12,
					center: $scope.map,
					scrollwheel: false,
					disableDoubleClickZoom: false,
					draggable: true
				});

				var marker = new google.maps.Marker({
					position:$scope.map,
					map: map
				});
				
			}
		}

		

		$scope.getRemainTime=function(date){
			return calculateRemainTime.calculate_remainingtime(date)+" "+calculateRemainTime.calculateDays_string(date);
		}

		$scope.distance=function(lat,long){
			return distanceCalculate.getDistanceFromLatLonInKm(lat,long);
		}

		$scope.checkDeal=function(obj)
		{
			return obj.hasdeal;
		}

		$scope.checkLocation=function(obj)
		{
			if(obj.location=="" || obj.location==undefined)
			{
				if(obj.address!="" && obj.address!=undefined)
				{
					obj.location=obj.address;
					return true;
				}
				else
				{
					return false;
				}
			}
			else
			{
				return true;
			}
		}

		$scope.init=function(){
			$scope.getparty(id);
		}
		$scope.init();

	}]);






app.factory('initpartydetail',function($rootScope){
	var object=new Object();
	var partybook={};
	(function(){
		$rootScope.$on("reset",function(){
			partybook={};
		});
	})();

	object.getinit=function(id){
		if(partybook[id]==undefined){
			partybook[id]={};
			partybook[id].nop_male=0;
			partybook[id].nop_female=0;
			partybook[id].nop_couple=0;
		}
		return partybook[id];
	}

	object.setinit=function(obj){
		partybook[obj.to]=obj;
	}
	return object;
});


