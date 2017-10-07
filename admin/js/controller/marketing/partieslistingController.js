var app=angular.module("main.module");
app.controller("partieslistingController",['$scope','$httpParamSerializer','$stateParams','$rootScope','httpService','$filter','$location'
	,function($scope,$httpParamSerializer,$stateParams,$rootScope,httpService,$filter,$location){

		$scope.getallparty=function(obj){
			if($scope.txtlocation==undefined||$scope.txtlocation.length==0){
				delete obj.latitude;
				delete obj.longitude;
			}
			obj.address=$scope.txtlocation;
			var path=$location.path();
			if($httpParamSerializer(obj)!=""){
				path+="?"+$httpParamSerializer(obj);
			}

			$location.url(path);
			
		}
		$scope.getId=function(id){
			$rootScope.$emit("createpartyuser",id);
			$location.url('createparty/');
		}
		$scope.submitdetail=function(){
			$rootScope.$emit("internalhttpcall",true);
			var url=$rootScope.apiBaseUrl;
			url+="/onboardinglink";
			httpService.post(url,$location.search()).then(function(response){
				$rootScope.$emit("internalhttpcall",false);
				if(response.data!=undefined){
					$scope.$broadcast("opensuccessmodal",window.location.origin+"/welcome/"+response.data.onboardinglink.token);

				}
				else{
					$scope.$emit("status","Sorry, unable to process request","alert-danger",response.data,undefined);
				}
			},function(reason){

			});

		}
		$scope.getallparty1=function(obj){

			var object=Object.assign({},obj);
			if(object.startdate!=undefined){
				object.startdate=$filter("dateddmmyyyytotimestamp")(object.startdate);
			}
			if(object.enddate!=undefined){
				object.enddate=$filter("dateddmmyyyytotimestamp")(object.enddate);
			}



			var url=$rootScope.apiBaseUrl;
			url+="/partybyuser"
			url+='?'+$httpParamSerializer(object);
			httpService.get(url).then(function(response){


				if(response.data!=undefined){
					$scope.parties=response.data.party;
				}

				if($scope.check==0){
					$scope.check++;
					$scope.$on("$locationChangeStart",function(){
						$scope.init();
					});
				}

			},function(reason){

			});
		}

		$scope.redirect=function(val,id){
			$location.path(val+id);
		}

		$scope.togglestate=function(data,$event){
			$event.stopPropagation();
			data.active=data.active==false?true:false;
			var url=$rootScope.apiBaseUrl;
			url+="/party/?id="+data._key;
			httpService.put(url,data).then(function(response){
				data.active=response.data.party.active;
			},function(reason){
				data.active=data.active==true?false:true;
			});
		}


		$scope.$on("txtlocationtext",function($event,data){
			$scope.filterobj.address=data.value;
			$scope.$digest();
		});

		$scope.$on("txtlocation",function($event,obj){
			$scope.txtlocation=obj.value;
			$scope.filterobj.latitude=obj.latitude;
			$scope.filterobj.longitude=obj.longitude;
			$scope.$digest();

		});


		$scope.getclassname=function(profile_type){
			var classname="";

			switch(profile_type){
				case "Party Spot":
				classname="bg-orange";
				break;
				case "Artist":
				classname="bg-pink";
				break;
				case "Band":
				classname="bg-green";
				break;
				case "Partymon":
				classname="bg-teal";
				break;
				case "DJ":
				classname="bg-red";
				break;
				default:
				classname="bg-teal"
			}
			return classname;
		}

		($scope.getprofile=function(id){
			var url=$rootScope.apiBaseUrl;
			url+="/getprofile/?id="+id;
			httpService.get(url).then(function(response){
				if(response.data!=undefined){
					$scope.profile=response.data.profile;
					$scope.isclaimed=response.data.profile.isclaimed;

				}

			},function(reason){

			});
		}($location.search().user));

		$scope.init=function(){
			$scope.filterobj={};
			$scope.filterobj=$location.search();
			$scope.getallparty1($scope.filterobj);
			$scope.userobj={};
		}

		$scope.grantcredentials=function(){
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if($scope.profile.email!=undefined&&re.test($scope.profile.email)){
				var url=$rootScope.apiBaseUrl;
				url+="/grantdashboardaccesss";
				var data={};
				data.id=$scope.filterobj.user;
				httpService.post(url,data).then(function(response){
					if(response.data!=undefined&&response.data.grant==true){
						$scope.isclaimed=response.data.grant;
						$scope.$emit("status","Credential Granted","alert-success",response.data,undefined);
					}
					else if(response.data!=undefined&&response.data.grant==false){
						$scope.$emit("status","Email id not Exist for this user","alert-danger",response.data,undefined);
					}
					else{
						$scope.$emit("status","something went wrong","alert-danger",response.data,undefined);
					}
				},function(reason){
					$scope.$emit("status","something went wrong","alert-danger",response.data,undefined);
				});
			}
			else{
				$scope.$emit("status","Email id not Exist for this user","alert-danger",undefined,undefined);
			}
		}

		$scope.check=0;
		$scope.init();
	}]);


app.directive('modalOpen',function(){
	return {
		scope:false,
		link: function($scope, iElm, iAttrs, controller) {
			$scope.$on("opensuccessmodal",function($event,data){
				$scope.onboardinglink=data;
				$("#urlconfrm").modal("show");
			});

		}
	};
});