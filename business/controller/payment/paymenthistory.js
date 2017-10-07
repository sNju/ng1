var app=angular.module("paymenthistory.module",[]);
app.controller('paymenthistoryController', ['$scope','$rootScope','ngToast','$httpParamSerializer','$window','httpService' 
	,function($scope,$rootScope,ngToast,$httpParamSerializer,$window,httpService){
		$scope.show=true;
		$scope.init=function(){
			$scope.show=true;
			var url=$rootScope.apiBaseUrl;
			url+="/transaction?user="+JSON.parse($window.sessionStorage.getItem("userInfo"))._key;;
			httpService.get(url).then(function(response){
				$scope.details=response.data;
				$scope.history=response.data.transaction;
				$scope.show=false;
				console.log("response come from transcation hisory=",response);
			},function(reason){
			});

			var url1=$rootScope.apiBaseUrl;//this url is use for amount information
			url1+="/balance?user="+JSON.parse($window.sessionStorage.getItem("userInfo"))._key;
			httpService.get(url1).then(function(response){
				console.log("response in second segment",response);
				$scope.balance=response.data.balance;
				
			},function(reason){

			});
		}
		
		$scope.change=function(search){
			$scope.$broadcast("searchvalue",search);
		}
		$scope.filterobj={};
		$scope.filterClick=function(){
			var filterObject=Object.assign({},$scope.filterobj);
			if(filterObject.fromdate!=undefined&&filterObject.fromdate!=""){
				var obj="";
				obj=filterObject.fromdate.split('/');
				filterObject.fromdate="";
				filterObject.fromdate=new Date(obj[1]+"/"+obj[0]+"/"+obj[2]).getTime();
			}

			if(filterObject.todate!=undefined&&filterObject.todate!=""){
				var obj="";
				obj=filterObject.todate.split('/');
				filterObject.todate="";
				filterObject.todate=new Date(obj[1]+"/"+obj[0]+"/"+obj[2]).getTime();
			}
			var url=$rootScope.apiBaseUrl;
			url+="/transaction?";
			filterObject.user=JSON.parse($window.sessionStorage.getItem("userInfo"))._key;;
			url+=$httpParamSerializer(filterObject);
			httpService.get(url).then(function(response){
				$scope.details=response.data;
				$scope.history=response.data.transaction;
			},function(reason){

			});
		}

		
		$scope.init();
	}]);


app.filter("paymenthistoryfilter",function(){
	return function(array,keyword){
		if(keyword==undefined||keyword=="")
			return array;
		keyword=keyword.toLowerCase();
		return array.filter(function(obj){
			console.log("obj in filter=",obj,keyword);
			if(obj.mode.toLowerCase().indexOf(keyword)>=0||obj.towards.toLowerCase().indexOf(keyword)>=0||
				obj.status.toLowerCase().indexOf(keyword)>=0||obj.name.toLowerCase().indexOf(keyword)>=0)
				return true;
			return false;

		})
	}
})