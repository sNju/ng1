var app=angular.module("main.module");
app.controller("appconfigController",["$scope","httpService","$rootScope","$stateParams","$location"
	,function($scope,httpService,$rootScope,$stateParams,$location){

		$scope.appheaders=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/appheaders";
			httpService.get(url).then(function(response){
				if(response.data.headers!=null){
					console.log(response);
					$scope.headers=response.data.headers;
					$scope.renderUrlFromParams();
				}
			},function(reason){
				
			});
		}

		$scope.check = function() {
			if($scope.headers.party.query==undefined || $scope.headers.party.query.length==0) {
				$scope.headers.party.query = $scope.party_default;
			}
			if($scope.headers.deal.query==undefined || $scope.headers.deal.query.length==0) {
				$scope.headers.deal.query = $scope.deal_default;
			}
		}

		$scope.renderUrlFromParams = function() {
			$scope.check();
			$scope.partyurl = $scope.baseSearchUrl;
			for(var key in $scope.headers.party.query) {
				var param = key+'='+$scope.headers.party.query[key]+'&';
				$scope.partyurl+=param;
			}
			$scope.dealurl = $scope.baseSearchUrl;
			for(var key in $scope.headers.deal.query) {
				var param = key+'='+$scope.headers.deal.query[key]+'&';
				$scope.dealurl+=param;
			}
		}

		$scope.renderQueryFromUrl = function() {
			var url = $scope.partyurl;
			if(url.indexOf("goparties.com/search")>=0) {
				var data = url.substring(url.indexOf("?") + 1).split("&");
				var partyquery = {};
				for(var i=0;i<data.length;++i) {
					var values=data[i].split('=');
					var key=values[0];
					var val=values[1];
					if(key=="") {
						continue;
					}
					partyquery[key]=val;
				}
			}
			$scope.headers.party.query = partyquery;

			url = $scope.dealurl;
			if(url.indexOf("goparties.com/search")>=0) {
				var data = url.substring(url.indexOf("?") + 1).split("&");
				var dealquery = {};
				for(var i=0;i<data.length;++i) {
					var values=data[i].split('=');
					var key=values[0];
					var val=values[1];
					if(key=="") {
						continue;
					}
					dealquery[key]=val;
				}
			}
			$scope.headers.deal.query = dealquery;
		}

		$scope.updateheader=function(){
			$scope.renderQueryFromUrl();
//		    console.log($scope.headers);
//		    return;
var url=$rootScope.apiBaseUrl;
url+="/appheaders";
httpService.post(url,$scope.headers).then(function(response){
	console.log(response);
},function(reason){

});
}

$scope.init=function(){
	$scope.baseSearchUrl = "https://www.goparties.com/search?";
	$scope.headers = {deal:{},party:{}};
	$scope.party_default = {"category":"party"};
	$scope.partyurl = "";
	$scope.deal_default = {"category":"deal"};
	$scope.appheaders();
}

$scope.init();

}]);

