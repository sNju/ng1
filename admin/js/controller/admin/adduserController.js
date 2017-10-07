var app=angular.module("main.module");
app.controller("adduserController",["$scope","httpService","$rootScope","$stateParams","$location"
	,function($scope,httpService,$rootScope,$stateParams,$location){


		$scope.id=$stateParams.id;
		$scope.getuser=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/adminuser/?id="+id;
			httpService.get(url).then(function(response){
				console.log("response",response);
				if(response.data.adminuser!=null){
					$scope.isedit=true;
					$scope.user=response.data.adminuser;	
				}
				
			},function(reason){
				
			});
		}

		$scope.status=function(message,classname,data,path){
			message1=data==undefined?"something went wrong":message;
			$scope.$emit("message",{
				message:message1,
				classname:classname
			});
			if(data!=undefined&&path!=undefined){
				$location.path(path);
			}
		}
		$scope.updateuser=function(data,isvalid){
			if(isvalid==true){
				var url=$rootScope.apiBaseUrl;
				url+="/adminuser/?id="+data._key;
				httpService.put(url,data).then(function(response){
					$scope.$emit("status","update user information","alert-success",response.data,"users");
				},function(reason){
					$scope.$emit("status","","alert-danger",undefined,'');
				});
			}
		}
		
		$scope.adduser=function(data,isvalid){
			if(isvalid==true){
				data.active=true;
				var url=$rootScope.apiBaseUrl;
				url+="/adminuser";
				httpService.post(url,data).then(function(response){
					$scope.$emit("status","successfully user added","alert-success",response.data,"users");
				},function(reason){
					$scope.$emit("status","","alert-danger",undefined,"");
				});
			}
		}

		$scope.init=function(){
			$scope.user=undefined;
			$scope.isedit=false;
			if($scope.id!=undefined&&$scope.id!=""){
				$scope.getuser($scope.id);
			}

		}

		$scope.init();

	}]);

