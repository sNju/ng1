var discoverAndBook=angular.module("discoverAndBook.module",["httpRequest.module","card.module","ngAnimate","ngToast","ngSanitize","common.module","ngMaterial","ADM-dateTimePicker"]);
discoverAndBook.controller('discoverController', ['$scope','validationRuleFactory','bookMarkedFactory','ngToast','$stateParams','$window','autoComplete','$timeout','priceRangeFactory','toastMessage','showInterestFactory','$rootScope','latlongFactory','getCardFactory','$compile','$q','initilizationFactory'
	,function($scope,validationRuleFactory,bookMarkedFactory,ngToast,$stateParams,$window,autoComplete,$timeout,priceRangeFactory,toastMessage,showInterestFactory,$rootScope,latlongFactory,getCardFactory,$compile,$q,initilizationFactory,$q){

		/* Angular JS Range Slider */
		$scope.minfromdate=new Date().getTime()-24*60*60*1000;
		$scope.show=true;
		$scope.price={
			min: 0,
			max: 5000
		};	
		$scope.validate=validationRuleFactory.getRegEx();
		$scope.minDate = moment().subtract(1, 'month');
		$scope.maxDate = moment().add(1, 'month');
		console.log("$scope.minDate",$scope.minDate);
		$scope.profile_type=$stateParams.profile_type;
		$rootScope.profile_type="all";
		$scope.keyword="";
		$scope.fromdate="";
		$scope.todate="";
		$scope.location="";
		$scope.isNearYou="recommended";
		var interest={};
		interest.fromDate="";
		interest.toDate="";
		interest.txtMessage="";
		interest.id="";
		$scope.interest=interest;
		$scope.radioValue=function(val){
			
			$scope.isNearYou=val;
			if(val=="near")
			{
				latlongFactory.currentLatLong();
			}
			
		}
		$scope.getSpecificCard=function(profile_type)
		{
			$scope.show=true;
			if(profile_type==undefined)
				profile_type="all";
			$scope.profile_type=profile_type;
			$scope.updateModel();
			getCardFactory.fetchCard($scope.profile_type,$scope.keyword,$scope.fromdate,$scope.todate,$scope.price,$scope.location,$scope.isNearYou)
			.then(function(response){

				$scope.cardBind(response);
				$scope.show=false;
			},function(error){
			});
		}

		$scope.filterClick=function(fromDate,toDate,keyword){
			debugger;
			$scope.keyword=keyword;
			$scope.fromdate=fromDate;
			$scope.todate=toDate;
			$scope.getSpecificCard($scope.profile_type);
		}
		$scope.cardBind=function(obj)
		{
			$scope.cards=obj.data.profile;

		}

		$scope.updateModel=function(){
			$scope.location=$("#txtlocation").val();
		}
		$scope.showPopUp=function(profiletype,name,profilepic,id){

			profileObj={};
			profileObj.profiletype=profiletype;
			profileObj.name=name.replace(/\s/g, '');
			profileObj.profilepic=profilepic;
			profileObj.id=id;
			$scope.profileObj=profileObj;

		}
		$scope.$on("showPopUp",function(event,profiletype,name,profilepic,id){
			$scope.showPopUp(profiletype,name,profilepic,id)
		});

		$scope.availability=[];
		$scope.globalAvail=[];
		$scope.availCount=2;
		$scope.$on("availability",function($event,data){
			$scope.availability=[];
			$scope.availCount=2;
			$scope.globalAvail=data;
			if(data.length>=2){
				for(var i=0;i<$scope.availCount;i++){
					$scope.availability.push(data[i]);
				}
			}
			else{
				$scope.availability=data;
			}

		});

		$scope.showAvailabiltyToggle=function(isCollapse){
			if($scope.availability!=undefined&&$scope.globalAvail.length>2){
				if($scope.availCount==$scope.globalAvail.length){
					$scope.availCount=2;
					$scope.availability=[];
					for(var i=0;i<$scope.availCount;i++){
						$scope.availability.push($scope.globalAvail[i]);
					}
				}
				else{
					$scope.availCount=$scope.globalAvail.length;
					$scope.availability=$scope.globalAvail;
				}

			}
			
		}
		$scope.master = {};
		$scope.isSubmit=false;
		$scope.showInterest=function(id,isValid,form){
			debugger;
			$scope.isSubmit=true;
			if(isValid==true){
				$scope.isSubmit=false;
				$scope.$emit("closeModal","showInterestModal");
				$scope.interest.id=id;
				showInterestFactory.showInterest($scope.interest).then(function(response){
					ngToast.create('Successfully Message Sent');
					$scope.interest=angular.copy($scope.master);
					form.$setPristine();
					form.$setUntouched();
				},function(showInteresterror){
					console.log("error come",error);
				});
			}
		}
		$scope.autoCompleteNameData;
		$scope.querySearch=function(query){
			//this is new code for removing autocomplete//
			var array=[];
			if(query!=null||query!=""){
				var data={};
				data.display=query;
				data.value=query;
				array.push(data);
				return array;
			}
			else {
				return query;
			}
			//temprary code end//






			if(query==null||query=="")
			{
				return $scope.autoCompleteNameData=autoComplete.querySearch(query).then(function(response){
					return response.sort(function(x,y){
						return ((x.display < y.display) ?-1 : ((x.display > y.display) ? 1 : 0));
					});;
				},function(reason){
				});
			}
			else
			{
				//console.log("controller send data=",$scope.autoCompleteNameData);	
				return autoComplete.filetrData(query,$scope.autoCompleteNameData).then(function(response){
					return response.sort(function(x,y){
						return ((x.display < y.display) ? -1 : ((x.display > y.display) ? 1 : 0));
					});;
				},function(reason){
				});
			}
			
		}
		$scope.priceRange=null;
		$scope.getPriceRange=function(){
			$timeout(function() {
				$scope.priceRange=$scope.priceRange||[
				{ id: 1, value: '0 - INR 5000' },
				{ id: 2, value: 'INR 5000 - INR 10,000' },
				{ id: 3, value: 'INR 10,000 - INR 25,000' }
				];
			}, 650);
		}

		$scope.init=function(){
			initilizationFactory.init();
			$scope.getSpecificCard($scope.profile_type);
		}
		$scope.bookMarkToggle=function(isBookmarked,id,type){
			bookMarkedFactory.bookmark(isBookmarked,id,type).then(function(response){
				ngToast.create("bookmark request sent");
				isBookmarked=isBookmarked==true?false:true;

			},function(reason){

			});
		}

		$scope.$on("bookMarkToggle",function($event,isBookmarked,id,type){
			$scope.bookMarkToggle(isBookmarked,id,type);
		});
		$scope.profile_type=$stateParams.profile_type;
		$scope.init();

	}]);


discoverAndBook.factory("bookMarkedFactory",function($http,$q,urlFactory,$window){
	var obj={};
	obj.bookmark=function(isBookMark,id,type){
		var defer=$q.defer();
		var data={};
		data.user=$window.sessionStorage.getItem("userId");
		data.to=id;
		data.type=type;
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+="/bookmark"
		$http.post(url,data).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
});

discoverAndBook.factory("showInterestFactory",function($rootScope,$q,dateFactory,urlFactory,httpMethod,$window){
	var obj={};
	var defer=$q.defer();
	obj.showInterest=function(data){
		var obj={};
		
		var defer=$q.defer();
		
		obj.startdate=(dateFactory.converttoTimeStamp(data.fromDate,"dd-mm-yyyy"));
		obj.enddate=(dateFactory.converttoTimeStamp(data.toDate,"dd-mm-yyyy"));
		obj.message=data.txtMessage;
		obj.to=data.id;
		obj.user=$window.sessionStorage.getItem("userId");
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("booking").value;
		//url+="?access_token="+urlFactory.getUrl("access_token").value;
		httpMethod.postData(url,obj).then(function(response){
			defer.resolve(response);
		},function(error){
			defer.reject(error);
		})
		return defer.promise;
	}
	return obj;
});

discoverAndBook.factory("priceRangeFactory",function($q,$timeout){
	var obj={};
	var defer=$q.defer();
	obj.getPriceRange=function(){
		return $timeout(function() {
			[
			{ id: 1, value: '0 - INR 5000' },
			{ id: 2, value: 'INR 5000 - INR 10,000' },
			{ id: 3, value: 'INR 10,000 - INR 25,000' }
			];
		}, 650);
		
	}
	return obj;
})

discoverAndBook.factory("httpMethod",function($http,$q,urlFactory,$window){
	var obj={};
	var defer=$q.defer();
	obj.postData=function(url,data){
		$http.post(url,data).then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		})
		return defer.promise;
	};
	obj.getAvailability=function(id){
		var defer=$q.defer();
		var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		url+=urlFactory.getUrl("profile").value;
		//url+="?user="+$window.sessionStorage.getItem('userId');
		url+="?id="+id;
		url+="&target=availability";
		$http.get(url).then(function(response){
			defer.resolve(response)
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
})


discoverAndBook.factory("initilizationFactory",function($compile,$q,latlongFactory){
	var obj={};
	obj.init=function(){
		var defer=$q.defer();
		$("#datefrom,#dateto").datepick({dateFormat: 'dd-mm-yyyy'}); 
		latlongFactory.initialize();
	}
	return obj;
})

discoverAndBook.factory("getCardFactory",function($window,urlFactory,$http,httpRequestFactory,$window,$q,dateFactory){
	var obj={};
	
	
	obj.fetchCard=function(profile_type,keyword,fromDate,toDate,price,location,isNearYou){
		
		var defer=$q.defer();
		
		var data={};
		var url="";
		
		if(profile_type!="all"&&profile_type!="bookmark")
			data.profile_type=profile_type;
		if(profile_type=="bookmark"){
			data.target=profile_type;
			data.type="profile";
			data.id=$window.sessionStorage.getItem("userId");
		} 
		else {
			
			data.user=$window.sessionStorage.getItem("userId");
			data.keyword=keyword;
			data.startdate=dateFactory.converttoTimeStamp(fromDate,"dd-mm-yyyy");
			data.enddate=dateFactory.converttoTimeStamp(toDate,"dd-mm-yyyy");
			data.minprice=price.min;
			data.maxprice=price.max;
			if(isNearYou=="near")
			{
				data.sort='n';
				data.latitude=$window.sessionStorage.getItem("Curlattitude");
				data.longitude=$window.sessionStorage.getItem("Curlongitude");
			}
			if(location!=undefined&&location.length>0)
			{
				data.latitude=$window.sessionStorage.getItem("latitude");
				data.longitude=$window.sessionStorage.getItem("longitude");
			}
		}
		url=urlFactory.getUrl("apiBaseUrlUpdated").value;
		if(profile_type!="bookmark")
			url+=urlFactory.getUrl("discover").value;
		else
			url+="/profile";

		console.log("data=",data);
		$http({
			url:url,
			method:'GET',
			params:data,
		}).then(function(response){
			defer.resolve(response.data);
		},function(reason){
			defer.reject(reason);
		});
		return defer.promise;
	}
	return obj;
})



discoverAndBook.factory("autoComplete",function($q,autocompleteUsersNameGetAPI){
	var obj={};
	obj.querySearch=function(query){

		var defer=$q.defer();

		var data=autocompleteUsersNameGetAPI.getUsersData().then(function(response){
			defer.resolve(response);
		},function(reason){
			defer.reject(reason);
		});

		return defer.promise;
	};

	obj.createFilter=function(query){
		var lowercaseQuery = angular.lowercase(query);
		return function filterFn(state){ 
			return (state.value.indexOf(lowercaseQuery) === 0);
		}
	}


	obj.filetrData=function(query,data){
		var defer=$q.defer();
		data.then(function(data){
			if(query==null||query=="")
			{
				defer.resolve(data);
			}
			var results = query ? data.filter(function(state){
				var lowercaseQuery = angular.lowercase(query);
				return (state.value.toLowerCase().indexOf(lowercaseQuery) === 0);
			}) :  data;
			defer.resolve(results);

		},function(reason){
			defer.reject(reason);
		})
		return defer.promise;
	};
	return obj;

});

discoverAndBook.service("autocompleteUsersNameGetAPI",function($http,$q,urlFactory,httpRequestFactory){
	var defer=$q.defer();
	var users=[];
	this.getUsersData=function(){
		if(users.length==0)
		{
			var url=urlFactory.getUrl("apiBaseUrlUpdated").value;
			url+=urlFactory.getUrl("profile").value;
			url+="?minified=true";
			
			$http.get(url).then(function(response){
				users=response.data.data.profile;
				for(var i=0;i<users.length;i++)
				{
					users[i].value=users[i].name.toLowerCase();
					users[i].display=users[i].name.toUpperCase();
				}
				defer.resolve(users);
			},function(reason){
				defer.reject(reason);
			})
		}
		else
		{
			defer.resolve(users);
		}
		return defer.promise;
	}
});



card.directive("discoverAndBookGpCard",function($rootScope,httpMethod){
	return {
		replace: true,
		restrict:'EA',
		scope:{
			profileObj:'=',
			showPopUp:'&'
		},
		templateUrl:"directive/gp-profileCard.html",
		link:function($scope,element,attr,controller,transclude){
			$scope.profile=$scope.profileObj.profile;
			//$scope.profile.crowd_quotient=4;
			$scope.isbookmarkedbyme=$scope.profileObj.bookmark;
			if($scope.profile.profile_pic!=undefined&&$scope.profile.profile_pic.length>0)
				$scope.profilepic=$scope.profile.profile_pic;
			else
				$scope.profilepic="https://s3-ap-southeast-1.amazonaws.com/gopartiesnew/images/gpba-images/user-default-pic.jpg";	

			$scope.profiletype=$scope.profile.profile_type;
			$scope.id=$scope.profile._key;
			$scope.profilecover=$scope.profile.cover==undefined?$scope.profilepic:$scope.profile.cover;
			$scope.name=$scope.profile.name;
			$scope.username=$scope.profile.username;
			$scope.rating=$scope.profile.rating;
			$scope.book=function(profiletype,name,profilepic,id){
				$scope.$emit("showPopUp",profiletype,name,profilepic,id);
				httpMethod.getAvailability(id).then(function(response){
					$scope.$emit("availability",response.data.data.availability);
				},function(reason){

				});
			}

			

			$scope.bookMarkToggle=function(isBookmarked,id,type){
				$scope.$emit("bookMarkToggle",isBookmarked,id,type);
				$scope.isbookmarkedbyme=isBookmarked=="true"?"false":"true";

			}

		}
	};
});

