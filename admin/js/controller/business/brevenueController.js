var app=angular.module("main.module");
app.controller("brevenueController",["$scope",'$rootScope','httpService','$httpParamSerializer'
	,'$filter','$location',
	function($scope,$rootScope,httpService,$httpParamSerializer,$filter,$location){
		$scope.filterobj={};
        $rootScope.$emit("AdminPageTitle","GPBA Revenues");
		$scope.revenue=function(obj){
			
			var path="/revenue";
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}
			$location.url(path);
		}


		$scope.revenue1=function(data){

			var object=Object.assign({},data);
			if(object.startdate!=undefined){
				object.startdate=$filter("dateddmmyyyytotimestamp")(object.startdate);
			}
			if(object.enddate!=undefined){
				object.enddate=$filter("dateddmmyyyytotimestamp")(object.enddate);
				object.enddate+=object.enddate+86400000;
			}

			var url=$rootScope.apiBaseUrl;
			url+="/myorders";
			url+='?id='+$rootScope.userinfo._key+"&"+$httpParamSerializer(object);
			httpService.get(url).then(function(response){
				console.log("response",response);
				if(response.data!=undefined){
					$scope.revenuematrix=response.data.myorders;
				}
				else{
					$scope.revenuematrix=[];
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

		$scope.getclassname=function(status){
			var classname="";
			switch(status){
				case "confirmed": 
				classname="bg-green";
				break; 
				case "cancelled": 
				classname="bg-red";
				break; 
				default:
				classname="bg-orange"
			}
			return classname;
		}
		

		$scope.init=function(){
			$scope.filterobj=$location.search();
			$scope.revenue1($scope.filterobj);
		}
		
		$scope.check=0;
		$scope.init();
	}]);