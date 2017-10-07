var app=angular.module("payoutrequest.model",[]);
app.controller("payoutrequestController",['$scope','$rootScope','ngToast','$httpParamSerializer','$window','httpService' 
	,function($scope,$rootScope,ngToast,$httpParamSerializer,$window,httpService){
		$scope.accountInfo={};
		$scope.isEdit=false;

		$scope.updateDetail=function(){
			var accountInfo=Object.assign({},$scope.accountInfo);
			var url=$rootScope.apiBaseUrl;
			url+="/payout";
			accountInfo.user=JSON.parse($window.sessionStorage.getItem("userInfo"))._key;;
			httpService.post(url,accountInfo).then(function(response){
				if(response.data!=undefined)
					ngToast.create("Payout Details Successfully Updated");
				$scope.isEdit=false;
			},function(reason){
				ngToast.create({
					className:"warning",
					content:"Something Went Wrong"
				})
			});
			
		}
		///payout?id=userid;
		$scope.claimBalance=function(){
			var accountInfo={};
			var url=$rootScope.apiBaseUrl;
			url+="/requestpayout";
			accountInfo.amount=$scope.amount;
			accountInfo.user=JSON.parse($window.sessionStorage.getItem("userInfo"))._key;;
			httpService.post(url,accountInfo).then(function(response){
				if(response.data.payout!=undefined)
					ngToast.create("Request Successfully Sent");
				$scope.amount="";
				$('#requestPayoutModal').modal('hide');
				$scope.isEdit=false;
			},function(reason){
				ngToast.create({
					className:"warning",
					content:"Something Went Wrong"
				});
			});
		};
		$scope.show=true;
		$scope.init=function(){
			$scope.show=true;
			var url=$rootScope.apiBaseUrl;//this url is use for account information
			url+="/payout?id="+JSON.parse($window.sessionStorage.getItem("userInfo"))._key;
			var url1=$rootScope.apiBaseUrl;//this url is use for amount information
			url1+="/balance?user="+JSON.parse($window.sessionStorage.getItem("userInfo"))._key;
			httpService.get(url).then(function(response){
				$scope.accountInfo=response.data.payout;
				$scope.show=false;
			},function(reason){

			});

			httpService.get(url1).then(function(response){
				$scope.balance=response.data.balance;
				$scope.amount=$scope.balance;
			},function(reason){

			});


		}

		$scope.init();



	}]);