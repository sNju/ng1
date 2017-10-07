var app=angular.module("main.module");
app.controller("sendnotificationController",["$scope","$location","partyandpartySpotobject","$httpParamSerializer","httpService","$rootScope","$filter",
	function($scope,$location,partyandpartySpotobject,$httpParamSerializer,httpService,$rootScope,$filter){
		$scope.notificationobj={};

		$scope.redirect=function(){
			$rootScope.prevurl=$location.url();
			$location.url("objectselection");s
		}

		$scope.sendnotification=function(obj,isvalid){
			if(isvalid==true){
				var object=Object.assign({},obj);
				if($scope.notificationobj.type=="link") {
					$scope.checkURL();
				}
				if($scope.notificationobj.address==undefined||$scope.notificationobj.address==0){
					delete object.latitude;
					delete object.longitude;
				}

				var url=$rootScope.apiBaseUrl;
				url+="/sendnotification";
				console.log($scope.notificationobj);
				httpService.post(url,obj).then(function(response){
					console.log("response come from post notification",response)
					$scope.$emit("status","Notification successfully send","bg-black",response.data,"notifications");
				},function(reason){
					$scope.$emit("status","","alert-danger",undefined,'');
				});
			}
		}

		$scope.$on("txtlocationtext",function($event,object){
			$scope.notificationobj.address=object.value;
			$scope.$digest();
		});

		$scope.$on("txtlocation",function($event,object){
			$scope.notificationobj.address=object.value;
			$scope.notificationobj.latitude=object.latitude;
			$scope.notificationobj.longitude=object.longitude;
			$scope.$digest();
		})



		$scope.init=function(){
			$scope.notificationobj=partyandpartySpotobject.getnotificationobj();
			$scope.profile=partyandpartySpotobject.getprofiles();
			if(Object.keys($scope.profile).length!=0){
				$scope.notificationobj.ref=$scope.profile._key;
				$scope.notificationobj.type=$scope.profile.type;
			}

			else{
				$scope.notificationobj.type='text';
			}
		}

		$scope.$watch("notificationobj",function(newValue,oldValue,scope){
			if(newValue!=oldValue){
				if(newValue.type=='link'){
					$scope.profile={};
					delete newValue.ref;
				}
				else if(newValue.type=='profile'||newValue.type=='party'){
					delete newValue.link
				}
				else{
					$scope.profile={};
					delete newValue.ref;
					delete newValue.link
				}
				partyandpartySpotobject.setnotificationobj(newValue)	
			}
			
		},true);

		$scope.$watch("")

		$scope.init();

		$scope.checkURL=function()
		{
			var data = $scope.notificationobj.link;
			var checkdata="goparties.com/search";
			if(data.indexOf(checkdata)!=-1)
			{
				//alert(data);
				var url=data;
				var search = {};
				var queryStart = url.indexOf("?") + 1,
				queryEnd   = url.indexOf("#") + 1 || url.length + 1,
				query = url.slice(queryStart, queryEnd - 1),
				pairs = query.replace(/\+/g, " ").split("&"),
				parms =  [],i, n, v, nv;

				if (query === url || query === "") return;

				for (i = 0; i < pairs.length; i++) 
				{
					nv = pairs[i].split("=", 2);
					n = decodeURIComponent(nv[0]);
					v = decodeURIComponent(nv[1]);
					search[n] = v;
				}
				console.log(search);
				$scope.notificationobj.type = "search";
				$scope.notificationobj.search = search;
			} else {
				delete $scope.notificationobj.search;
			}

		}


	}]);




// app.factory("partyandpartySpotobject",function(){
// 	var obj=new Object();
// 	var profiles={};
// 	var notificationobj={};
// 	var link={};

// 	obj.getprofiles=function(){
// 		return profiles;
// 	}

// 	obj.setprofiles=function(data){
// 		if(data.party!=undefined){
// 			var obj=data.party;
// 			profiles.title=obj.title;
// 			profiles.location=obj.location;
// 			profiles._key=obj._key;
// 			profiles.type="party";

// 		}
// 		else{
// 			var obj=data.profile;
// 			profiles.title=obj.name;
// 			profiles.location=obj.location;
// 			profiles._key=obj._key;
// 			profiles.type="profile";
// 		}

// 	}

// 	obj.resetprofiles=function(data){
// 		profiles={};
// 	}

// 	obj.getnotificationobj=function(){
// 		return notificationobj;
// 	}

// 	obj.setnotificationobj=function(data){
// 		notificationobj=data;
// 	}



// 	obj.resetnotificationobj=function(data){
// 		notificationobj=data;
// 	}

// 	obj.getlink=function(){
// 		return link;
// 	}

// 	obj.setlink=function(data){
// 		link=data;
// 	}

// 	obj.resetlink=function(data){
// 		link={};
// 	}

// 	return obj;
// });
