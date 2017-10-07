var app=angular.module("main.module");

app.controller("promocodeusageController",["$scope",'$rootScope','httpService','$stateParams'
	,function($scope,$rootScope,httpService,$stateParams){

		$scope.init=function(){
			$scope.getalldata($stateParams.id);
			$scope.getstatus($stateParams.id);
		}

		$scope.getalldata=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/promocodeusage/?id="+id;
			httpService.get(url).then(function(response){
				$scope.promocodeusages=response.data.promocodeusage
			},function(reason){

			});
		}

		$scope.getstatus=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/promocode/?id="+id;
			httpService.get(url).then(function(response){
				console.log("response status",response);
				$scope.promocode=response.data.promocode;
			},function(reason){

			});

		}

		$scope.togglestatus=function(data){
			data.status=data.status==true?false:true;
			var url=$rootScope.apiBaseUrl;
			url+="/promocode/?id="+data._key;
			console.log("url",data);
			httpService.put(url,data).then(function(response){
				console.log("response come from promod",response);
				if(response.data!=undefined){
					data=response.data.promocode	
				}
				else{
					data.status=data.status==true?false:true;
				}
				
			},function(reason){
				data.status=data.status==true?false:true;
			});
		}

		$scope.getclassname=function(status){
			var classname="";
			switch(status){
				case "phone": 
				classname="bg-green";
				break; 
				case "email": 
				classname="bg-red";
				break; 
				case "facebook": 
				classname="bg-blue";
				break; 
				default:
				classname="bg-orange"
			}
			return classname;
		}
		$scope.init();
	}]);

