var app=angular.module("main.module");

app.controller("promocodesController",["$scope",'$rootScope','httpService','$httpParamSerializer'
	,function($scope,$rootScope,httpService,$httpParamSerializer){


		$scope.getallpromo=function(){
			var url=$rootScope.apiBaseUrl;
			url+="/getallpromocodes";
			httpService.get(url).then(function(response){
				console.log("response come from promod",response);
				$scope.promocodes=response.data.promocode;
			},function(reason){

			});

		}

		$scope.togglestatus=function(data,$event){
			$event.stopPropagation();
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

		$scope.init=function(){
			$scope.getallpromo();
		}

		$scope.init();
	}]);