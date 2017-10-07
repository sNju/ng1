var app=angular.module("main.module");
app.controller('addtinyurlController', ['$scope','$rootScope','$stateParams','$location','httpService'
	,function($scope,$rootScope,$stateParams,$location,httpService){
		var id=$stateParams.id;
		$scope.addurlobj=function(obj,isvalid){
			if(isvalid==true){
				var url=$rootScope.apiBaseUrl;
				url+="/tinyurl";
				obj.active = true;
				httpService.post(url,obj).then(function(response){
					if(response.data!=undefined)
						$scope.$emit("status","Successfully Add Url","bg-black",response.data,"tinyurl");
					else
						$scope.$emit("status",response.error.message,"alert-danger",response.data,"tinyurl");
				},function(reason){

				});
			}
		}


		$scope.updateurlobj=function(obj,isvalid){
			if(isvalid==true){
				var url=$rootScope.apiBaseUrl;
				url+="/tinyurl/?id="+$stateParams.id;
				httpService.put(url,obj).then(function(response){
					console.log("response",response);
					if(response.data!=undefined)
						$scope.$emit("status","Successfully Update Url","alert-success",response.data,"tinyurl");
					else
						$scope.$emit("status",response.error.message,"alert-danger",response.data,"tinyurl");

				},function(reason){

				});
			}
		}

		$scope.geturl=function(id){

			var url=$rootScope.apiBaseUrl;
			url+="/tinyurl/?id="+id;
			httpService.get(url).then(function(response){
				console.log("response come",response);
				if(response.data.tinyurl!=null){
					$scope.isedit=true;
					$scope.urlobj=response.data.tinyurl;
				}

			},function(reason){

			});
		}


		$scope.init=function(){
			$scope.isedit=false;
			if(id!=undefined&&id!=""){
				$scope.geturl(id);
			}
		}

		$scope.init();
	}]);
