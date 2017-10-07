var app=angular.module("profile.module",[]);
app.controller("profiledetailController",["$scope","$window","$timeout","$filter","shadowService","initprofiledetail","authenticationService","$location","distanceCalculate","$rootScope","$stateParams","httpService","$state",
	function($scope,$window,$timeout,$filter,shadowService,initprofiledetail,authenticationService,$location,distanceCalculate,$rootScope,$stateParams,httpService,$state){
		var profileId=$stateParams.id;
		$scope.id=profileId
		$scope.profileDetail=null;
		var baseUrl=$rootScope.apiBaseUrl;
		$scope.work=[];

		$scope.initlocation=function(){
			distanceCalculate.initlocation();
		}
		$scope.distance=function(lat,long){
			if(lat==undefined||long==undefined)
				return "";
			var h=distanceCalculate.getDistanceFromLatLonInKm(lat,long);
			return h;
		}

		$scope.getprofile=function(){
			if($scope.profileDetail==null){
				var url=baseUrl+"/profile?id="+profileId;
				url+="&detail=true";
				console.log("url",url);
				httpService.get(url).then(function(response){
					console.log(response);
					$scope.parse(response);
				},function(reason){

				});
			}
		}

		$scope.parse=function(response){
			if(response!=undefined&&response.data!=undefined){
				var temp=Object.assign({},response);
				$scope.buzzs=response.data.detail.buzz;
				$scope.ratings=response.data.detail.rating;
				$scope.profiledetail=response.data.detail;
				$scope.profile=$scope.profiledetail.profile;

				if($scope.profile.profile_type.indexOf("Party")<0){
					debugger;
					var url=$rootScope.getGpUrl($scope.profile);
					$location.url(url);
				}

				$scope.suggested=response.data.detail.suggested;
				console.log("$scope.profile",$scope.profile);
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
				
				$scope.googlelocation="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d140"+$scope.profile.latitude+"!2d"+$scope.profile.longitude+"!3d28.468405850000003!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x292d967e6b1bacda!2sQutub+Plaza!5e0!3m2!1sen!2sin!4v1480761244884";
				$scope.map={
					lat:$scope.profile.latitude,
					lng:$scope.profile.longitude
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
						// $scope.assignVideo(0,false);
						$scope.videos=[];
						$scope.images=[];
						for(i in $scope.works){
							if($scope.works[i].worktype=="video"){
								$scope.videos.push($scope.works[i]);
							}
							else if($scope.works[i].worktype=="image"){
								$scope.images.push($scope.works[i]);
							}
						}
						$scope.works=$scope.images.concat($scope.videos);
						console.log("$scope.works",$scope.works);
						$scope.$broadcast("loadimageGalleryhtml",$scope.works);
					}
				}

				$scope.$watch("bookingobj",function(newValue,oldValue,scope){
					if(newValue!=oldValue){
						initprofiledetail.setinit(newValue);
					}
				},true);


				$scope.init=function(){
					var x=0,y=0;
					if($rootScope.scroll[$location.url()]!=undefined){
						x=$rootScope.scroll[$location.url()].x;
						y=$rootScope.scroll[$location.url()].y;
					}
					$window.scrollTo(x, y);

					$scope.bookingobj=initprofiledetail.getinit(profileId);
					$scope.bookingobj.to=profileId;
					$scope.initlocation();
					$scope.getprofile();
				}

				$scope.checkProfileDeal=function(obj)
				{
					if(obj!=undefined)
						return obj.hasdeal;
				}

				$scope.checkLocation=function(obj)
				{
					if(obj!=undefined&&(obj.location=="" || obj.location==undefined))
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

				
				$scope.init();
			}]);



app.factory('initprofiledetail',function($rootScope){
	var object=new Object();
	var booking={};
	(function(){
		$rootScope.$on("reset",function(){
			booking={};
		});
	})();

	object.getinit=function(id){
		if(booking[id]==undefined){
			booking[id]={};
			booking[id].nop_male=0;
			booking[id].nop_female=0;
			booking[id].nop_couple=0;
			booking[id].segment='table';
		}
		return booking[id];
	}

	object.setinit=function(obj){
		booking[obj.to]=obj;
	}
	return object;
});






app.filter("formatbookingnumber",function(){
	return function(num){
		if(num<10)
			return "0"+num;
		return num;
	}
})


app.directive("profileFixedEl",function(){
	return{
		replace:true,
		restrict:'EA',
		scope:true,
		link:function($scope,element,$attr,controller,transclude){

			$scope.$on("scroll",function(event,isscroll){
				if(isscroll=="true"){
					$('html, body').animate({
						scrollTop:($("#book-table").offset().top)+600
					},500);
				}				
			});

			angular.getTestability(element).whenStable(function() {
				$(".regular").slick({
					dots: true,
					infinite: true,
					slidesToShow: 3,
					slidesToScroll: 3,
					speed: 1500,
					autoplay: false,
					autoplaySpeed: 2000,
				});

				$("body").on("click","#btn-profile",function(){
					$('html, body').animate({
						scrollTop:($("#book-table").offset().top)+80
					},500);

				});
			});
		}
	}
});

