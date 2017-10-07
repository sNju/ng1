var app=angular.module("main.module");

app.controller("addpromocodeController",["$scope","$stateParams",'$rootScope','httpService','$location'
	,function($scope,$stateParams,$rootScope,httpService,$location){

		$scope.promoobj={};
		$scope.id=$stateParams.id;
		console.log("$scope.id",!!$scope.id);

		$scope.addpromocode=function(data,isvalid){
			if(isvalid==true){
				data.gpcoins=0;
				data._key=data.signup_code;
				data.createdat=new Date().getTime();
				data.status=true;
				data.createdat=new Date().getTime();
				var url=$rootScope.apiBaseUrl;
				url+="/promocode";
				httpService.post(url,data).then(function(response){
					console.log("response come from promod",response);
					if(response.data!=undefined){
						$scope.$emit("status","Successfully add promocode","bg-black",response.data,"promocodes");	
					}
					else{
						$scope.$emit("status",response.error.message,"bg-red",undefined,undefined);	
					}
					
				},function(reason){

				});
			}
		}


		$scope.updatepromocode=function(data,isvalid){
			if(isvalid==true){
				data.id=data._key;
				data.updatedat=new Date().getTime();
				var url=$rootScope.apiBaseUrl;
				url+="/promocode";
				httpService.put(url,data).then(function(response){
					console.log("response come from promod",response);
					if(response.data!=undefined){
						$scope.$emit("status","Successfully update promocode","bg-black",response.data,"promocodes");	
					}
					else{
						$scope.$emit("status",response.error.message,"bg-red",undefined,undefined);	
					}
					
				},function(reason){

				});
			}
		}


		$scope.getpromocde=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/promocode?id="+id;
			httpService.get(url).then(function(response){
				console.log("response come get promode",response);
				if(response.data!=undefined && response.data.promocode!=undefined){
					$scope.promoobj=response.data.promocode;
				}
			},function(reason){

			});

		}

		$scope.init=function(){
			if(!!$scope.id){
				$scope.isedit=true;
				$scope.getpromocde($scope.id);
			}
		}

		$scope.init();


		
	}]);