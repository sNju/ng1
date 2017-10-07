(function(){
	var app=angular.module("search.module",[]);
	app.controller("searchController",['$scope','$window','httpService','$rootScope','claimListinghttpcall','$filter','makeDataFactory'
		,function($scope,$window,httpService,$rootScope,claimListinghttpcall,$filter,makeDataFactory){
			$scope.isAddProfile=false;
			$scope.profileObj={};
			$scope.addProfileClick=function(){
				$scope.isAddProfile=true;
				$scope.$emit("isAddProfile",$scope.isAddProfile);
			}

			$scope.init=function(){
				claimListinghttpcall.getCities().then(function(response){
					$scope.cities=makeDataFactory.makeCities(response.data.data.countries);
					//console.log("response come from city",$scope.cities);
				},function(reason){

				});
			}
			$scope.querySearch=function(query){
				 var data=$filter("filterData")(query,$scope.cities)
				 //console.log("data of city autocomplete=",data);
				 return data;
			}

			$scope.reset=function(){
				$scope.city="";
			}



			$scope.profiles=[];
			$scope.getProfile=function(keyword){
				var url=$rootScope.apiBaseUrl+"/claimsearch";
				url+="?latitude="+$window.sessionStorage.getItem("searchLocationlatitude");
				url+="&longitude="+$window.sessionStorage.getItem("searchLocationlongitude");
				url+="&keyword="+keyword;
				httpService.get(url).then(function(response){
					//console.log("response come",response);
					$scope.profiles=response.data.profile;
				},function(reason){

				});
			}
			$scope.addProfile=function(obj){
				debugger;
				claimListinghttpcall.addProfile(obj).then(function(response){
					if(response.data.data!=undefined){
						ngToast.create("successfully Profile post");
						$scope.isAddProfile=false;
					}

				},function(reason){
					ngToast.create({
						className:"warning",
						content:"Something went wrong"
					});
				})
			}
			$scope.init();
		}]);


	app.filter("filterData",function(){
		return function(query,cities)
		{
			if(query==undefined||query==null)
				return cities;
			return cities.filter(function(data){
				if(data.city!=undefined&&(data.city.toLowerCase().indexOf(query.toLowerCase())>=0))
					return true;
				return false;
			});
		}
	})


	app.factory("claimListinghttpcall",function($http,$q,$window,$rootScope){
		var obj={};
		
		obj.getCities=function(){
			var apiBaseUrl=$rootScope.apiBaseUrl;
			var defer=$q.defer();
			apiBaseUrl+="/countries";
			$http.get(apiBaseUrl).then(function(response){
				//console.log("response of country controller",response);
				defer.resolve(response);
			},function(reason){
				defer.reject(reason);
			});
			return defer.promise;
		}
		obj.getProfile=function(city_id,keyword){
			var defer=$q.defer();
			keyword=keyword==undefined?"":keyword;
			var apiBaseUrl=$rootScope.apiBaseUrl;
		//JSON.parse($window.sessionStorage.getItem("userInfo")).city_id
		apiBaseUrl+="/claimsearch?city_id="+city_id+"&keyword="+keyword;
		$http.get(apiBaseUrl).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	obj.addProfile=function(data){
		var defer=$q.defer();
		var apiBaseUrl=$rootScope.apiBaseUrl;
		apiBaseUrl+="/register";
		$http.post(apiBaseUrl,data).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
});


	app.factory("makeDataFactory",function(){
		var obj={};
		obj.makeCities=function(array){
			var cities=[];
			for(var i=0;i<array.length;i++){
				for(var j=0;j<array[i].city.length;j++){
					cities.push(array[i].city[j]);
				}
			}

			return cities.sort(function(a,b){
				var citya=a.city.toUpperCase();
				var cityb=b.city.toUpperCase();
				if (citya < cityb) {
					return -1;
				}
				if (citya > cityb) {
					return 1;
				}
				return 0;

			})
		}
		return obj;
	})




	app.directive("claimProfile",function(){
		return{
			replace:true,
			restrict:'EA',
			scope:{
				profileObj:'='
			},
			templateUrl:"directive/claimlisting/profile.html",
			link:function($scope,$element,$attr,controller,transclude){
				
			}
		}
	});

	app.directive("addProfile",function(){
		return{
			replace:true,
			restrict:'EA',
			scope:false,
			templateUrl:"directive/claimlisting/addProfile.html",
			link:function($scope,$element,$attr,controller,transclude){

			}
		}
	});
})();