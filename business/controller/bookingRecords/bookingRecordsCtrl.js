var app=angular.module("bookingRecords.module",["httpRequest.module","common.module"]);
app.controller("bookingRecordsCtrl",['$scope','$stateParams','recordCountFactory','getbookedAndRequestedRecord',
	function($scope,$stateParams,recordCountFactory,getbookedAndRequestedRecord){
		$scope.bookingRequest=[];
		$scope.tabStatus=$stateParams.category;
		$scope.searchText="";
		$scope.isEmpty=false;
		$scope.init=function(){
			getbookedAndRequestedRecord.getRecord().then(function(response){
				$scope.bookingRequest=recordCountFactory.makeData(response.data.booking);
				$scope.recordCount=recordCountFactory.countRecord($scope.bookingRequest);
				if($scope.bookingRequest.length==0)
					$scope.isEmpty=true;
			},function(reason){
				console.log("error returned=",reason);
			});
		}
		$scope.filterBooking=function(param){
			$scope.tabStatus=param;
		}

		$scope.init();
	}]);

app.filter("bookingRecordSearchFilter",function(){
	return function(array,text,iscabooking){
		if(text==undefined)
			return array;
		return array.filter(function(obj){
			if(iscabooking==true){
				var temp=obj.to;
				obj.to=obj.from;
				obj.from=obj.to;
			}
			if(obj.message!=undefined&&(obj.message.toLowerCase().indexOf(text.toLowerCase())>=0))
				return true;
			if(obj.to.name!=undefined&&(obj.to.name.toLowerCase().indexOf(text.toLowerCase())>=0))
				return true;
			if(obj.to.profile_type!=undefined&&(obj.to.profile_type.toLowerCase().indexOf(text.toLowerCase())>=0))
				return true;
		})
	}
});

app.factory("recordCountFactory",function($window){
	var obj={};
	obj.countRecord=function(array)
	{
		var countObj={};
		countObj.pending=0;
		countObj.all=array.length;
		countObj.Confirmed=0;
		countObj.Cancelled=0;
		for(var i=0;i<array.length;i++)
		{
			if(array[i].status.toLowerCase()=="cancelled")
				countObj.Cancelled++;
			else if(array[i].status.toLowerCase()=="confirmed") countObj.Confirmed++;
			else
				countObj.pending++;
		}
		return countObj;
	}
	obj.makeData=function(data){
		var userId=$window.sessionStorage.getItem("userId");
		for(var i=0;i<data.length;i++){
			if(data[i].from.id!=userId){
				var temp=data[i].from;
				data[i].from=data[i].to;
				data[i].to=temp;
			}
		}
		return data;
	}
	return obj;
});

app.filter("bookingStatusFilter",function(){
	return function(array,value){
		return array.filter(function(obj){
			if(value.toLowerCase()=="all")
				return true;
			else if(obj.status==null&&value.toLowerCase()=="pending")
				return true;
			else if(obj.status==null)
				return false;
			return obj.status.toLowerCase()==value.toLowerCase();
		})
	}
});

app.directive("bookingConversation",function($window,$state){
	return {
		replace: true,
		restrict:'EA',
		scope:true,
		link:function($scope,element,attr,controller,transclude){
			var data=JSON.parse(attr.data);
			$scope.data=data;
			$scope.template="";
			if($scope.data.type=="chat"||$scope.data.type=="profile"){
				$scope.template="directive/bookingRecords/bookingConversation.html";
				var user=JSON.parse($window.sessionStorage.getItem("userInfo"))._key;
				var bookedUser;
				if(data.to._key==user){
					bookedUser=data.from;
				}
				else{
					bookedUser=data.to;
				}

				if(bookedUser!=null){
					$scope.bookedUser=bookedUser;
					$scope.profilePic=bookedUser.profile_pic;
					$scope.name=bookedUser.name;
					$scope.profileType=bookedUser.profile_type;
					$scope.user_id=bookedUser._key;
					$scope.creation_time=bookedUser.creation_time;
				}
				$scope.record_id=data._key;
				$scope.redirect="";
				if($scope.record_id==undefined){
					$scope.status="pending";
					$scope.booking_status="pending";
				}
				else{
					$scope.status=data.status;
					$scope.booking_status=data.status;
				}

				$scope.getChatButton=function(){
					if($scope.record_id==undefined)
						return "directive/bookingRecords/directchatbutton.html";

					else
						return "directive/bookingRecords/bookingchatbutton.html";
				}
				$scope.bookingMessage=data.message;
				$scope.fromDate=data.starttime;
				$scope.toDate=data.endtime;
				$scope.addStatusClass=function(status){
					if(status.toLowerCase()=="pending")
						return "";
					else if(status.toLowerCase()=="confirmed")
						return "confirmed";
					else return "cancelled";
				}
			}
			else{
				$scope.party=$scope.data.from;
				$scope.template="directive/bookingRecords/groupConversation.html"
			}
		},
		template:'<div ng-include="template"></div>',
	}
});

app.directive("bookingRecordsHeader",function($rootScope){
	return{
		replace:true,
		resrict:'EA',
		controller:'bookingRecordsCtrl',
		scope:false,
		templateUrl:"directive/bookingRecords/header.html",
		link:function($scope,element,attr,controller,transclude){
			$scope.isSearch=function(){
				if($rootScope.activetab.toLowerCase().indexOf("bookingchat")>=0)
					return true;
				return false;
			}
		}
	}
});

app.directive("groupConversation",function(){
	return {
		replace: true,
		restrict:'EA',
		scope:true,
		templateUrl:"directive/bookingRecords/groupConversation.html",
		link:function($scope,element,attr,controller,transclude){

		}
	}
});



app.factory("getbookedAndRequestedRecord",function($window,$q,httpRequestFactory,urlFactory,$http){
	var obj={};
	obj.getRecord=function(){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value+"/profile";
		var data={};
		data.id=$window.sessionStorage.getItem("userId");
		data.target="booking";
		$http({
			url:url,
			method:'GET',
			params:data
		})
		.then(function(response){
			defer.resolve(response.data);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
});



//Manoj Code For Styling
app.directive("bookingChat",function(){
	return {
		scope:true,
		replace:true,
		restirct:'EA',
		link:function($scope,element,attr,controller,transclude){
			// Booking Chat Height //
			
		}
	}
});
