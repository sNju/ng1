var app=angular.module("main.module");

app.controller("homeController",["$scope",'$rootScope','httpService','$window','$location'
	,function($scope,$rootScope,httpService,$window,$location){
		$scope.init=function(){
			$scope.getalldata();
			$scope.getmonthstats();
		}

		$scope.getalldata=function(){
			var url=$rootScope.apiBaseUrl;
			url+="/aawebhome";
			$rootScope.internalhttpcall=true;
			httpService.get(url).then(function(response){
				console.log("response",response);
				$rootScope.internalhttpcall=false;
				if(response.data!=undefined){
					$scope.sales=response.data.home.sales;
					$scope.particulars=response.data.home.elements;
					$scope.feedbacks=response.data.home.feedbacks;
					console.log("$scope.particulars",$scope.particulars);
				}
			},function(reason){
				$rootScope.internalhttpcall=false;
			});
		}

		$scope.getmonthstats=function(){
			var url=$rootScope.apiBaseUrl;
			url+="/getmonthstats";
			$scope.stats = {};
			$scope.stats.bookings = "...";
			$scope.stats.signups = "...";
			$scope.stats.nop = "...";
			$scope.stats.business = "...";
			$rootScope.internalhttpcall=true;
			httpService.get(url).then(function(response){
				console.log("response",response);
				$rootScope.internalhttpcall=false;
				if(response.data!=undefined){
					$scope.stats=response.data.stats;
				}
			},function(reason){
				$rootScope.internalhttpcall=false;
			});
		}
		$scope.getclassname=function(status){
			var classname="";
			if(status.indexOf('can')>=0){
				status="cancelled";
			}
			switch(status){
				case "confirmed": 
				classname="bg-green";
				break; 
				case "cancelled": 
				classname="bg-red";
				break; 
				default:
				classname="bg-orange"
			}
			return classname;
		}

		

		$scope.getclassnametype=function(status){
			var classname="";
			
			switch(status){
				case "party": 
				classname="partyrow";
				break; 
				case "profile": 
				classname="";
				break; 
				default:
				classname=""
			}
			return classname;
		}

		$scope.feedbackshow=function(obj){
			$scope.feedbackmessage=obj;
		}

		$scope.removefeedback=function(array,index){
			$scope.$emit("internalhttpcall",true);
			var data=array[index];
			var url=$rootScope.apiBaseUrl;
			url+="/query?id="+data._key;
			var obj={};
			obj.read=true;
			httpService.put(url,obj).then(function(response){
				console.log("response come from remove",response);
				if(response.data!=undefined){
					array.splice(index,1);
				}
				$scope.$emit("internalhttpcall",false);
			},function(reason){
				$scope.$emit("internalhttpcall",false);
			});
		}

		$scope.openprofile=function(id){
			if(id!=undefined&&id!=""){
				$window.open($rootScope.webBaseUrl+'/#/profile/'+id, '_blank');
			}
		}

		$scope.init();
	}]);


app.filter("feedbackfilter",function($filter){
	return function(array,startdate,enddate){
		if(array==undefined)
			return array;
		startdate=startdate==undefined?-8640000000000000:$filter("dateddmmyyyytotimestamp")(startdate);
		enddate=enddate==undefined?8640000000000000:$filter("dateddmmyyyytotimestamp")(enddate);
		return array.filter(function(obj){
			if((startdate==undefined||obj.createdat>=startdate)&&(enddate==undefined||obj.createdat<=enddate)){
				return true;
			}
			else{
				return false;
			}

		})
	}
});
