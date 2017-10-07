var app=angular.module("main.module");
app.controller("performerController",["$scope","$window","$timeout","$location","$rootScope","$stateParams","httpService"
	,function($scope,$window,$timeout,$location,$rootScope,$stateParams,httpService){

		function getprofile(id){
			if(id!=null){
				var url=$rootScope.apiBaseUrl+"/profile?id="+id;
				url+="&detail=true";
				httpService.get(url).then(function(response){
					parse(response);
				},function(reason){

				});
			}
		}


		function parse(response){
			if(response!=undefined&&response.data!=undefined){
				console.log("response",$window.JSON.parse($window.JSON.stringify(response)));
				var temp=Object.assign({},response);
				$scope.buzzs=response.data.detail.buzz;
				$scope.ratings=response.data.detail.rating;
				$scope.profiledetail=response.data.detail;
				$scope.profile=$scope.profiledetail.profile;
				$scope.profile.shadow=response.data.detail.shadow;
				$scope.suggested=response.data.detail.suggested;
				$scope.profile.type="profile";
				$timeout(function(){
					$scope.$broadcast("bookingdetail",$scope.profile);
				},500);
				if($scope.profile.genre=="")
					delete $scope.profile.genre;
				if($scope.profile.theme=="")
					delete $scope.profile.theme;
				$scope.works=$scope.profiledetail.work;
				$scope.shadow=$scope.profiledetail.shadowdetails;
				$scope.live=[];
				$scope.live=$scope.profiledetail.live;
				$scope.past=[];
				$scope.past=$scope.profiledetail.past;

				// alert($scope.profile.profile_type+"---"+$scope.profile.name);
				if($scope.profile.profile_type.includes("Party Spot"))
				{
					
					$title=$scope.profile.name+"-"+$scope.profile.address+"GoParties Your Party App";
					$scope.$emit("TitlePage",$title);
				}
				else
				{
					$title=$scope.profile.name+" - "+$scope.profile.profile_type+"GoParties Your Party App";
					$scope.$emit("TitlePage",$title);
				}
				console.log("$scope.profile",$scope.profile);
				$scope.videos=$scope.profiledetail.videos;
				$scope.images=$scope.profiledetail.images;
				$scope.works=$scope.images.concat($scope.videos)
				$scope.$broadcast("loadimageGalleryhtml",$scope.works);
			}
		}


		$scope.init=function(){
			getprofile($stateParams.id);
		}
		$scope.init();

	}]);