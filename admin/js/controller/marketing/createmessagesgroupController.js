var app=angular.module("main.module");
app.controller("createmessagesgroupController",["$scope","$stateParams","$rootScope","httpService",
	function($scope,$stateParams,$rootScope,httpService){
		$scope.getgroup=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/smsgroup/?id="+id;
			httpService.get(url).then(function(response){
				console.log("response",response);
				if(response.data!=undefined && response.data.smsgroup!=null){
					$scope.isedit=true;
					$scope.obj=response.data.smsgroup;	
				}
				
			},function(reason){
				
			});
		}

		$scope.update=function(data,isvalid){
			if(isvalid==true){
				var url=$rootScope.apiBaseUrl;
				url+="/smsgroup?id="+data._key;
				data.id=data._key;
				httpService.put(url,data).then(function(response){
					$scope.$emit("status","update smsgroup","alert-success",response.data,"sendmessages");
				},function(reason){
					$scope.$emit("status","","alert-danger",undefined,'');
				});
			}
		}


		$scope.submit=function(data,isvalid){
			if(isvalid==true){
				var url=$rootScope.apiBaseUrl;
				url+="/smsgroup"
				httpService.post(url,data).then(function(response){
					$scope.$emit("status","Add smsgroup","alert-success",response.data,"sendmessages");
				},function(reason){
					$scope.$emit("status","","alert-danger",undefined,'');
				});
			}
		}


		$scope.init=function(){
			if($stateParams.id!=undefined && $stateParams.id!=""){
				console.log("$stateParams.id",$stateParams.id);
				$scope.getgroup($stateParams.id);
			}
		}
		$scope.init();

	}]);