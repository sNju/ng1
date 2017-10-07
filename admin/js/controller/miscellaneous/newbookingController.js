var app=angular.module("main.module");

app.controller("newbookingController",['$scope','$filter','$httpParamSerializer','$rootScope','httpService','$stateParams'
	,'$location'
	,function($scope,$filter,$httpParamSerializer,$rootScope,httpService,$stateParams,$location){

		$scope.getDetail=function(type, id){
			var url = $rootScope.apiBaseUrl + "/"+type+"/?id="+id;
			httpService.get(url).then(function(response){
				console.log("response",response);
				if(response.data!=undefined){
					$scope.party=response.data.detail.party;
					$scope.profile=response.data.detail.profile;
					$scope.initiateBooking(type, id);
				}
			},function(reason){
				console.log(reason);
			});
		}

		$scope.getOrderDetail=function(id){
			var url = $rootScope.apiBaseUrl + "/order/?id="+id;
			httpService.get(url).then(function(response){
				if(response.data!=undefined){
					$scope.order=response.data.order;
					$scope.order.details = response.data.order.from;
					$scope.order.selectdate=$filter("timestamptodatetimepickerformat")($scope.order.selectdate);
					console.log("$scope.order",$scope.order);
					$scope.party=response.data.order.to;
				}
			},function(reason){
				console.log(reason);
			});
		}

		$scope.increment=function(type){
			switch(type){
				case 'nop_male':
				$scope.order.nop_male++;
				break;
				case 'nop_female':
				$scope.order.nop_female++;
				break;
				case 'nop_couple':
				$scope.order.nop_couple++;
				break;
			}
		}
		$scope.selectbookingtype=function(obj,value){
			$scope.order[obj]=value;
			console.log($scope.order);
		}

		$scope.decrement=function(type){
			switch(type){
				case 'nop_male':
				$scope.order.nop_male=$scope.order.nop_male>0?$scope.order.nop_male-1:$scope.order.nop_male;
				break;
				case 'nop_female':
				$scope.order.nop_female=$scope.order.nop_female>0?$scope.order.nop_female-1:$scope.order.nop_female;
				break;
				case 'nop_couple':
				$scope.order.nop_couple=$scope.order.nop_couple>0?$scope.order.nop_couple-1:$scope.order.nop_couple;
				break;
			}
		}


		$scope.savebooking = function(orderobj) {
			var order=Object.assign({},orderobj);
			var url = $rootScope.apiBaseUrl + "/order";
			order.selectdate=$filter("dateddmmyyyytotimestamp")(order.selectdate);
			console.log("order",order);

			httpService.post(url, order).then(function(response){
				if(response.data!=undefined && response.error==undefined){
					console.log(response.data);
					var order = response.data.order;
					var path="/detail/"+order.type+"?id="+order.to._key;
					$scope.$emit("status","Booking was successfully saved","bg-green",response.data, path);
				}
			},function(reason){
				$scope.$emit("status","Something went wrong..!!","bg-red",undefined, undefined);
			});
		}


		$scope.updatebooking=function(orderobj){
			var order=Object.assign({},orderobj);
			var url = $rootScope.apiBaseUrl + "/updateorder";
			order.selectdate=$filter("dateddmmyyyytotimestamp")(order.selectdate);
			//order.id=order._key;

			delete order.from;	
			delete order.to;	
			delete order.user;
			
			console.log("order",order);



			httpService.put(url, order).then(function(response){
				if(response.data!=undefined && response.error==undefined){
					console.log(response.data);
					var order = response.data.order;
					var path="orderdetail/"+order._key;
					// var path="/detail/"+order.type+"?id="+order.to._key;
					$scope.$emit("status","Booking was successfully saved","bg-green",response.data, path);
				}
			},function(reason){
				$scope.$emit("status","Something went wrong..!!","bg-red",undefined, undefined);
			});

		}





		$scope.initiateBooking = function(type, id) {
			$scope.order = {};
			$scope.order.details={};
			$scope.order.to=id;
			$scope.order.type = type;
			$scope.order.nop_male = 0;
			$scope.order.nop_female = 0;
			$scope.order.nop_couple = 0;
			$scope.order.byweb = true;
			$scope.order.byadmin = true;
			$scope.order.self_order = true;
			$scope.order.price = '';
			$scope.order.user = 0;
			$scope.order.segment = "";
			$scope.order.status = "confirmed";
			$scope.order.mode = "poa";
		}

		$scope.init=function(){
			var obj=$location.search();
			if(obj.orderid) {
				$scope.isedit=true;
				$scope.getOrderDetail(obj.orderid);
			} else {
				$scope.getDetail($stateParams.type, obj.id);
			}
		}
		$scope.init();
	}]);
