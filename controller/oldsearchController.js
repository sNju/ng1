var app=angular.module("search.module",["ADM-dateTimePicker"]);
app.controller("searchController",["$scope","$rootScope","distanceCalculate","httpService","dateFactory","$httpParamSerializer","genreCoversionFactory","autoCompleteThemeGenreAndProfile",
	function($scope,$rootScope,distanceCalculate,httpService,dateFactory,$httpParamSerializer,genreCoversionFactory,autoCompleteThemeGenreAndProfile){
		$scope.sortobj={};
		$scope.sortobj.category=[];
		$scope.sortobj.genre=[];
		$scope.sortobj.theme=[];

		$scope.$watch("sortobj",function(newValue,oldValue,$scope){
			if(newValue!=oldValue){
				$scope.getsearchdata(newValue);
			}
		},true);

		$scope.sortchanges=function(value){
			$scope.sortobj.sort=value;
			if(value=='n'){
				$scope.initlocation();
			}
		}

		$scope.$on("txtlocation",function($event,obj){
			//console.log("object in txt location=",obj);
			$scope.location=obj.value;
			$scope.sortobj.latitude=obj.latitude;
			$scope.sortobj.longitude=obj.longitude;
		});

		$scope.$on("autolocation",function($event,obj){
			$scope.location=obj.value;
			$scope.sortobj.latitude=obj.latitude;
			$scope.sortobj.longitude=obj.longitude;
			$scope.$digest();
			
		});

		$scope.initlocation=function(){
				distanceCalculate.initlocation();//this function is use for get current location.	
			}
			
			
			
			$scope.distance=function(lat,long){
				return distanceCalculate.getDistanceFromLatLonInKm(lat,long);
			}

			
			
			
			$scope.getsearchdata=function(data){
				$rootScope.childloading=true;
				var object=Object.assign({},data);

				// if(object.sort=='n'&&$scope.location==undefined){
				// 	console.log("assign");
				// 	object.latitude=$scope.near.latitude;
				// 	object.longitude=$scope.near.longitude;
				// }

				object.genre=genreCoversionFactory.convertGenreToString(object.genre);
				object.theme=genreCoversionFactory.convertGenreToString(object.theme);			
				object.date=dateFactory.converttoTimeStamp(object.date,"dd-mm-yyyy");
				object.category=[];

				for(var i=0;i<$scope.sortobj.category.length;++i){
					if($scope.sortobj.category[i]!=undefined&&$scope.sortobj.category[i]!=""){
						object.category.push($scope.sortobj.category[i]);
					}
				}
				object.category=object.category.join(',');
				var url=$rootScope.apiBaseUrl;
				url+="/search_v2";
				url+='?'+$httpParamSerializer(object);
				//console.log("object=",url);
				httpService.get(url).then(function(response){
					$rootScope.childloading=false;
					//console.log("response",response);
					if(response.data!=undefined)
						$scope.cards=response.data.search;
				},function(reason){

				})

			}

			// $scope.init=function(){
			// 	$scope.getsearchdata($scope.sortobj);
			// }

			// $scope.init();


			$scope.searchGenre=function(query){
				return autoCompleteThemeGenreAndProfile.querySearch(query,"loadGenre");
			}

			$scope.searchTheme=function(query){
				return autoCompleteThemeGenreAndProfile.querySearch(query,"loadGenre");
			}

		}]);

app.config(['ADMdtpProvider', function(ADMdtp) {
	ADMdtp.setOptions({
		calType: 'gregorian',
		format: 'DD/MM/YYYY',
		autoClose:true
	});
}]);

app.factory("dateFactory",function(){
	var obj={};
	obj.converttoTimeStamp=function(date,format){
		if(date!=undefined&&date!=null&&date.length>0)
		{
			var staggingDate="";
			var stagingTime="";
			if(format=="dd-mm-yyyy"){
				var staggingDate=date.substring(3,5)+"-"+date.substring(0,2)+"-"+date.substring(6,10);
			}
			else
			{
				staggingDate=date;
			}
			if(date.length>11){
				stagingTime=date.substring(11,date.length);
			}
			return new Date(staggingDate+" "+stagingTime).getTime();
		}
		else
		{
			return "";
		}
	}
	return obj;
});







app.directive("hasFilterToggle",function(){
	return{
		replace:true,
		restrict:'EA',
		scope:true,
		link:function($scope,$attr,$element,controller,transclude){
			//filter toggle 
			$(document).ready(function(){
				$('.search-filter-toggle').on('click', function(){
					$(this).next().slideToggle(600);
				});
			});
			//
		}
	}
});

