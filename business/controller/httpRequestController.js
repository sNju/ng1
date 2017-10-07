var httpRequest=angular.module("httpRequest.module",[]);

httpRequest.controller('httpRequestController', ['$scope', function($scope){
	
}]);

httpRequest.factory("httpRequestFactory",function($http,$q){
	var obj={};
	
	obj.httpCall=function(method,data,url)
	{
		var defer=$q.defer();
		if(method.toLowerCase()=="get")
		{
			debugger;
			$http.get(url).then(function(response){
				//console.log("data return from http call ",response)
				defer.resolve(response);
			},function(reason){
				defer.reject(reason);
			});

			
			return defer.promise;
		}
	}
	return obj;
});
