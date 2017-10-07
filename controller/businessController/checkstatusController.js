var app=angular.module('checkstatus.module', ["ngAnimate"]);
app.controller("checkstatusController",["$scope","$rootScope","httpService","$window","ngToast",
	function($scope,$rootScope,httpService,$window,ngToast){
		$scope.show=false;
		$scope.init=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/order?id="+id;//+user._key;22612425
			httpService.get(url).then(function(response){
				//console.log("response",response);
				$scope.details=response.data.order;
				if(response.data.order!=undefined)
					$scope.show=true;
				else{
					ngToast.create({
						className: 'warning',
						content:'Record Not Found Please Enter Valid Order Id'});
				}
			},function(reason){

			});
		}

		$scope.$watch('ticketid', function(newValue, oldValue, scope) {
			if(newValue!=oldValue){
				if(newValue!=undefined&&newValue.toLowerCase().indexOf("bk")>=0&&
					newValue.toLowerCase().indexOf("cl")&&newValue.length>7){
					$scope.init(newValue);
			}
			else{
				$scope.show=false;
			}
		}
	});
		
	}]);

