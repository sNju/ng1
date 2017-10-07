var app=angular.module("main.module");
app.controller("partymonsignupController",["$scope","$window",'$rootScope','httpService','$httpParamSerializer'
	,'$filter','$location',
	function($scope,$window,$rootScope,httpService,$httpParamSerializer,$filter,$location){
		$scope.filterobj={};

		$scope.revenue=function(obj){
			var path="/signup";
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}

			$location.url(path);
			
		}


		$scope.partymonsignup1=function(data){
			var object=Object.assign({},data);
			if(object.startdate!=undefined){
				object.startdate=$filter("dateddmmyyyytotimestamp")(object.startdate);
			}
			if(object.enddate!=undefined){
				object.enddate=$filter("dateddmmyyyytotimestamp")(object.enddate);
				object.enddate+=24*60*60*1000-1;
			}

			var url=$rootScope.apiBaseUrl;
			url+="/partymonsignup";
			url+='?'+$httpParamSerializer(object);
			httpService.get(url).then(function(response){
				console.log("response",response);
				if(response.data!=undefined){
					$scope.partymonsignup=response.data.partymoonsignup;
				}
				else{
					$scope.partymonsignup=[];
				}

				console.log("partymonsignup",$scope.partymonsignup);
				
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
			debugger;
			$scope.paginationcount=500;
			$scope.filterobj=$location.search();
			//$scope.filterobj.since=$scope.filterobj.since||0;
			$scope.filterobj.limit=$scope.filterobj.limit||$scope.paginationcount;
			$scope.partymonsignup1($scope.filterobj);
		}
		
		$scope.redirect=function($event,obj){
			$event.stopPropagation();
			var url=$rootScope.webBaseUrl;
			$window.open($rootScope.webBaseUrl+"/profile/"+obj._key, '_blank');
		}

		

		$scope.check=0;
		// if($rootScope.init==1)
		$scope.init();
	}]);