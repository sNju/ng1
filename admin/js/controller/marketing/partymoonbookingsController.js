var app=angular.module("main.module");
app.controller("partymoonbookingsController",['$scope','$stateParams','$httpParamSerializer','$rootScope','httpService','$filter','$location'
	,function($scope,$stateParams,$httpParamSerializer,$rootScope,httpService,$filter,$location){
		$scope.filterobj={};

		$scope.getallorders=function(obj){
			if($scope.txtlocation==undefined||$scope.txtlocation.length==0){
				delete obj.latitude;
				delete obj.longitude;
			}
			obj.address=$scope.txtlocation;

			var path="/partymoonbookings";
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}

			$location.url(path);
			
		}



		$scope.getallorders1=function(obj){

			var object=Object.assign({},obj);
			if(object.startdate!=undefined){
				object.startdate=$filter("dateddmmyyyytotimestamp")(object.startdate);
			}
			if(object.enddate!=undefined){
				object.enddate=$filter("dateddmmyyyytotimestamp")(object.enddate);
			}

			if($scope.txtlocation==undefined||$scope.txtlocation.length==0){
				delete object.latitude;
				delete object.longitude;
			}

			var url=$rootScope.apiBaseUrl;
			url+="/getallorderbypartymon"
			url+='?'+$httpParamSerializer(object);
			console.log("url",url);
			httpService.get(url).then(function(response){
				console.log("$scope.profiles",response);
				if(response.data!=undefined){
					$scope.sales=response.data.order;
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
			$scope.txtlocation=obj.value;
			$scope.filterobj.latitude=obj.latitude;
			$scope.filterobj.longitude=obj.longitude;
			$scope.$digest();

		});


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
			$scope.filterobj={};
			$scope.filterobj=$location.search();
			$scope.getallorders1($scope.filterobj);
		}

		
		$scope.check=0;
		// if($rootScope.init==1)
		$scope.init();





	}]);
