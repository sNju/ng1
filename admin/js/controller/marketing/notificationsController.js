var app=angular.module("main.module");
app.controller("notificationsController",["$scope","$httpParamSerializer","httpService","$rootScope","$filter",
	'$location',function($scope,$httpParamSerializer,httpService,$rootScope,$filter,$location){


		$scope.getallnotification=function(obj){
			var path="/notifications";
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}

			$location.url(path);
			
		}

		

		$scope.getallnotification1=function(obj){
			var object=Object.assign({},obj);

			if(object.startdate!=undefined){
				object.startdate=$filter("dateddmmyyyytotimestamp")(object.startdate);
			}
			if(object.enddate!=undefined){
				object.enddate=$filter("dateddmmyyyytotimestamp")(object.enddate);
			}

			var url=$rootScope.apiBaseUrl;
			url+="/allnotifications";
			url+='?'+$httpParamSerializer(object);

			httpService.get(url).then(function(response){
				if(response.data!=undefined){
					$scope.notifications=response.data.notifications;
				}
				$scope.users=response.data.adminuser;

				if($scope.check==0){
					$scope.check++;
					$scope.$on("$locationChangeStart",function(){
						$scope.init();
					});	
				}
			},function(reason){
				
			});
		}

		$scope.getclassname=function(type){
			switch(type){
				case "artist": 
				classname="bg-blue";
				break; 
				case "dj": 
				classname="bg-cyan";
				break; 
				case "band": 
				classname="bg-green";
				break; 
				case "party": 
				classname="bg-purple";
				break; 
				case "Partymon": 
				classname="bg-cyan";
				break; 
				default:
				classname="bg-green"
			}
			return classname;
		}

		$scope.check=0;
		$scope.init=function(){
			$scope.filterobj=$location.search();
			$scope.getallnotification1($scope.filterobj);
		}

		// if($rootScope.init==1)
		$scope.init();

		

	}]);
