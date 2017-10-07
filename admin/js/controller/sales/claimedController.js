var app=angular.module("main.module");
app.controller("claimedController",["$scope",'$rootScope','httpService','$httpParamSerializer'
	,'$filter','$location',
	function($scope,$rootScope,httpService,$httpParamSerializer,$filter,$location){
		$scope.filterobj={};

		$scope.getclaimed=function(obj){
			if($scope.txtlocation==undefined||$scope.txtlocation.length==0){
				delete obj.latitude;
				delete obj.longitude;
			}
			obj.address=$scope.txtlocation;
			var path="/claimed";
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}
			$location.url(path);
			
		}



		$scope.getclaimed1=function(data){
			var object=Object.assign({},data);
			if(object.startdate!=undefined){
				object.startdate=$filter("dateddmmyyyytotimestamp")(object.startdate);
			}
			if(object.enddate!=undefined){
				object.enddate=$filter("dateddmmyyyytotimestamp")(object.enddate);
			}

			var url=$rootScope.apiBaseUrl;
			url+="/claimedbusiness";
			url+='?'+$httpParamSerializer(object);
			
			httpService.get(url).then(function(response){
				
				if(response.data!=undefined){
					$scope.claimedbusiness=response.data.claimedbusiness;
				}
				else{
					$scope.claimedbusiness=[];
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

		$scope.$on("txtlocation",function($event,data){
			
			$scope.txtlocation=data.value;
			$scope.filterobj.latitude=data.latitude;
			$scope.filterobj.longitude=data.longitude;
			$scope.$digest();
		})

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
			$scope.getclaimed1($scope.filterobj);
		}

		$scope.check=0;

		
		$scope.init();

		

	}]);