var app=angular.module("main.module");
app.controller("allelementsController",['$scope','$httpParamSerializer','$rootScope','httpService','$filter'
	,'$location','$state',
	function($scope,$httpParamSerializer,$rootScope,httpService,$filter,$location,$state){

		$scope.getallelement=function(obj){
			if($scope.txtlocation==undefined||$scope.txtlocation.length==0){
				delete obj.latitude;
				delete obj.longitude;
			}
			obj.address=$scope.txtlocation;

			obj.since=0;
			obj.limit=$rootScope.paginationcount;

			var path="/allelements";
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}

			$location.url(path);
			
		}


		$scope.getallelement1=function(obj){
			var object=Object.assign({},obj);

			if(object.startdate!=undefined){
				object.startdate=$filter("dateddmmyyyytotimestamp")(object.startdate);
			}
			if(object.enddate!=undefined){
				object.enddate=$filter("dateddmmyyyytotimestamp")(object.enddate);
			}

			var url=$rootScope.apiBaseUrl;
			url+="/allelements"
			url+='?'+$httpParamSerializer(object);
			httpService.get(url).then(function(response){
				console.log("response",response);
				if(response.data!=undefined){
					$scope.elements=response.data.allelements;
				}
				if($scope.check==0){
					$scope.check++;
					$scope.$on("$locationChangeStart",function(){
						$scope.init();
					});	
				}
			},function(reason){

			});
		}

		$scope.$on("txtlocationtext",function($event,data){
			$scope.filterobj.address=data.value;
			$scope.$digest();
		});

		$scope.$on("txtlocation",function($event,obj){
			$scope.filterobj.address=obj.value;
			$scope.filterobj.latitude=obj.latitude;
			$scope.filterobj.longitude=obj.longitude;
			$scope.$digest();

		});

		$scope.init=function(){
			$scope.filterobj=$location.search();
			$scope.getallelement1($scope.filterobj);
		}
		


		
		$scope.init();

		$scope.getclassnametype=function(status){
			var classname="";
			
			switch(status){
				case "party": 
				classname="partyrow";
				break; 
				case "profile": 
				classname="";
				break; 
				default:
				classname=""
			}
			return classname;
		}

		$scope.makeurl=function($event,obj){
			$event.stopPropagation();
			debugger;
			if(obj.party!=undefined){
				$location.url("createparty/"+obj.party._key)
			}
			else{
				$location.url("editprofile/"+obj.profile._key)
			}
		}

		$scope.enabledisableclass=function(obj){

			if(obj.party!=undefined){
				return obj.party.active;
			}
			else{
				return obj.profile.active;
			}
		}

		$scope.enableanddisable=function($event,data){
			$event.stopPropagation();

			var obj={};
			data.active=data.active==true?false:true;
			var url=$rootScope.apiBaseUrl;
			if(data.party!=undefined){
				url+="/party/?id="+data.party._key;
				data.party.active=data.party.active==false?true:false;
				obj.active=data.party.active;
			}
			else{
				url+="/profile/?id="+data.profile._key;
				data.profile.active=data.profile.active==false?true:false;
				obj.active=data.profile.active;
			}
			httpService.put(url,obj).then(function(response){
				if(response.data!=undefined&&response.data.party!=undefined){
					data.party=response.data.party;
				}
				else{
					data.profile=response.data.profile;
				}
				
			},function(reason){
				data.active=data.active==true?false:true;
			});
		}


		$scope.check=0;


	}]);

app.factory("googleAddressaddress",function($q){
	var obj=new Object();
	obj.GetAddress=function(obj){
		var defer=$q.defer();
		var lat =obj.latitude;
		var lng =obj.longitude;
		var latlng = new google.maps.LatLng(lat, lng);
		var geocoder = geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'latLng': latlng }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					defer.resolve(results[1].formatted_address);
				}
				else{
					defer.reject(false);
				}
			}
		});
		return defer.promise;

	}

	obj.getlatlongfromaddress=function(address){
		var defer=$q.defer();
		geocoder = new google.maps.Geocoder();
		geocoder.geocode( {'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var latitude=results[0].geometry.location.lat();
				var longitude=results[0].geometry.location.lng();
				$window.sessionStorage.setItem(id+"latitude",latitude);
				$window.sessionStorage.setItem(id+"longitude",longitude);
				var obj={};
				obj.value=document.getElementById(id).value;
				obj.latitude=latitude;
				obj.longitude=longitude;
				defer.resolve(obj);
			}else{
				alert("Geocode was not successful for the following reason: " + status);
				defer.reject(false);
			}
			return defer.promise;
		});
	}
	return obj;
})

