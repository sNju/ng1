(function(){
	var app=angular.module('contact.model', []);
	app.controller("contactusController",["$scope","postData","$rootScope","$log","ngToast"
		,function($scope,postData,$rootScope,$log,ngToast){
			$scope.$emit("TitlePage","Contact Us-GoParties | Your Party App");
			$scope.init=function(){
				$scope.isSubmit=false;
				$scope.obj={};
			}
			$scope.init();

			$scope.submit=function(data,isValid){
				debugger;
				if(isValid==true){
					var url=$rootScope.apiBaseUrl;
					url+="/query";
					postData.post(url,$scope.obj).then(function(response){

						//console.log("response come from conroller=",response);
						if(response.data.data!=undefined){
							ngToast.create("Successfully Send");
							form.$setPristine();
							form.$setUntouched();
							$scope.init();
						}
						else
							ngToast.create({
								className:"warning",
								content:"Something went wrong"
							});
					},function(reason){
						ngToast.create({
							className:"warning",
							content:"Something went wrong"
						});
						$log.error("error occured contact us controller:",reason);
					});
				}
				else{
					$scope.isSubmit=true;
				}
			}



		}]);


	app.factory("postData",function($http,$q){
		var obj={};
		obj.post=function(url,data){
			//console.log("url,data",url,data);
			var defer=$q.defer();
			$http.post(url,data).then(function(response){
				defer.resolve(response);
			},function(reason){
				defer.reject(reason);
			});
			return defer.promise;
		}
		return obj;
	});

	app.directive("contactUsDirective",function(){
		return{
			replace:true,
			restrict:'EA',
			scope:true,
			link:function($scope,$attr,$element){
				$(document).ready(function(){
					$("#forgotPassword_popup").hide();
					$("#forgotPasswordPopup").click(function(){
						$("#businessLogin_popup").hide();
						$("#forgotPassword_popup").show();
					});
					$("#loginPopup").click(function(){
						$("#forgotPassword_popup").hide();
						$("#businessLogin_popup").show();
					});
				});
			}
		}
	})


	app.directive("googleLocationAutocomplete",function($window){
		return{
			scope:true,
			replace:true,
			restrict:'EA',
			link:function($scope,element,attr,controller,transclude){
				var id=element[0].id;
				$scope.initialize=function(id) {
					var address=(document.getElementById(id));
					var autocomplete = new google.maps.places.Autocomplete(address);
					autocomplete.setTypes(['geocode']);
					google.maps.event.addListener(autocomplete, 'place_changed', function() {
						var place = autocomplete.getPlace();
						if (!place.geometry) {
							return;
						}
						var address = '';
						if (place.address_components) {
							address = [
							(place.address_components[0] && place.address_components[0].short_name || ''),
							(place.address_components[1] && place.address_components[1].short_name || ''),
							(place.address_components[2] && place.address_components[2].short_name || '')
							].join(' ');
							$scope.codeAddress(id);
							$scope.$emit(id,document.getElementById(id).value);
						}
					});
				}
				$scope.codeAddress=function(id) {
					geocoder = new google.maps.Geocoder();
					var address = document.getElementById(id).value;
					geocoder.geocode( {'address': address}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							var latitude=results[0].geometry.location.lat();
							var longitude=results[0].geometry.location.lng();
							$window.sessionStorage.setItem(id+"latitude",latitude);
							$window.sessionStorage.setItem(id+"longitude",longitude);
						}else{
							alert("Geocode was not successful for the following reason: " + status);
						}
					});
				}
				$scope.initialize(id);
			}
		}
	});



})();