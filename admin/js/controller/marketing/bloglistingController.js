var app=angular.module("main.module");
app.controller("bloglistingController",["$window","$scope",'$rootScope','httpService','$httpParamSerializer'
	,'$filter','$location',
	function($window,$scope,$rootScope,httpService,$httpParamSerializer,$filter,$location){
		$scope.filterobj={};
		$scope.revenue=function(obj){
			var path="/blogs";
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}
			$location.url(path);
		}


		$scope.blogs1=function(data){
			var object=Object.assign({},data);
			if(object.startdate!=undefined){
				object.startdate=$filter("dateddmmyyyytotimestamp")(object.startdate);
			}
			if(object.enddate!=undefined){
				object.enddate=$filter("dateddmmyyyytotimestamp")(object.enddate);
			}

			var url=$rootScope.apiBaseUrl;
			url+="/bloglisting";
			url+='?'+$httpParamSerializer(object);
			httpService.get(url).then(function(response){
				console.log("response",response);
				if(response.data!=undefined){
					$scope.blogs=response.data.bloglisting;
				}
				else{
					$scope.blogs=[];
				}

				console.log("blogs",$scope.blogs);
				
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
		

		$scope.toggleblog=function($event,data){
			$event.stopPropagation();
			data.active=data.active==false?true:false;
			data.id=data._key;
			var url=$rootScope.apiBaseUrl;
			url+="/blog";
			httpService.put(url,data).then(function(response){
				if(response.data!=undefined){
					data=response.data.blog;
					var message=data.active==true?"Successfully Enable":"Successfully Disable"
					var classname=data.active==true?"alert-success":"alert-danger";
					$scope.$emit("status",message,classname,response.data,undefined);
				}
				else{
					$scope.$emit("status","","alert-danger",undefined,'');
				}
			},function(reason){
				$scope.$emit("status","","alert-danger",undefined,'');
			});
		}

		$scope.init=function(){
			$scope.filterobj=$location.search();
			$scope.blogs1($scope.filterobj);
		}
		
		$scope.redirect=function($event,obj){
		   var data_redirect=obj.gpurl!=undefined?obj.gpurl:obj._id;
			$event.stopPropagation();
			var url=$rootScope.webBaseUrl;
			$window.open($rootScope.webBaseUrl+"/"+data_redirect, '_blank');
		}

		$scope.editblog=function($event,obj){
			$event.stopPropagation();
			$location.url("/blog/"+obj._key);
		}

		$scope.check=0;
		$scope.init();
	}]);