var app=angular.module("main.module");

app.controller("partydetailController",['$scope','$filter','$httpParamSerializer','$rootScope','httpService','$stateParams'
	,'$location'
	,function($scope,$filter,$httpParamSerializer,$rootScope,httpService,$stateParams,$location){

		
		$scope.getallorders=function(obj){
			var path="/detail/"+obj.type+"?";
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}

			$location.url(path);
			
		}


		$scope.newbooking=function(obj) {
			obj=obj||{};
			debugger;
			var path="/newbooking/"+obj._id.split("/")[0]+"?id="+obj._key;
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

			var url=$rootScope.apiBaseUrl;
			url+="/elementdetails/?"+$httpParamSerializer(object);
			console.log("elementdetails url",url);
			httpService.get(url).then(function(response){
				if(response.data!=undefined){
					$scope.details=response.data.elementdetails;
					console.log("response.data.elementdetail",response.data.elementdetails);
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

		$scope.getdetail=function(obj){
			var url=$rootScope.apiBaseUrl;
			url+="/"+obj.type+"/?id="+obj.id;
			httpService.get(url).then(function(response){
				console.log("response come from detail",response);
				if(response.data!=undefined){
					debugger;
					if(response.data.detail.party!=undefined){
						$scope.typeobj=response.data.detail.party;	
					}
					else{
						$scope.typeobj=response.data.detail.profile;	
					}
					
				}
			},function(reason){

			});
		}

		$scope.init=function(){
			var object={};
			$scope.filterobj={};
			$scope.filterobj=$location.search();//$stateParams.id;
			$scope.filterobj.type=$stateParams.type;
			$scope.getallorders1($scope.filterobj);
			$scope.getdetail($scope.filterobj);
		}


		
		// $scope.$watch("filterobj",function(newVal,oldVal,scope){
		// 	if(newVal!=oldVal){
		// 		$scope.getallorders1(newVal);
		// 	}
		// },true);

		$scope.getclassname=function(role){
			var classname="";
			switch(role){
				case "pending": 
				classname="bg-orange";
				break; 
				case "cancelled": 
				classname="bg-red";
				break;
				case "confirmed": 
				classname="bg-green";
				break; 
				case "suspend": 
				classname="bg-red";
				break; 
				default:
				classname="bg-green"
			}
			return classname;
		}

		$scope.check=0;
		// if($rootScope.init==1)
		$scope.init();

		
		
	}]);
