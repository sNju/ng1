var app=angular.module("main.module");
app.controller('orderdetailController', ['$scope','$rootScope','httpService','$stateParams','$location','$window'
	,function($scope,$rootScope,httpService,$stateParams,$location,$window){
		$scope.id=$stateParams.id;
		var redirectUrl="../";
		$scope.init=function(){
			$scope.get($stateParams.id);
		}


		$scope.editBooking=function(order){
			var url = '/newbooking/'+order.type+'?orderid='+order._key;
			$location.url(url);
		}

		$scope.getRedirectUrl=function(data){
			if(data==undefined){}
				else{
					if(data.gpurl!=undefined && data.gpurl!=""){
						return redirectUrl+data.gpurl;
					}
					else{
						return redirectUrl+data._id;
					}
				}
			}
			$scope.get=function(id){
				var url=$rootScope.apiBaseUrl;
				url+="/getorderdetails/?id="+id;
				httpService.get(url).then(function(response){
					console.log("orderresponse",response);
					$scope.orderdetail=response.data.order;
					debugger;
					// find booking source
					$scope.orderdetail.source = "ADMIN";
					if($scope.orderdetail.byweb==true) {
						$scope.orderdetail.source = "WEB";
					} else if($scope.orderdetail.self_order==true) {
						$scope.orderdetail.source = "ADMIN"
					} else if($scope.orderdetail.from.iostoken!=null||$scope.orderdetail.from.gpca_devicetoken!=null) {
						$scope.orderdetail.source = "iOS"
					} else {
						$scope.orderdetail.source = "Android";
					}
				},function(reason){

				});
			}


			$scope.checkuserData=function(data){
				if(data!=undefined && data!=""){
					return true;
				}
				else{
					return false;
				}
			}
			$scope.checksegment=function(data){
				if(data==' - ' || data=='poa' || data=='-'){
					return false;
				}
				else{
					return true;
				}
			}

			$scope.checktype=function(data){
				if(data=="profile"){
					return true;
				}
				else{
					return false;
				}
			}

			$scope.changestatus=function(id,status){
				var object=new Object();
				var prev=$scope.orderdetail.status;
				$scope.orderdetail.status=status;
				object.status=status;
				object.id=id;
				var url=$rootScope.apiBaseUrl;
				url+="/updateorderstatus";
				httpService.post(url,object).then(function(response){
					if(response.data!=undefined&&response.data.updateorderstatus==true){

					}
					else{
						$scope.orderdetail.status=prev;
					}
					$scope.$emit("status",$scope.orderdetail.status,$scope.orderdetail.status=="confirmed"?"alert-success":"alert-danger",response.data,undefined);
				},function(reason){

				});
			}


			$scope.delete=function(id){
				var data={};
				data.id=id;
				data.user=$rootScope.userinfo._key;
				var url=$rootScope.apiBaseUrl;
				url+="/deleteorder";
				httpService.post(url,data).then(function(response){
					if(response.data!=undefined){
						$scope.$emit("status","Order Deleted","alert-success",response.data,"/");	
					}
					else{
						$scope.$emit("status","something went wrong","alert-danger",response.data,undefined);		
					}
					
				},function(reason){

				});

			}

			$scope.init();

			$scope.download=function(){
				$window.print();
			}

		}])

