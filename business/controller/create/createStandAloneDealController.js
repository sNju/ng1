var app=angular.module('createStandAlone.module', ["create.module","ngMaterial","commonDirective.module","common.module"]);
app.controller('createStandAloneCtrl', ['$scope','$rootScope','$q','$http','latlongFactory','countryList',
	function($scope,$rootScope,$q,$http,latlongFactory,countryList){
		$scope.partyImage={};

		$scope.uploadImage=function(image){
			if(image!=undefined)
				$scope.partyImage.imgCover=image;
			$scope.$digest();
		}

		$scope.init=function(){
			latlongFactory.initialize();
			countryList.getCountry()
			.then(function(response){
			
			},function(error){
			});
		}
		$scope.init();
	}]);



