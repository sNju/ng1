var app=angular.module("main.module");
app.controller("relationshipmanagerController",["$scope","$rootScope","httpService",
	function($scope,$rootScope,httpService){
        $rootScope.$emit("AdminPageTitle","GPBA Help Panel");
		$scope.manager=$rootScope.userinfo.rsm;
		$scope.postquery=function(query,isvalid){
			if(isvalid==true){
				var data={};
				data.query=query;
				data.user=$rootScope.userinfo._key;
				var url=$rootScope.apiBaseUrl;
				url+="/query";
				httpService.post(url,data).then(function(response){
					if(response.data!=undefined){
						$scope.query="";
						$scope.$emit("status","Successfully Send Query","alert-success",response.data,undefined);
						
					}
					else{
						$scope.$emit("status","","alert-danger",undefined,'');
					}
				},function(reason){
					$scope.$emit("status","","alert-danger",undefined,'');
				});
			}
		}


	}]);


app.directive("relationshipManager",function(){
	return{
		restrict:'EA',
		link:function($scope,$element,$attr){
			$(document).ready(function(){
				$("#textareaId").keypress(function (e) {
					if(e.which == 13 && !e.shiftKey) {        
						$(".btn-send").click();
						e.preventDefault();
						return false;
					}
				});
			})
		}
	}
})