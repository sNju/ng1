(function(){
	var app=angular.module("ba.module",[]);
	app.directive("contactUs",function($window,$rootScope,httpService,ngToast){
		return{
			restrict:'EA',
			replace:true,
			scope:false,
			templateUrl:"directive/contactus.html",
			link:function($scope,$attr,$element){
				$scope.isSubmit=false;
				$scope.submit=function(data,isvalid,form){
					if(isvalid==true){
						var url=$rootScope.apiBaseUrl;
						url+="/register";
						data.latitude=$window.sessionStorage.getItem("userlocationlatitude");
						data.longitude=$window.sessionStorage.getItem("userlocationlongitude");
						httpService.post(url,data).then(function(response){
							if(response.data!=undefined){
								ngToast.create("Successfully Post");
								$scope.isSubmit=false;
								form.$setPristine();
								form.$setUntouched();
								$scope.init();
							}
							else{
								ngToast.create({
									className:"warning",
									content:"Something went wrong"
								});
							}
						},function(reason){
							ngToast.create({
								className:"warning",
								content:"Something went wrong"
							});
						});
					}
					else{
						$scope.isSubmit=true;
					}
				}
			}
		}
	});
})();